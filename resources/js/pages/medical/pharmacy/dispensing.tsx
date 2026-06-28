import { Head, usePage, useForm, router } from '@inertiajs/react';
import {
    FileCheck,
    Search,
    Plus,
    Trash2,
    Calendar as CalendarIcon,
    User,
    Info,
    Pill,
    HeartHandshake,
    Edit,
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/AppLayout';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

interface Patient {
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

interface DispensationRecord {
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

const STANDARD_DOSAGES = [
    '500mg',
    '250mg',
    '100mg',
    '50mg',
    '20mg',
    '10mg',
    '5mg',
    '2mg',
    '125mg/5mL',
    '250mg/5mL',
    '100mg/5mL',
    '40mg',
    '20.5g/sachet',
    '100mcg/dose',
    '15mL',
    '10mL',
    '5mL',
];

export default function Dispensing() {
    const { props } = usePage();
    const { dispensations = [], patients = [] } = props as unknown as {
        dispensations: DispensationRecord[];
        patients: Patient[];
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isReverseOpen, setIsReverseOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<DispensationRecord | null>(null);
    const [showDosageSuggestions, setShowDosageSuggestions] = useState(false);
    
    // New patient history & search states
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

    const getFullName = (first: string, middle: string | null, last: string, suffix: string | null) => {
        return [first, middle, last, suffix].filter(Boolean).join(' ');
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

    return (
        <>
            <Head title="Medicine Dispensing Portal" />
            <AppLayout
                breadcrumbs={[{ title: 'Pharmacy' }, { title: 'Dispensing' }]}
            >
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-slate-900">
                            <HeartHandshake className="h-8 w-8 text-[#187e52]" />
                            Medicine Dispensing Portal
                        </h1>
                        <p className="text-sm font-medium text-slate-500">
                            Record medicine dispensation requests and issue
                            generic drugs to registered patients.
                        </p>
                    </div>
                    <Button
                        onClick={() => {
                            setEditingRecord(null);
                            form.reset();
                            setPatientSearch('');
                            setIsAddOpen(true);
                        }}
                        className="inline-flex cursor-pointer items-center gap-2 self-start rounded-xl bg-[#187e52] px-4 py-5 font-semibold text-white shadow-sm transition-all hover:bg-[#136642] sm:self-auto"
                    >
                        <Plus className="h-4 w-4" />
                        Dispense Medication
                    </Button>
                </div>

                {/* Layout Grid */}
                <div className="grid gap-6">
                    <Card className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
                                Dispensation Registry Log
                                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                                    {dispensations.length} dispensations
                                </span>
                            </h3>

                            {/* Search Log */}
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by patient, generic name..."
                                    className="rounded-xl border-slate-200 bg-slate-50/50 py-4.5 pl-9 text-xs focus:border-[#187e52] focus:bg-white"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <Table className="overflow-hidden rounded-xl border border-slate-100">
                            <TableHeader>
                                <TableRow className="bg-slate-50 font-semibold tracking-wider text-slate-500 uppercase hover:bg-slate-50">
                                    <TableHead className="h-auto px-4 py-3.5 text-slate-500">
                                        Patient Name
                                    </TableHead>
                                    <TableHead className="h-auto px-4 py-3.5 text-slate-500">
                                        Drug Dispensed (Generic)
                                    </TableHead>
                                    <TableHead className="h-auto px-4 py-3.5 text-center text-slate-500">
                                        Quantity
                                    </TableHead>
                                    <TableHead className="h-auto px-4 py-3.5 text-slate-500">
                                        Date Dispensed
                                    </TableHead>
                                    <TableHead className="h-auto px-4 py-3.5 text-slate-500">
                                        Instructions / Notes
                                    </TableHead>
                                    <TableHead className="h-auto px-4 py-3.5 text-right text-slate-500">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="text-xs font-medium text-slate-700">
                                {filteredDispensations.length > 0 ? (
                                    filteredDispensations.map((disp) => (
                                        <TableRow
                                            key={disp.id}
                                            className="transition-colors hover:bg-slate-50/30"
                                        >
                                            <TableCell className="px-4 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600">
                                                        <User className="h-3.5 w-3.5" />
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        <span className="font-bold text-slate-900 block leading-snug">
                                                            {getFullName(disp.first_name, disp.middle_name, disp.last_name, disp.suffix)}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                                                            Age: {disp.age} &bull; {disp.civil_status} &bull; Brgy. {disp.barangay}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <div className="space-y-0.5">
                                                    <span className="font-bold text-slate-800 uppercase">
                                                        {disp.generic_name}
                                                    </span>
                                                    <span className="block text-[10px] font-semibold text-slate-400 uppercase">
                                                        {disp.dosage} &bull;{' '}
                                                        {disp.form}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 text-center font-extrabold text-slate-800">
                                                {disp.quantity_dispensed}{' '}
                                                <span className="text-[10px] font-semibold text-slate-400 uppercase">
                                                    unit(s)
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <span className="inline-flex items-center gap-1 text-slate-500">
                                                    <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
                                                    {new Date(
                                                        disp.created_at,
                                                    ).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        },
                                                    )}
                                                </span>
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate px-4 py-3.5 font-normal text-slate-600 italic">
                                                {disp.notes || (
                                                    <span className="text-slate-300">
                                                        No notes
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border-slate-100 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                                                        onClick={() => {
                                                            const fullName = getFullName(disp.first_name, disp.middle_name, disp.last_name, disp.suffix);
                                                            setSelectedPatientForHistory({
                                                                name: fullName,
                                                                first_name: disp.first_name,
                                                                middle_name: disp.middle_name,
                                                                last_name: disp.last_name,
                                                                suffix: disp.suffix,
                                                                age: disp.age,
                                                                civil_status: disp.civil_status,
                                                                birthdate: disp.birthdate,
                                                                barangay: disp.barangay,
                                                            });
                                                            setIsHistoryOpen(true);
                                                        }}
                                                    >
                                                        <Search className="h-3 w-3 text-slate-500" />
                                                        History
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border-slate-100 py-1.5 text-xs text-[#187e52] hover:bg-emerald-50 hover:text-[#136642]"
                                                        onClick={() => {
                                                            setEditingRecord(disp);
                                                            form.setData({
                                                                first_name: disp.first_name,
                                                                middle_name: disp.middle_name || '',
                                                                last_name: disp.last_name,
                                                                suffix: disp.suffix || '',
                                                                age: disp.age.toString(),
                                                                civil_status: disp.civil_status,
                                                                birthdate: disp.birthdate,
                                                                barangay: disp.barangay,
                                                                generic_name: disp.generic_name,
                                                                dosage: disp.dosage,
                                                                form: disp.form,
                                                                quantity_dispensed: disp.quantity_dispensed,
                                                                notes: disp.notes || '',
                                                            });
                                                            setPatientSearch(getFullName(disp.first_name, disp.middle_name, disp.last_name, disp.suffix));
                                                            setIsAddOpen(true);
                                                        }}
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border-red-100 py-1.5 text-xs text-red-500 hover:bg-red-50 hover:text-red-700"
                                                        onClick={() => {
                                                            setSelectedRecord(disp);
                                                            setIsReverseOpen(true);
                                                        }}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                        Reverse
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="py-12 text-center text-slate-400"
                                        >
                                            <div className="mx-auto max-w-[280px] space-y-2">
                                                <FileCheck className="mx-auto h-12 w-12 text-slate-300" />
                                                <h4 className="font-bold text-slate-700">
                                                    No dispensation logs found
                                                </h4>
                                                <p className="text-xs text-slate-400">
                                                    Perform a new dispensation
                                                    to issue medicines to
                                                    patients.
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </div>

                 <Dialog open={isAddOpen} onOpenChange={(open) => {
                    setIsAddOpen(open);
                    if (!open) {
                        setEditingRecord(null);
                        form.reset();
                        setPatientSearch('');
                    }
                }}>
                    <DialogContent className="rounded-[1.5rem] p-6 sm:max-w-[480px] overflow-hidden">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-slate-800">
                                {editingRecord ? 'Edit Dispensation Record' : 'Dispense Medicine'}
                            </DialogTitle>
                            <DialogDescription className="mt-1 text-xs text-slate-500">
                                {editingRecord
                                    ? 'Modify the details of this dispensation record.'
                                    : "Enter the patient's name and select the generic medicine formulation to dispense."}
                            </DialogDescription>
                        </DialogHeader>

                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col max-h-[calc(100vh-10rem)]"
                        >
                            <ScrollArea className="flex-1 pr-4 -mr-4 max-h-[50vh] py-1">
                                <div className="space-y-4 pb-12 pr-2 pl-1.5">
                                    <div className="flex items-center gap-2 pb-1 border-b border-slate-100 text-xs font-bold text-[#187e52] uppercase tracking-wider">
                                        <User className="h-4 w-4 shrink-0 text-[#187e52]/80" />
                                        Patient Information
                                    </div>

                                    {/* Search Existing Patient Autocomplete */}
                                    <div className="space-y-1 relative">
                                        <Label htmlFor="patient_search" className="text-xs font-bold text-slate-600">
                                            Search Existing Patient (Optional)
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="patient_search"
                                                className="w-full h-10 rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:border-[#187e52] focus:bg-white pr-12"
                                                value={patientSearch}
                                                onFocus={() => setShowPatientSuggestions(true)}
                                                onBlur={() => setTimeout(() => setShowPatientSuggestions(false), 200)}
                                                onChange={(e) => {
                                                    setPatientSearch(e.target.value);
                                                    setShowPatientSuggestions(true);
                                                }}
                                            />
                                            {patientSearch && (
                                                <button
                                                    type="button"
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-red-500 hover:text-red-700 cursor-pointer"
                                                    onClick={clearPatientSelection}
                                                >
                                                    Clear
                                                </button>
                                            )}
                                        </div>
                                        {showPatientSuggestions && filteredPatients.length > 0 && (
                                            <div className="absolute z-50 left-0 right-0 mt-1 max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                                                <div className="text-[9px] font-bold text-slate-400 tracking-wider px-2.5 py-1.5 uppercase select-none border-b border-slate-100 mb-1">
                                                    Recorded Patients
                                                </div>
                                                {filteredPatients.map((p, index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                                                        onMouseDown={() => selectPatient(p)}
                                                    >
                                                        <div className="font-bold">{p.name}</div>
                                                        <div className="text-[10px] text-slate-500 mt-0.5">
                                                            Age: {p.age} &bull; {p.civil_status} &bull; Brgy. {p.barangay}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label
                                                htmlFor="first_name"
                                                className="text-xs font-bold text-slate-600"
                                            >
                                                First Name
                                            </Label>
                                            <Input
                                                id="first_name"
                                                required
                                                className="w-full h-10 rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:border-[#187e52] focus:bg-white"
                                                value={form.data.first_name}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'first_name',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {form.errors.first_name && (
                                                <p className="text-xs font-medium text-red-500">
                                                    {form.errors.first_name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <Label
                                                htmlFor="middle_name"
                                                className="text-xs font-bold text-slate-600"
                                            >
                                                Middle Name
                                            </Label>
                                            <Input
                                                id="middle_name"
                                                className="w-full h-10 rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:border-[#187e52] focus:bg-white"
                                                value={form.data.middle_name}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'middle_name',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {form.errors.middle_name && (
                                                <p className="text-xs font-medium text-red-500">
                                                    {form.errors.middle_name}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="col-span-2 space-y-1">
                                            <Label
                                                htmlFor="last_name"
                                                className="text-xs font-bold text-slate-600"
                                            >
                                                Last Name
                                            </Label>
                                            <Input
                                                id="last_name"
                                                required
                                                className="w-full h-10 rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:border-[#187e52] focus:bg-white"
                                                value={form.data.last_name}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'last_name',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {form.errors.last_name && (
                                                <p className="text-xs font-medium text-red-500">
                                                    {form.errors.last_name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <Label
                                                htmlFor="suffix"
                                                className="text-xs font-bold text-slate-600"
                                            >
                                                Suffix
                                            </Label>
                                            <Select
                                                value={form.data.suffix || 'None'}
                                                onValueChange={(val) =>
                                                    form.setData(
                                                        'suffix',
                                                        val === 'None' ? '' : val,
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    id="suffix"
                                                    className="w-full h-10 rounded-xl border-slate-200 bg-slate-50/50 text-sm"
                                                >
                                                    <SelectValue placeholder="None" />
                                                </SelectTrigger>
                                                <SelectContent
                                                    className="rounded-xl p-0"
                                                    position="popper"
                                                    sideOffset={4}
                                                >
                                                    <ScrollArea className="max-h-40 pr-1">
                                                        <SelectItem value="None">None</SelectItem>
                                                        <SelectItem value="Jr.">Jr.</SelectItem>
                                                        <SelectItem value="Jr">Jr</SelectItem>
                                                        <SelectItem value="Sr.">Sr.</SelectItem>
                                                        <SelectItem value="Sr">Sr</SelectItem>
                                                        <SelectItem value="II">II</SelectItem>
                                                        <SelectItem value="III">III</SelectItem>
                                                        <SelectItem value="IV">IV</SelectItem>
                                                        <SelectItem value="V">V</SelectItem>
                                                    </ScrollArea>
                                                </SelectContent>
                                            </Select>
                                            {form.errors.suffix && (
                                                <p className="text-xs font-medium text-red-500">
                                                    {form.errors.suffix}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="space-y-1 flex flex-col justify-end">
                                            <Label
                                                htmlFor="birthdate"
                                                className="text-xs font-bold text-slate-600 mb-1"
                                            >
                                                Birthdate
                                            </Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        id="birthdate"
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full h-10 rounded-xl border-slate-200 bg-slate-50/50 text-sm font-normal text-left justify-start px-3",
                                                            !form.data.birthdate && "text-muted-foreground"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-1.5 h-4 w-4 text-slate-400 shrink-0" />
                                                        <span className="truncate">
                                                            {form.data.birthdate ? (
                                                                format(new Date(form.data.birthdate), "MM/dd/yyyy")
                                                            ) : (
                                                                "Select Date"
                                                            )}
                                                        </span>
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        captionLayout="dropdown"
                                                        startMonth={new Date("1900-01-01")}
                                                        endMonth={new Date()}
                                                        selected={form.data.birthdate ? new Date(form.data.birthdate) : undefined}
                                                        onSelect={(date) => {
                                                            if (date) {
                                                                const formattedDate = format(date, "yyyy-MM-dd");
                                                                const ageDiff = Date.now() - date.getTime();
                                                                const ageDate = new Date(ageDiff);
                                                                const calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);
                                                                
                                                                form.setData({
                                                                    ...form.data,
                                                                    birthdate: formattedDate,
                                                                    age: calculatedAge.toString(),
                                                                });
                                                            }
                                                        }}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            {form.errors.birthdate && (
                                                <p className="text-xs font-medium text-red-500">
                                                    {form.errors.birthdate}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <Label
                                                htmlFor="age"
                                                className="text-xs font-bold text-slate-600"
                                            >
                                                Age
                                            </Label>
                                            <Input
                                                id="age"
                                                type="number"
                                                required
                                                min="0"
                                                max="150"
                                                className="w-full h-10 rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:border-[#187e52] focus:bg-white"
                                                value={form.data.age}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'age',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            {form.errors.age && (
                                                <p className="text-xs font-medium text-red-500">
                                                    {form.errors.age}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <Label
                                                htmlFor="civil_status"
                                                className="text-xs font-bold text-slate-600"
                                            >
                                                Civil Status
                                            </Label>
                                            <Select
                                                value={form.data.civil_status}
                                                onValueChange={(val) =>
                                                    form.setData('civil_status', val)
                                                }
                                            >
                                                <SelectTrigger
                                                    id="civil_status"
                                                    className="w-full h-10 rounded-xl border-slate-200 bg-slate-50/50 text-sm"
                                                >
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent
                                                    className="rounded-xl max-h-48"
                                                    position="popper"
                                                    sideOffset={4}
                                                >
                                                    <SelectItem value="Single">
                                                        Single
                                                    </SelectItem>
                                                    <SelectItem value="Married">
                                                        Married
                                                    </SelectItem>
                                                    <SelectItem value="Widowed">
                                                        Widowed
                                                    </SelectItem>
                                                    <SelectItem value="Separated">
                                                        Separated
                                                    </SelectItem>
                                                    <SelectItem value="Divorced">
                                                        Divorced
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {form.errors.civil_status && (
                                                <p className="text-xs font-medium text-red-500">
                                                    {form.errors.civil_status}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <Label
                                            htmlFor="barangay"
                                            className="text-xs font-bold text-slate-600"
                                        >
                                            Barangay Address
                                        </Label>
                                        <Select
                                            value={form.data.barangay}
                                            onValueChange={(val) =>
                                                form.setData('barangay', val)
                                            }
                                        >
                                            <SelectTrigger
                                                id="barangay"
                                                className="w-full h-10 rounded-xl border-slate-200 bg-slate-50/50 text-sm"
                                            >
                                                <SelectValue placeholder="Select barangay" />
                                            </SelectTrigger>
                                            <SelectContent
                                                className="rounded-xl p-0"
                                                position="popper"
                                                sideOffset={4}
                                            >
                                                <ScrollArea className="h-40 pr-1">
                                                    <SelectItem value="Barangay 1 (Poblacion)">Barangay 1 (Poblacion)</SelectItem>
                                                    <SelectItem value="Barangay 2 (Poblacion)">Barangay 2 (Poblacion)</SelectItem>
                                                    <SelectItem value="Barangay 3 (Poblacion)">Barangay 3 (Poblacion)</SelectItem>
                                                    <SelectItem value="Barangay 4 (Poblacion)">Barangay 4 (Poblacion)</SelectItem>
                                                    <SelectItem value="Barangay 5 (Poblacion)">Barangay 5 (Poblacion)</SelectItem>
                                                    <SelectItem value="Cabadiangan">Cabadiangan</SelectItem>
                                                    <SelectItem value="Camindangan">Camindangan</SelectItem>
                                                    <SelectItem value="Canturay">Canturay</SelectItem>
                                                    <SelectItem value="Cartagena">Cartagena</SelectItem>
                                                    <SelectItem value="Cayhagan">Cayhagan</SelectItem>
                                                    <SelectItem value="Gil Montilla">Gil Montilla</SelectItem>
                                                    <SelectItem value="Mambaroto">Mambaroto</SelectItem>
                                                    <SelectItem value="Manlucahoc">Manlucahoc</SelectItem>
                                                    <SelectItem value="Maricalum">Maricalum</SelectItem>
                                                    <SelectItem value="Nabulao">Nabulao</SelectItem>
                                                    <SelectItem value="Nauhang">Nauhang</SelectItem>
                                                    <SelectItem value="San Jose">San Jose</SelectItem>
                                                </ScrollArea>
                                            </SelectContent>
                                        </Select>
                                        {form.errors.barangay && (
                                            <p className="text-xs font-medium text-red-500">
                                                {form.errors.barangay}
                                            </p>
                                        )}
                                    </div>

                                    <div className="border-t border-slate-100 my-5 pt-4">
                                        <div className="flex items-center gap-2 pb-1 border-b border-slate-100 text-xs font-bold text-[#187e52] uppercase tracking-wider">
                                            <Pill className="h-4 w-4 shrink-0 text-[#187e52]/80" />
                                            Medication Details
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <Label
                                            htmlFor="generic_name"
                                            className="text-xs font-bold text-slate-600"
                                        >
                                            Generic Name
                                        </Label>
                                        <Input
                                            id="generic_name"
                                            required
                                            className="w-full h-10 rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:border-[#187e52] focus:bg-white"
                                            value={form.data.generic_name}
                                            onChange={(e) =>
                                                form.setData(
                                                    'generic_name',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {form.errors.generic_name && (
                                            <p className="text-xs font-medium text-red-500">
                                                {form.errors.generic_name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label
                                                htmlFor="dosage"
                                                className="text-xs font-bold text-slate-600"
                                            >
                                                Dosage / Formulation
                                            </Label>
                                            <Popover open={showDosageSuggestions && filteredDosageSuggestions.length > 0} onOpenChange={setShowDosageSuggestions}>
                                                <PopoverTrigger asChild>
                                                    <Input
                                                        id="dosage"
                                                        required
                                                        className="w-full h-10 rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:border-[#187e52] focus:bg-white"
                                                        value={form.data.dosage}
                                                        onFocus={() => setShowDosageSuggestions(true)}
                                                        onBlur={() => setTimeout(() => setShowDosageSuggestions(false), 200)}
                                                        onChange={(e) => {
                                                            form.setData('dosage', e.target.value);
                                                            setShowDosageSuggestions(true);
                                                        }}
                                                        autoComplete="off"
                                                    />
                                                </PopoverTrigger>
                                                <PopoverContent 
                                                    className="w-[var(--radix-popover-trigger-width)] p-1.5 rounded-xl max-h-40 overflow-y-auto bg-white border border-slate-200 shadow-lg" 
                                                    align="start" 
                                                    sideOffset={4}
                                                    onOpenAutoFocus={(e) => e.preventDefault()}
                                                >
                                                    <div className="text-[9px] font-bold text-slate-400 tracking-wider px-2.5 py-1.5 uppercase select-none border-b border-slate-100 mb-1">
                                                        Standard Dosages
                                                    </div>
                                                    <ScrollArea className="max-h-32 pr-1">
                                                        {filteredDosageSuggestions.map((d, index) => (
                                                            <button
                                                                key={index}
                                                                type="button"
                                                                className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                                                                onMouseDown={() => selectDosageSuggestion(d)}
                                                            >
                                                                {d}
                                                            </button>
                                                        ))}
                                                    </ScrollArea>
                                                </PopoverContent>
                                            </Popover>
                                            {form.errors.dosage && (
                                                <p className="text-xs font-medium text-red-500">
                                                    {form.errors.dosage}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <Label
                                                htmlFor="form"
                                                className="text-xs font-bold text-slate-600"
                                            >
                                                Form
                                            </Label>
                                            <Select
                                                value={form.data.form}
                                                onValueChange={(val) =>
                                                    form.setData('form', val)
                                                }
                                            >
                                                <SelectTrigger
                                                    id="form"
                                                    className="w-full h-10 rounded-xl border-slate-200 bg-slate-50/50 text-sm"
                                                >
                                                    <SelectValue placeholder="Select form" />
                                                </SelectTrigger>
                                                <SelectContent
                                                    className="rounded-xl p-0"
                                                    position="popper"
                                                    sideOffset={4}
                                                >
                                                    <ScrollArea className="max-h-40 pr-1">
                                                        <SelectItem value="Tablet">
                                                            Tablet
                                                        </SelectItem>
                                                        <SelectItem value="Capsule">
                                                            Capsule
                                                        </SelectItem>
                                                        <SelectItem value="Syrup">
                                                            Syrup
                                                        </SelectItem>
                                                        <SelectItem value="Suspension">
                                                            Suspension
                                                        </SelectItem>
                                                        <SelectItem value="Ointment">
                                                            Ointment
                                                        </SelectItem>
                                                        <SelectItem value="Inhaler">
                                                            Inhaler
                                                        </SelectItem>
                                                        <SelectItem value="Injection">
                                                            Injection
                                                        </SelectItem>
                                                        <SelectItem value="Drops">
                                                            Drops
                                                        </SelectItem>
                                                    </ScrollArea>
                                                </SelectContent>
                                            </Select>
                                            {form.errors.form && (
                                                <p className="text-xs font-medium text-red-500">
                                                    {form.errors.form}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <Label
                                            htmlFor="quantity_dispensed"
                                            className="text-xs font-bold text-slate-600"
                                        >
                                            Quantity to Dispense
                                        </Label>
                                        <Input
                                            id="quantity_dispensed"
                                            type="number"
                                            required
                                            min="1"
                                            className="w-full h-10 rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:border-[#187e52] focus:bg-white"
                                            value={form.data.quantity_dispensed}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                form.setData(
                                                    'quantity_dispensed',
                                                    val === '' ? '' : (parseInt(val) || 0)
                                                );
                                            }}
                                        />
                                        {form.errors.quantity_dispensed && (
                                            <p className="text-xs font-medium text-red-500">
                                                {form.errors.quantity_dispensed}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </ScrollArea>

                            <DialogFooter className="pt-4 border-t border-slate-100">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="cursor-pointer rounded-xl"
                                    onClick={() => setIsAddOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={form.processing}
                                    className="cursor-pointer rounded-xl bg-[#187e52] font-semibold text-white hover:bg-[#136642]"
                                >
                                    {editingRecord ? 'Update' : 'Dispense'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* PATIENT HISTORY DIALOG */}
                <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                    <DialogContent className="rounded-[1.5rem] p-6 sm:max-w-[650px] overflow-hidden">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-slate-800">
                                Patient Medication History
                            </DialogTitle>
                            <DialogDescription className="mt-1 text-xs text-slate-500">
                                Displaying all recorded dispensations for this patient.
                            </DialogDescription>
                        </DialogHeader>

                        {selectedPatientForHistory && (
                            <div className="space-y-4">
                                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
                                    <div className="font-extrabold text-slate-900 text-base">
                                        {selectedPatientForHistory.name}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-semibold uppercase tracking-wider">
                                        <span>DOB: {new Date(selectedPatientForHistory.birthdate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                                        <span>&bull;</span>
                                        <span>Age: {selectedPatientForHistory.age}</span>
                                        <span>&bull;</span>
                                        <span>{selectedPatientForHistory.civil_status}</span>
                                        <span>&bull;</span>
                                        <span>Brgy. {selectedPatientForHistory.barangay}</span>
                                    </div>
                                </div>

                                <ScrollArea className="max-h-[40vh] pr-2">
                                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                                        <Table>
                                            <TableHeader className="bg-slate-50">
                                                <TableRow className="hover:bg-slate-50 border-b border-slate-200">
                                                    <TableHead className="h-10 text-[10px] font-bold text-slate-500 uppercase px-4">Medicine (Generic)</TableHead>
                                                    <TableHead className="h-10 text-[10px] font-bold text-slate-500 uppercase px-4 text-center">Qty</TableHead>
                                                    <TableHead className="h-10 text-[10px] font-bold text-slate-500 uppercase px-4 text-right">Date Dispensed</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {dispensations
                                                    .filter((d) => {
                                                        const pName = getFullName(d.first_name, d.middle_name, d.last_name, d.suffix);
                                                        return pName.toLowerCase() === selectedPatientForHistory.name.toLowerCase();
                                                    })
                                                    .map((d) => (
                                                        <TableRow key={d.id} className="hover:bg-slate-50/50 border-b border-slate-100">
                                                            <TableCell className="px-4 py-3 text-sm">
                                                                <span className="block font-bold text-slate-800 uppercase">{d.generic_name}</span>
                                                                <span className="block text-[10px] text-slate-500 font-semibold">{d.dosage} &bull; {d.form}</span>
                                                            </TableCell>
                                                            <TableCell className="px-4 py-3 text-center text-xs font-bold text-slate-800">{d.quantity_dispensed} Unit(s)</TableCell>
                                                            <TableCell className="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                                                                {new Date(d.created_at).toLocaleDateString("en-US", {
                                                                    month: "short",
                                                                    day: "numeric",
                                                                    year: "numeric",
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                })}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </ScrollArea>
                            </div>
                        )}

                        <DialogFooter className="pt-4 border-t border-slate-100">
                            <Button
                                type="button"
                                variant="outline"
                                className="cursor-pointer rounded-xl"
                                onClick={() => setIsHistoryOpen(false)}
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* REVERSE DIALOG */}
                <Dialog open={isReverseOpen} onOpenChange={setIsReverseOpen}>
                    <DialogContent className="rounded-[1.5rem] p-6 sm:max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-red-600">
                                Reverse Dispensation
                            </DialogTitle>
                            <DialogDescription className="mt-1 text-xs text-slate-500">
                                Are you sure you want to reverse the
                                dispensation of{' '}
                                <span className="font-bold text-slate-800">
                                    {selectedRecord?.quantity_dispensed} units
                                </span>{' '}
                                of{' '}
                                <span className="font-bold text-slate-800">
                                    {selectedRecord?.generic_name}
                                </span>{' '}
                                to{' '}
                                <span className="font-bold text-slate-800">
                                    {selectedRecord && getFullName(selectedRecord.first_name, selectedRecord.middle_name, selectedRecord.last_name, selectedRecord.suffix)}
                                </span>
                                ?
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-start gap-2.5 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 py-2.5">
                            <Info className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-600" />
                            <p className="text-xs leading-normal font-medium text-amber-700">
                                This will permanently delete this dispensation
                                log record from the patient history list.
                            </p>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="cursor-pointer rounded-xl"
                                onClick={() => setIsReverseOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleReverseSubmit}
                                className="cursor-pointer rounded-xl bg-red-600 font-semibold text-white hover:bg-red-800"
                            >
                                Reverse Log
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </AppLayout>
        </>
    );
}
