<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['patient_name', 'pharmacy_item_id', 'quantity_dispensed', 'notes'])]
class DispensationRecord extends Model
{
    /**
     * Get the pharmacy item associated with the dispensation record.
     */
    public function pharmacyItem(): BelongsTo
    {
        return $this->belongsTo(PharmacyItem::class);
    }
}
