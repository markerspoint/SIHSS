<?php

namespace Tests\Feature;

use App\Models\DispensationRecord;
use App\Models\PharmacyItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PharmacyTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that guest users are redirected.
     */
    public function test_pharmacy_module_requires_authentication()
    {
        $response = $this->get(route('medical.pharmacy.inventory'));
        $response->assertRedirect('/');
    }

    /**
     * Test that users without 'pharmacy' module access are forbidden.
     */
    public function test_pharmacy_module_requires_pharmacy_module_access()
    {
        $user = User::factory()->create([
            'employee_id' => 'med123',
            'role' => 'medical',
            'accessible_modules' => [], // No pharmacy module access
        ]);

        $response = $this->actingAs($user)->get(route('medical.pharmacy.inventory'));
        $response->assertStatus(403);
    }

    /**
     * Test that authorized users can view the inventory.
     */
    public function test_authorized_user_can_view_inventory()
    {
        $user = User::factory()->create([
            'employee_id' => 'med123',
            'role' => 'medical',
            'accessible_modules' => ['pharmacy'],
        ]);

        $response = $this->actingAs($user)->get(route('medical.pharmacy.inventory'));
        $response->assertOk();
    }

    /**
     * Test that authorized users can add drugs to inventory.
     */
    public function test_authorized_user_can_add_drug_to_inventory()
    {
        $user = User::factory()->create([
            'employee_id' => 'med123',
            'role' => 'medical',
            'accessible_modules' => ['pharmacy'],
        ]);

        $drugData = [
            'generic_name' => 'Paracetamol',
            'dosage' => '500mg',
            'form' => 'Tablet',
            'quantity' => 100,
            'unit' => 'tabs',
            'expiration_date' => '2027-12-31',
            'batch_number' => 'B123',
        ];

        $response = $this->actingAs($user)->post(route('medical.pharmacy.inventory.store'), $drugData);
        $response->assertRedirect();
        
        $this->assertDatabaseHas('pharmacy_items', [
            'generic_name' => 'Paracetamol',
            'quantity' => 100,
        ]);
    }

    /**
     * Test dispensing drugs deducts stock and logs dispensation.
     */
    public function test_user_can_dispense_medicine()
    {
        $user = User::factory()->create([
            'employee_id' => 'med123',
            'role' => 'medical',
            'accessible_modules' => ['pharmacy'],
        ]);

        $drug = PharmacyItem::create([
            'generic_name' => 'Amoxicillin',
            'dosage' => '500mg',
            'form' => 'Capsule',
            'quantity' => 200,
            'unit' => 'caps',
            'expiration_date' => '2027-06-30',
            'batch_number' => 'B456',
        ]);

        $dispenseData = [
            'patient_name' => 'John Doe',
            'pharmacy_item_id' => $drug->id,
            'quantity_dispensed' => 20,
            'notes' => 'Take 1 cap 3x daily',
        ];

        $response = $this->actingAs($user)->post(route('medical.pharmacy.dispensing.store'), $dispenseData);
        $response->assertRedirect();

        // Check stock was decremented
        $this->assertEquals(180, $drug->fresh()->quantity);

        // Check log was created
        $this->assertDatabaseHas('dispensation_records', [
            'patient_name' => 'John Doe',
            'pharmacy_item_id' => $drug->id,
            'quantity_dispensed' => 20,
        ]);
    }

    /**
     * Test dispensing more than available stock is blocked.
     */
    public function test_user_cannot_dispense_more_than_available_stock()
    {
        $user = User::factory()->create([
            'employee_id' => 'med123',
            'role' => 'medical',
            'accessible_modules' => ['pharmacy'],
        ]);

        $drug = PharmacyItem::create([
            'generic_name' => 'Amoxicillin',
            'dosage' => '500mg',
            'form' => 'Capsule',
            'quantity' => 10,
            'unit' => 'caps',
            'expiration_date' => '2027-06-30',
            'batch_number' => 'B456',
        ]);

        $dispenseData = [
            'patient_name' => 'John Doe',
            'pharmacy_item_id' => $drug->id,
            'quantity_dispensed' => 20, // Exceeds stock (10)
        ];

        $response = $this->actingAs($user)->post(route('medical.pharmacy.dispensing.store'), $dispenseData);
        $response->assertSessionHasErrors('quantity_dispensed');

        // Quantity should remain unchanged
        $this->assertEquals(10, $drug->fresh()->quantity);
    }

    /**
     * Test reversing a dispensation returns the stock to inventory and deletes the record.
     */
    public function test_user_can_reverse_dispensation()
    {
        $user = User::factory()->create([
            'employee_id' => 'med123',
            'role' => 'medical',
            'accessible_modules' => ['pharmacy'],
        ]);

        $drug = PharmacyItem::create([
            'generic_name' => 'Amoxicillin',
            'dosage' => '500mg',
            'form' => 'Capsule',
            'quantity' => 180,
            'unit' => 'caps',
            'expiration_date' => '2027-06-30',
            'batch_number' => 'B456',
        ]);

        $dispensation = DispensationRecord::create([
            'patient_name' => 'John Doe',
            'pharmacy_item_id' => $drug->id,
            'quantity_dispensed' => 20,
            'notes' => 'Test Notes',
        ]);

        $response = $this->actingAs($user)->delete(route('medical.pharmacy.dispensing.destroy', $dispensation->id));
        $response->assertRedirect();

        // Stock should be incremented back (180 + 20 = 200)
        $this->assertEquals(200, $drug->fresh()->quantity);

        // Record should be deleted
        $this->assertDatabaseMissing('dispensation_records', [
            'id' => $dispensation->id,
        ]);
    }
}
