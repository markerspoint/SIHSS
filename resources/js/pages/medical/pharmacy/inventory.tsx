import { Head, usePage, useForm, router } from '@inertiajs/react';
import {
    Layers,
    Search,
    Plus,
    Calendar,
    AlertTriangle,
    Pencil,
    Trash2,
    AlertCircle,
    Package,
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
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

interface PharmacyItem {
    id: number;
    generic_name: string;
    dosage: string;
    form: string;
    quantity: number;
    unit: string;
    expiration_date: string;
    batch_number: string;
    created_at: string;
    updated_at: string;
}

export default function Inventory() {
    const { props } = usePage();
    const { inventory = [] } = props as unknown as {
        inventory: PharmacyItem[];
    };

    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<
        'all' | 'low_stock' | 'near_expiry'
    >('all');

    // Dialog controls
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<PharmacyItem | null>(null);

    // Forms
    const addForm = useForm({
        generic_name: '',
        dosage: '',
        form: 'Tablet',
        quantity: 0,
        unit: 'tablet(s)',
        expiration_date: '',
        batch_number: '',
    });

    const editForm = useForm({
        generic_name: '',
        dosage: '',
        form: 'Tablet',
        quantity: 0,
        unit: 'tablet(s)',
        expiration_date: '',
        batch_number: '',
    });

    // Date helper functions
    const checkExpiry = (dateStr: string) => {
        const expiry = new Date(dateStr);
        const today = new Date();
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) return 'expired';
        if (diffDays <= 90) return 'near_expiry'; // 3 months
        return 'good';
    };

    // Filter items
    const filteredItems = inventory.filter((item) => {
        const matchesSearch =
            item.generic_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            item.batch_number
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            item.form.toLowerCase().includes(searchTerm.toLowerCase());

        const expiryStatus = checkExpiry(item.expiration_date);

        if (filterType === 'low_stock') {
            return matchesSearch && item.quantity <= 50;
        }
        if (filterType === 'near_expiry') {
            return (
                matchesSearch &&
                (expiryStatus === 'expired' || expiryStatus === 'near_expiry')
            );
        }
        return matchesSearch;
    });

    // Stats calculation
    const totalStockItems = inventory.length;
    const lowStockCount = inventory.filter(
        (item) => item.quantity <= 50,
    ).length;
    const nearExpiryCount = inventory.filter(
        (item) =>
            checkExpiry(item.expiration_date) === 'expired' ||
            checkExpiry(item.expiration_date) === 'near_expiry',
    ).length;

    // Add Item Submit
    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addForm.post('/medical/pharmacy/inventory', {
            onSuccess: () => {
                setIsAddOpen(false);
                addForm.reset();
            },
        });
    };

    // Edit Item Submit
    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) return;
        editForm.put(`/medical/pharmacy/inventory/${selectedItem.id}`, {
            onSuccess: () => {
                setIsEditOpen(false);
                setSelectedItem(null);
            },
        });
    };

    // Delete Item Submit
    const handleDeleteSubmit = () => {
        if (!selectedItem) return;
        router.delete(`/medical/pharmacy/inventory/${selectedItem.id}`, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedItem(null);
            },
        });
    };

    const openEditDialog = (item: PharmacyItem) => {
        setSelectedItem(item);
        editForm.setData({
            generic_name: item.generic_name,
            dosage: item.dosage,
            form: item.form,
            quantity: item.quantity,
            unit: item.unit,
            expiration_date: item.expiration_date,
            batch_number: item.batch_number,
        });
        setIsEditOpen(true);
    };

    return (
        <>
            <Head title="Pharmacy Inventory Management" />
            <AppLayout
                breadcrumbs={[{ title: 'Pharmacy' }, { title: 'Inventory' }]}
            >
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight text-slate-900">
                            <Package className="h-8 w-8 text-[#187e52]" />
                            Pharmacy Drug Inventory
                        </h1>
                        <p className="text-sm font-medium text-slate-500">
                            Manage government-dispensed generic drug inventory
                            levels, batches, and expiration alerts.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="inline-flex cursor-pointer items-center gap-2 self-start rounded-xl bg-[#187e52] px-4 py-5 font-semibold text-white shadow-sm transition-all hover:bg-[#136642] sm:self-auto"
                    >
                        <Plus className="h-4 w-4" />
                        Add Generic Medicine
                    </Button>
                </div>

                {/* Stats Section */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card
                        className={`flex cursor-pointer items-center justify-between rounded-[1.5rem] border p-5 shadow-sm transition-all hover:shadow-md ${
                            filterType === 'all'
                                ? 'border-emerald-500 bg-emerald-50/20'
                                : 'border-slate-200 bg-white'
                        }`}
                        onClick={() => setFilterType('all')}
                    >
                        <div className="space-y-1">
                            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                Total Formulations
                            </span>
                            <h3 className="text-3xl font-extrabold text-slate-900">
                                {totalStockItems}
                            </h3>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#187e52]">
                            <Layers className="h-5 w-5" />
                        </div>
                    </Card>

                    <Card
                        className={`flex cursor-pointer items-center justify-between rounded-[1.5rem] border p-5 shadow-sm transition-all hover:shadow-md ${
                            filterType === 'low_stock'
                                ? 'border-amber-500 bg-amber-50/20'
                                : 'border-slate-200 bg-white'
                        }`}
                        onClick={() => setFilterType('low_stock')}
                    >
                        <div className="space-y-1">
                            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                Low Stock (&le; 50)
                            </span>
                            <h3 className="text-3xl font-extrabold text-amber-600">
                                {lowStockCount}
                            </h3>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                    </Card>

                    <Card
                        className={`flex cursor-pointer items-center justify-between rounded-[1.5rem] border p-5 shadow-sm transition-all hover:shadow-md ${
                            filterType === 'near_expiry'
                                ? 'border-red-500 bg-red-50/20'
                                : 'border-slate-200 bg-white'
                        }`}
                        onClick={() => setFilterType('near_expiry')}
                    >
                        <div className="space-y-1">
                            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                Near Expiry (&le; 90d)
                            </span>
                            <h3 className="text-3xl font-extrabold text-red-600">
                                {nearExpiryCount}
                            </h3>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                    </Card>
                </div>

                {/* Directory Grid */}
                <Card className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <h3 className="flex items-center gap-2 text-base font-bold text-slate-800">
                            Medicine Directory
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                                {filteredItems.length} listed
                            </span>
                        </h3>

                        {/* Search Input */}
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Search generic name, batch, form..."
                                className="rounded-xl border-slate-200 bg-slate-50/50 py-4.5 pl-9 text-xs focus:border-[#187e52] focus:bg-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <Table className="border border-slate-100 rounded-xl overflow-hidden">
                        <TableHeader>
                            <TableRow className="bg-slate-50 text-slate-500 font-semibold tracking-wider uppercase hover:bg-slate-50">
                                <TableHead className="px-4 py-3.5 h-auto text-slate-500">
                                    Generic Name
                                </TableHead>
                                <TableHead className="px-4 py-3.5 h-auto text-slate-500">
                                    Dosage / Formulation
                                </TableHead>
                                <TableHead className="px-4 py-3.5 text-center h-auto text-slate-500">
                                    Current Stock
                                </TableHead>
                                <TableHead className="px-4 py-3.5 h-auto text-slate-500">
                                    Batch Number
                                </TableHead>
                                <TableHead className="px-4 py-3.5 h-auto text-slate-500">
                                    Expiration Date
                                </TableHead>
                                <TableHead className="px-4 py-3.5 text-right h-auto text-slate-500">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="text-slate-700 font-medium text-xs">
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => {
                                    const expiryStatus = checkExpiry(
                                        item.expiration_date,
                                    );
                                    const isLowStock = item.quantity <= 50;

                                    return (
                                        <TableRow
                                            key={item.id}
                                            className="transition-colors hover:bg-slate-50/30"
                                        >
                                            <TableCell className="px-4 py-3.5 font-bold text-slate-900 uppercase">
                                                {item.generic_name}
                                            </TableCell>
                                            <TableCell className="space-y-1 px-4 py-3.5">
                                                <span className="font-semibold text-slate-800">
                                                    {item.dosage}
                                                </span>
                                                <span className="block text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                                                    {item.form}
                                                </span>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 text-center">
                                                <div className="space-y-1">
                                                    <span
                                                        className={`text-sm font-extrabold ${isLowStock ? 'text-amber-600' : 'text-slate-800'}`}
                                                    >
                                                        {item.quantity}
                                                    </span>
                                                    <span className="block text-[9px] font-semibold text-slate-400 uppercase">
                                                        {item.unit}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5 font-mono font-bold text-slate-500 uppercase">
                                                {item.batch_number}
                                            </TableCell>
                                            <TableCell className="px-4 py-3.5">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                                                        expiryStatus ===
                                                        'expired'
                                                            ? 'border-red-200 bg-red-50 text-red-700'
                                                            : expiryStatus ===
                                                                'near_expiry'
                                                              ? 'border-amber-200 bg-amber-50 text-amber-700'
                                                              : 'border-emerald-200 bg-emerald-50 text-[#187e52]'
                                                    }`}
                                                >
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {new Date(
                                                        item.expiration_date,
                                                    ).toLocaleDateString(
                                                        'en-US',
                                                        {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        },
                                                    )}
                                                    {expiryStatus ===
                                                        'expired' &&
                                                        ' (Expired)'}
                                                    {expiryStatus ===
                                                        'near_expiry' &&
                                                        ' (Expiring Soon)'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="flex items-center justify-end gap-2 px-4 py-3.5 text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border-slate-200 py-1.5 text-xs hover:bg-slate-50 hover:text-emerald-800"
                                                    onClick={() =>
                                                        openEditDialog(item)
                                                    }
                                                >
                                                    <Pencil className="h-3 w-3 text-slate-500" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border-red-200 py-1.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-800"
                                                    onClick={() => {
                                                        setSelectedItem(
                                                            item,
                                                        );
                                                        setIsDeleteOpen(
                                                            true,
                                                        );
                                                    }}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="py-12 text-center text-slate-400"
                                    >
                                        <div className="mx-auto max-w-[280px] space-y-2">
                                            <Package className="mx-auto h-12 w-12 text-slate-300" />
                                            <h4 className="font-bold text-slate-700">
                                                No medicines in inventory
                                            </h4>
                                            <p className="text-xs text-slate-400">
                                                Try searching for a
                                                different item or add a new
                                                formulation stock.
                                            </p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>

                {/* ADD DIALOG */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogContent className="rounded-[1.5rem] p-6 sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-slate-800">
                                Add Generic Formulation
                            </DialogTitle>
                            <DialogDescription className="mt-1 text-xs text-slate-500">
                                Enter details for a new batch of generic
                                medicine. Do not specify brand names.
                            </DialogDescription>
                        </DialogHeader>

                        <form
                            onSubmit={handleAddSubmit}
                            className="space-y-4 py-4"
                        >
                            <div className="space-y-1">
                                <Label
                                    htmlFor="generic_name"
                                    className="text-xs font-bold text-slate-600"
                                >
                                    Generic Drug Name
                                </Label>
                                <Input
                                    id="generic_name"
                                    required
                                    placeholder="e.g. Paracetamol"
                                    className="rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:border-[#187e52] focus:bg-white"
                                    value={addForm.data.generic_name}
                                    onChange={(e) =>
                                        addForm.setData(
                                            'generic_name',
                                            e.target.value,
                                        )
                                    }
                                />
                                {addForm.errors.generic_name && (
                                    <p className="text-xs font-medium text-red-500">
                                        {addForm.errors.generic_name}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label
                                        htmlFor="dosage"
                                        className="text-xs font-bold text-slate-600"
                                    >
                                        Dosage Strength
                                    </Label>
                                    <Input
                                        id="dosage"
                                        required
                                        placeholder="e.g. 500mg"
                                        className="rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:border-[#187e52] focus:bg-white"
                                        value={addForm.data.dosage}
                                        onChange={(e) =>
                                            addForm.setData(
                                                'dosage',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {addForm.errors.dosage && (
                                        <p className="text-xs font-medium text-red-500">
                                            {addForm.errors.dosage}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <Label
                                        htmlFor="form"
                                        className="text-xs font-bold text-slate-600"
                                    >
                                        Formulation
                                    </Label>
                                    <Select
                                        value={addForm.data.form}
                                        onValueChange={(val) =>
                                            addForm.setData('form', val)
                                        }
                                    >
                                        <SelectTrigger
                                            id="form"
                                            className="rounded-xl border-slate-200 bg-slate-50/50 text-sm"
                                        >
                                            <SelectValue placeholder="Select form" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
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
                                            <SelectItem value="Vial">
                                                Vial / Injectable
                                            </SelectItem>
                                            <SelectItem value="Cream">
                                                Ointment / Cream
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label
                                        htmlFor="quantity"
                                        className="text-xs font-bold text-slate-600"
                                    >
                                        Initial Stock Quantity
                                    </Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        required
                                        min="0"
                                        placeholder="0"
                                        className="rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:border-[#187e52] focus:bg-white"
                                        value={addForm.data.quantity || ''}
                                        onChange={(e) =>
                                            addForm.setData(
                                                'quantity',
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                    />
                                    {addForm.errors.quantity && (
                                        <p className="text-xs font-medium text-red-500">
                                            {addForm.errors.quantity}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <Label
                                        htmlFor="unit"
                                        className="text-xs font-bold text-slate-600"
                                    >
                                        Packaging Unit
                                    </Label>
                                    <Input
                                        id="unit"
                                        required
                                        placeholder="e.g. tablet(s)"
                                        className="rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:border-[#187e52] focus:bg-white"
                                        value={addForm.data.unit}
                                        onChange={(e) =>
                                            addForm.setData(
                                                'unit',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {addForm.errors.unit && (
                                        <p className="text-xs font-medium text-red-500">
                                            {addForm.errors.unit}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label
                                        htmlFor="batch_number"
                                        className="text-xs font-bold text-slate-600"
                                    >
                                        Batch Number
                                    </Label>
                                    <Input
                                        id="batch_number"
                                        required
                                        placeholder="e.g. B2506"
                                        className="rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:border-[#187e52] focus:bg-white"
                                        value={addForm.data.batch_number}
                                        onChange={(e) =>
                                            addForm.setData(
                                                'batch_number',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {addForm.errors.batch_number && (
                                        <p className="text-xs font-medium text-red-500">
                                            {addForm.errors.batch_number}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <Label
                                        htmlFor="expiration_date"
                                        className="text-xs font-bold text-slate-600"
                                    >
                                        Expiration Date
                                    </Label>
                                    <Input
                                        id="expiration_date"
                                        type="date"
                                        required
                                        className="rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:border-[#187e52] focus:bg-white"
                                        value={addForm.data.expiration_date}
                                        onChange={(e) =>
                                            addForm.setData(
                                                'expiration_date',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {addForm.errors.expiration_date && (
                                        <p className="text-xs font-medium text-red-500">
                                            {addForm.errors.expiration_date}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <DialogFooter className="pt-2">
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
                                    disabled={addForm.processing}
                                    className="cursor-pointer rounded-xl bg-[#187e52] font-semibold text-white hover:bg-[#136642]"
                                >
                                    Add Medicine
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* EDIT DIALOG */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="rounded-[1.5rem] p-6 sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold text-slate-800">
                                Edit Generic Formulation
                            </DialogTitle>
                            <DialogDescription className="mt-1 text-xs text-slate-500">
                                Modify existing stock details. Keep brand names
                                out.
                            </DialogDescription>
                        </DialogHeader>

                        <form
                            onSubmit={handleEditSubmit}
                            className="space-y-4 py-4"
                        >
                            <div className="space-y-1">
                                <Label
                                    htmlFor="edit_generic_name"
                                    className="text-xs font-bold text-slate-600"
                                >
                                    Generic Drug Name
                                </Label>
                                <Input
                                    id="edit_generic_name"
                                    required
                                    placeholder="e.g. Paracetamol"
                                    className="rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:border-[#187e52] focus:bg-white"
                                    value={editForm.data.generic_name}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'generic_name',
                                            e.target.value,
                                        )
                                    }
                                />
                                {editForm.errors.generic_name && (
                                    <p className="text-xs font-medium text-red-500">
                                        {editForm.errors.generic_name}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label
                                        htmlFor="edit_dosage"
                                        className="text-xs font-bold text-slate-600"
                                    >
                                        Dosage Strength
                                    </Label>
                                    <Input
                                        id="edit_dosage"
                                        required
                                        placeholder="e.g. 500mg"
                                        className="rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:border-[#187e52] focus:bg-white"
                                        value={editForm.data.dosage}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'dosage',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {editForm.errors.dosage && (
                                        <p className="text-xs font-medium text-red-500">
                                            {editForm.errors.dosage}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <Label
                                        htmlFor="edit_form"
                                        className="text-xs font-bold text-slate-600"
                                    >
                                        Formulation
                                    </Label>
                                    <Select
                                        value={editForm.data.form}
                                        onValueChange={(val) =>
                                            editForm.setData('form', val)
                                        }
                                    >
                                        <SelectTrigger
                                            id="edit_form"
                                            className="rounded-xl border-slate-200 bg-slate-50/50 text-sm"
                                        >
                                            <SelectValue placeholder="Select form" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
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
                                            <SelectItem value="Vial">
                                                Vial / Injectable
                                            </SelectItem>
                                            <SelectItem value="Cream">
                                                Ointment / Cream
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label
                                        htmlFor="edit_quantity"
                                        className="text-xs font-bold text-slate-600"
                                    >
                                        Current Stock Quantity
                                    </Label>
                                    <Input
                                        id="edit_quantity"
                                        type="number"
                                        required
                                        min="0"
                                        placeholder="0"
                                        className="rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:border-[#187e52] focus:bg-white"
                                        value={editForm.data.quantity || ''}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'quantity',
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                    />
                                    {editForm.errors.quantity && (
                                        <p className="text-xs font-medium text-red-500">
                                            {editForm.errors.quantity}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <Label
                                        htmlFor="edit_unit"
                                        className="text-xs font-bold text-slate-600"
                                    >
                                        Packaging Unit
                                    </Label>
                                    <Input
                                        id="edit_unit"
                                        required
                                        placeholder="e.g. tablet(s)"
                                        className="rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:border-[#187e52] focus:bg-white"
                                        value={editForm.data.unit}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'unit',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {editForm.errors.unit && (
                                        <p className="text-xs font-medium text-red-500">
                                            {editForm.errors.unit}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label
                                        htmlFor="edit_batch_number"
                                        className="text-xs font-bold text-slate-600"
                                    >
                                        Batch Number
                                    </Label>
                                    <Input
                                        id="edit_batch_number"
                                        required
                                        placeholder="e.g. B2506"
                                        className="rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:border-[#187e52] focus:bg-white"
                                        value={editForm.data.batch_number}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'batch_number',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {editForm.errors.batch_number && (
                                        <p className="text-xs font-medium text-red-500">
                                            {editForm.errors.batch_number}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <Label
                                        htmlFor="edit_expiration_date"
                                        className="text-xs font-bold text-slate-600"
                                    >
                                        Expiration Date
                                    </Label>
                                    <Input
                                        id="edit_expiration_date"
                                        type="date"
                                        required
                                        className="rounded-xl border-slate-200 bg-slate-50/50 text-sm focus:border-[#187e52] focus:bg-white"
                                        value={editForm.data.expiration_date}
                                        onChange={(e) =>
                                            editForm.setData(
                                                'expiration_date',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {editForm.errors.expiration_date && (
                                        <p className="text-xs font-medium text-red-500">
                                            {editForm.errors.expiration_date}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <DialogFooter className="pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="cursor-pointer rounded-xl"
                                    onClick={() => setIsEditOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="cursor-pointer rounded-xl bg-[#187e52] font-semibold text-white hover:bg-[#136642]"
                                >
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* DELETE DIALOG */}
                <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    <DialogContent className="rounded-[1.5rem] p-6 sm:max-w-[400px]">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-bold text-red-600">
                                Delete Formulation
                            </DialogTitle>
                            <DialogDescription className="mt-1 text-xs text-slate-500">
                                Are you sure you want to remove{' '}
                                <span className="font-bold text-slate-800">
                                    {selectedItem?.generic_name} (
                                    {selectedItem?.dosage})
                                </span>{' '}
                                from the inventory registry?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="cursor-pointer rounded-xl"
                                onClick={() => setIsDeleteOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDeleteSubmit}
                                className="cursor-pointer rounded-xl bg-red-600 font-semibold text-white hover:bg-red-800"
                            >
                                Delete Medicine
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </AppLayout>
        </>
    );
}
