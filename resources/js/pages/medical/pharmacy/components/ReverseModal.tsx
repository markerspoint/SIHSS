import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { DispensationRecord } from '@/types/pharmacytypes';
import { getFullName } from '@/lib/pharmacyutils';

interface ReverseModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    selectedRecord: DispensationRecord | null;
    handleReverseSubmit: () => void;
}

export function ReverseModal({
    isOpen,
    onOpenChange,
    selectedRecord,
    handleReverseSubmit,
}: ReverseModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-[1.5rem] p-6 sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-red-600">
                        Reverse Dispensation
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-xs text-slate-500">
                        Are you sure you want to reverse the dispensation of{' '}
                        <span className="font-bold text-slate-800">
                            {selectedRecord?.quantity_dispensed} units
                        </span>{' '}
                        of{' '}
                        <span className="font-bold text-slate-800">
                            {selectedRecord?.generic_name}
                        </span>{' '}
                        to{' '}
                        <span className="font-bold text-slate-800">
                            {selectedRecord &&
                                getFullName(
                                    selectedRecord.first_name,
                                    selectedRecord.middle_name,
                                    selectedRecord.last_name,
                                    selectedRecord.suffix,
                                )}
                        </span>
                        ? This action will permanently remove the record.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-4 gap-2">
                    <Button
                        variant="outline"
                        className="cursor-pointer rounded-xl"
                        onClick={() => onOpenChange(false)}
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
    );
}
