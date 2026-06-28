import { Head, usePage } from '@inertiajs/react';
import {
    FileCheck,
    Search,
    Plus,
    Trash2,
    Calendar as CalendarIcon,
    User,
    HeartHandshake,
    Edit,
} from 'lucide-react';
import React from 'react';
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
import AppLayout from '@/layouts/AppLayout';
import { Patient, DispensationRecord } from '@/types/pharmacytypes';
import { getFullName } from '@/lib/pharmacyutils';
import { usePharmacyDispensing } from '@/hooks/pharmacyUseDispensing';
import { DispensationModal } from './components/DispensationModal';
import { HistoryModal } from './components/HistoryModal';
import { ReverseModal } from './components/ReverseModal';

export default function Dispensing() {
    const { props } = usePage();
    const { dispensations = [], patients = [] } = props as unknown as {
        dispensations: DispensationRecord[];
        patients: Patient[];
    };

    const {
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
    } = usePharmacyDispensing(dispensations, patients);





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

                <DispensationModal
                    isOpen={isAddOpen}
                    onOpenChange={(open) => {
                        setIsAddOpen(open);
                        if (!open) {
                            setEditingRecord(null);
                            form.reset();
                            setPatientSearch('');
                        }
                    }}
                    editingRecord={editingRecord}
                    form={form}
                    patientSearch={patientSearch}
                    setPatientSearch={setPatientSearch}
                    showPatientSuggestions={showPatientSuggestions}
                    setShowPatientSuggestions={setShowPatientSuggestions}
                    filteredPatients={filteredPatients}
                    selectPatient={selectPatient}
                    clearPatientSelection={clearPatientSelection}
                    showDosageSuggestions={showDosageSuggestions}
                    setShowDosageSuggestions={setShowDosageSuggestions}
                    filteredDosageSuggestions={filteredDosageSuggestions}
                    selectDosageSuggestion={selectDosageSuggestion}
                    handleSubmit={handleSubmit}
                />

                <HistoryModal
                    isOpen={isHistoryOpen}
                    onOpenChange={setIsHistoryOpen}
                    selectedPatientForHistory={selectedPatientForHistory}
                    dispensations={dispensations}
                />

                <ReverseModal
                    isOpen={isReverseOpen}
                    onOpenChange={setIsReverseOpen}
                    selectedRecord={selectedRecord}
                    handleReverseSubmit={handleReverseSubmit}
                />
            </AppLayout>
        </>
    );
}
