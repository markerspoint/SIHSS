<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['first_name', 'middle_name', 'last_name', 'suffix', 'age', 'civil_status', 'birthdate', 'barangay', 'generic_name', 'dosage', 'form', 'quantity_dispensed', 'notes'])]
class DispensationRecord extends Model
{
    //
}
