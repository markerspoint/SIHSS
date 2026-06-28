import React from 'react';
import { format } from 'date-fns';
import {
    Calendar as CalendarIcon,
    Pill,
    User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Patient, DispensationRecord } from '@/types/pharmacytypes';

interface DispensationModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    editingRecord: DispensationRecord | null;
    form: any;
    patientSearch: string;
    setPatientSearch: (val: string) => void;
    showPatientSuggestions: boolean;
    setShowPatientSuggestions: (val: boolean) => void;
    filteredPatients: Patient[];
    selectPatient: (p: Patient) => void;
    clearPatientSelection: () => void;
    showDosageSuggestions: boolean;
    setShowDosageSuggestions: (val: boolean) => void;
    filteredDosageSuggestions: string[];
    selectDosageSuggestion: (val: string) => void;
    handleSubmit: (e: React.FormEvent) => void;
}

export function DispensationModal({
    isOpen,
    onOpenChange,
    editingRecord,
    form,
    patientSearch,
    setPatientSearch,
    showPatientSuggestions,
    setShowPatientSuggestions,
    filteredPatients,
    selectPatient,
    clearPatientSelection,
    showDosageSuggestions,
    setShowDosageSuggestions,
    filteredDosageSuggestions,
    selectDosageSuggestion,
    handleSubmit,
}: DispensationModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                                {/* Dosage with Radix Suggestions Popover */}
                                <div className="space-y-1">
                                    <Label
                                        htmlFor="dosage"
                                        className="text-xs font-bold text-slate-600"
                                    >
                                        Dosage / Formulation
                                    </Label>
                                    <Popover
                                        open={showDosageSuggestions && filteredDosageSuggestions.length > 0}
                                        onOpenChange={setShowDosageSuggestions}
                                    >
                                        <PopoverTrigger asChild>
                                            <div className="w-full">
                                                <Input
                                                    id="dosage"
                                                    required
                                                    autoComplete="off"
                                                    className="w-full h-10 rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:border-[#187e52] focus:bg-white"
                                                    value={form.data.dosage}
                                                    onFocus={() => setShowDosageSuggestions(true)}
                                                    onChange={(e) => {
                                                        form.setData('dosage', e.target.value);
                                                        setShowDosageSuggestions(true);
                                                    }}
                                                />
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent 
                                            className="w-[200px] max-h-40 overflow-y-auto p-1.5 rounded-xl border border-slate-200 bg-white shadow-lg"
                                            align="start"
                                            side="bottom"
                                            sideOffset={4}
                                            onOpenAutoFocus={(e) => e.preventDefault()}
                                        >
                                            <ScrollArea className="h-full">
                                                {filteredDosageSuggestions.map((d, index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 transition-colors cursor-pointer block"
                                                        onClick={() => selectDosageSuggestion(d)}
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
                                        Dosage Form
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
                                                <SelectItem value="Tablet">Tablet</SelectItem>
                                                <SelectItem value="Capsule">Capsule</SelectItem>
                                                <SelectItem value="Syrup">Syrup</SelectItem>
                                                <SelectItem value="Suspension">Suspension</SelectItem>
                                                <SelectItem value="Drops">Drops</SelectItem>
                                                <SelectItem value="Injection">Injection</SelectItem>
                                                <SelectItem value="Cream">Cream</SelectItem>
                                                <SelectItem value="Ointment">Ointment</SelectItem>
                                                <SelectItem value="Inhaler">Inhaler</SelectItem>
                                                <SelectItem value="Sachet">Sachet</SelectItem>
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

                            <div className="space-y-1">
                                <Label
                                    htmlFor="notes"
                                    className="text-xs font-bold text-slate-600"
                                >
                                    Instructions / Notes
                                </Label>
                                <Input
                                    id="notes"
                                    className="w-full h-10 rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:border-[#187e52] focus:bg-white"
                                    value={form.data.notes}
                                    onChange={(e) =>
                                        form.setData(
                                            'notes',
                                            e.target.value,
                                        )
                                    }
                                />
                                {form.errors.notes && (
                                    <p className="text-xs font-medium text-red-500">
                                        {form.errors.notes}
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
                            onClick={() => onOpenChange(false)}
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
    );
}
