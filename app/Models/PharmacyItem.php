<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['generic_name', 'dosage', 'form', 'quantity', 'unit', 'expiration_date', 'batch_number'])]
class PharmacyItem extends Model
{
    /**
     * Get the dispensations for the pharmacy item.
     */
    public function dispensations(): HasMany
    {
        return $this->hasMany(DispensationRecord::class);
    }
}
