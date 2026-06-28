import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { Patient, DispensationRecord } from '@/types/pharmacytypes';
import { getFullName, STANDARD_DOSAGES } from '@/lib/pharmacyutils';

export function usePharmacyDispensing(dispensations: DispensationRecord[], patients: Patient[]) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isReverseOpen, setIsReverseOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<DispensationRecord | null>(null);
    const [showDosageSuggestions, setShowDosageSuggestions] = useState(false);
    
    // Patient history & search states
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [selectedPatientForHistory, setSelectedPatientForHistory] = useState<Patient | null>(null);
    const [patientSearch, setPatientSearch] = useState('');
    const [showPatientSuggestions, setShowPatientSuggestions] = useState(false);
    const [editingRecord, setEditingRecord] = useState<DispensationRecord | null>(null);

    // Form definition
    const form = useForm({
        first_name: '',
        middle_name: '',
        last_name: '',
        suffix: '',
        age: '',
        civil_status: 'Single',
        birthdate: '',
        barangay: '',
        generic_name: '',
        dosage: '',
        form: 'Tablet',
        quantity_dispensed: 1 as number | '',
        notes: '',
    });

    // Filter patients based on search input
    const filteredPatients = patients.filter((p) => {
        if (!patientSearch) return true;
        return p.name.toLowerCase().includes(patientSearch.toLowerCase());
    });

    const selectPatient = (p: Patient) => {
        form.setData({
            ...form.data,
            first_name: p.first_name,
            middle_name: p.middle_name || '',
            last_name: p.last_name,
            suffix: p.suffix || '',
            birthdate: p.birthdate,
            age: p.age.toString(),
            civil_status: p.civil_status,
            barangay: p.barangay,
        });
        setPatientSearch(p.name);
        setShowPatientSuggestions(false);
    };

    const clearPatientSelection = () => {
        setPatientSearch('');
        form.setData({
            ...form.data,
            first_name: '',
            middle_name: '',
            last_name: '',
            suffix: '',
            birthdate: '',
            age: '',
            civil_status: 'Single',
            barangay: '',
        });
    };

    // Filter standard dosages based on input
    const filteredDosageSuggestions = STANDARD_DOSAGES.filter((d) => {
        const input = form.data.dosage.toLowerCase();
        if (!input) return true;
        return d.toLowerCase().includes(input);
    });

    const selectDosageSuggestion = (val: string) => {
        form.setData('dosage', val);
        setShowDosageSuggestions(false);
    };

    // Filtering dispensations
    const filteredDispensations = dispensations.filter((disp) => {
        const searchLower = searchTerm.toLowerCase();
        const fullName = getFullName(disp.first_name, disp.middle_name, disp.last_name, disp.suffix).toLowerCase();
        return (
            fullName.includes(searchLower) ||
            disp.generic_name.toLowerCase().includes(searchLower) ||
            (disp.notes || '').toLowerCase().includes(searchLower)
        );
    });

    // Submit dispensation
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRecord) {
            form.put(`/medical/pharmacy/dispensing/${editingRecord.id}`, {
                onSuccess: () => {
                    setIsAddOpen(false);
                    setEditingRecord(null);
                    form.reset();
                    setPatientSearch('');
                },
            });
        } else {
            form.post('/medical/pharmacy/dispensing', {
                onSuccess: () => {
                    setIsAddOpen(false);
                    form.reset();
                    setPatientSearch('');
                },
            });
        }
    };

    // Reverse dispensation
    const handleReverseSubmit = () => {
        if (!selectedRecord) return;
        router.delete(`/medical/pharmacy/dispensing/${selectedRecord.id}`, {
            onSuccess: () => {
                setIsReverseOpen(false);
                setSelectedRecord(null);
            },
        });
    };

    return {
        searchTerm,
        setSearchTerm,
        isAddOpen,
        setIsAddOpen,
        isReverseOpen,
        setIsReverseOpen,
        selectedRecord,
        setSelectedRecord,
        showDosageSuggestions,
        setShowDosageSuggestions,
        isHistoryOpen,
        setIsHistoryOpen,
        selectedPatientForHistory,
        setSelectedPatientForHistory,
        patientSearch,
        setPatientSearch,
        showPatientSuggestions,
        setShowPatientSuggestions,
        editingRecord,
        setEditingRecord,
        form,
        filteredPatients,
        selectPatient,
        clearPatientSelection,
        filteredDosageSuggestions,
        selectDosageSuggestion,
        filteredDispensations,
        handleSubmit,
        handleReverseSubmit,
    };
}
