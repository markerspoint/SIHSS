import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Table,
    TableHeader,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Patient, DispensationRecord } from '@/types/pharmacytypes';
import { getFullName } from '@/lib/pharmacyutils';

interface HistoryModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedPatientForHistory: Patient | null;
    dispensations: DispensationRecord[];
}

export function HistoryModal({
    isOpen,
    onOpenChange,
    selectedPatientForHistory,
    dispensations,
}: HistoryModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                                <span>
                                    DOB:{' '}
                                    {new Date(
                                        selectedPatientForHistory.birthdate,
                                    ).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </span>
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
                                            <TableHead className="h-10 text-[10px] font-bold text-slate-500 uppercase px-4">
                                                Medicine (Generic)
                                            </TableHead>
                                            <TableHead className="h-10 text-[10px] font-bold text-slate-500 uppercase px-4 text-center">
                                                Qty
                                            </TableHead>
                                            <TableHead className="h-10 text-[10px] font-bold text-slate-500 uppercase px-4 text-right">
                                                Date Dispensed
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {dispensations
                                            .filter((d) => {
                                                const pName = getFullName(
                                                    d.first_name,
                                                    d.middle_name,
                                                    d.last_name,
                                                    d.suffix,
                                                );
                                                return (
                                                    pName.toLowerCase() ===
                                                    selectedPatientForHistory.name.toLowerCase()
                                                );
                                            })
                                            .map((d) => (
                                                <TableRow
                                                    key={d.id}
                                                    className="hover:bg-slate-50/50 border-b border-slate-100"
                                                >
                                                    <TableCell className="px-4 py-3 text-sm">
                                                        <span className="block font-bold text-slate-800 uppercase">
                                                            {d.generic_name}
                                                        </span>
                                                        <span className="block text-[10px] text-slate-500 font-semibold">
                                                            {d.dosage} &bull; {d.form}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-center text-xs font-bold text-slate-800">
                                                        {d.quantity_dispensed} Unit(s)
                                                    </TableCell>
                                                    <TableCell className="px-4 py-3 text-right text-xs font-semibold text-slate-500">
                                                        {new Date(
                                                            d.created_at,
                                                        ).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
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
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
