<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['patient_name', 'generic_name', 'dosage', 'form', 'quantity_dispensed', 'notes'])]
class DispensationRecord extends Model
{
    //
}
