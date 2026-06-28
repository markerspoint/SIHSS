<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModuleAccessTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that guests (unauthenticated users) are redirected to the home page.
     */
    public function test_guest_is_redirected_to_home()
    {
        $response = $this->get(route('medical.geotagging'));

        $response->assertRedirect('/');
    }

    /**
     * Test that a standard user (role 'jo') without module access is unauthorized for medical routes.
     */
    public function test_jo_role_user_without_module_access_cannot_access_medical_routes()
    {
        $user = User::factory()->create([
            'employee_id' => 'emp123',
            'role' => 'jo',
            'accessible_modules' => [],
        ]);

        $response = $this->actingAs($user)->get(route('medical.geotagging'));

        $response->assertStatus(403);
    }

    /**
     * Test that a standard user (role 'jo') with module access can access medical routes.
     */
    public function test_jo_role_user_with_module_access_can_access_medical_routes()
    {
        $user = User::factory()->create([
            'employee_id' => 'emp123',
            'role' => 'jo',
            'accessible_modules' => ['mental_health'],
        ]);

        $response = $this->actingAs($user)->get(route('medical.geotagging'));

        $response->assertOk();
    }

    /**
     * Test that a medical user without the mental_health module permission is denied access.
     */
    public function test_medical_user_without_mental_health_module_access_is_forbidden()
    {
        $user = User::factory()->create([
            'employee_id' => 'med123',
            'role' => 'medical',
            'accessible_modules' => [], // No mental health access
        ]);

        $response = $this->actingAs($user)->get(route('medical.geotagging'));

        $response->assertStatus(403);
        $response->assertSee('Unauthorized access to the mental health module.');
    }

    /**
     * Test that a medical user with the mental_health module permission is granted access.
     */
    public function test_medical_user_with_mental_health_module_access_can_access()
    {
        $user = User::factory()->create([
            'employee_id' => 'med123',
            'role' => 'medical',
            'accessible_modules' => ['mental_health'],
        ]);

        $response = $this->actingAs($user)->get(route('medical.geotagging'));

        $response->assertOk();
    }

    /**
     * Test that an admin user always has access to the module.
     */
    public function test_admin_user_can_access_module_regardless_of_permissions()
    {
        $user = User::factory()->create([
            'employee_id' => 'admin123',
            'role' => 'admin',
            'accessible_modules' => [], // Empty modules
        ]);

        $response = $this->actingAs($user)->get(route('medical.geotagging'));

        $response->assertOk();
    }
}
