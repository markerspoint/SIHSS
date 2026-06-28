export interface Patient {
    name: string;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    suffix: string | null;
    age: number;
    civil_status: string;
    birthdate: string;
    barangay: string;
}

export interface DispensationRecord {
    id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    suffix: string | null;
    age: number;
    civil_status: string;
    birthdate: string;
    barangay: string;
    generic_name: string;
    dosage: string;
    form: string;
    quantity_dispensed: number;
    notes: string | null;
    created_at: string;
}

export interface MedicationLog {
    id: number;
    generic_name: string;
    dosage: string;
    form: string;
    quantity_dispensed: number;
    notes: string | null;
    date: string;
}

export interface PatientHistory {
    name: string;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    suffix: string | null;
    age: number;
    civil_status: string;
    birthdate: string;
    barangay: string;
    last_visit: string;
    history: MedicationLog[];
}
