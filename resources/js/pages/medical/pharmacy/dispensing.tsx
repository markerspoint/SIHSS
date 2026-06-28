import { Head, usePage, useForm, router } from "@inertiajs/react"
import {
  FileCheck,
  Search,
  Plus,
  Trash2,
  Calendar,
  User,
  Info,
  Pill,
  HeartHandshake,
} from "lucide-react"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import AppLayout from "@/layouts/AppLayout"

interface DispensationRecord {
  id: number
  patient_name: string
  generic_name: string
  dosage: string
  form: string
  quantity_dispensed: number
  notes: string | null
  created_at: string
}

export default function Dispensing() {
  const { props } = usePage()
  const { dispensations = [] } = props as unknown as {
    dispensations: DispensationRecord[]
  }

  const [searchTerm, setSearchTerm] = useState("")
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isReverseOpen, setIsReverseOpen] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<DispensationRecord | null>(null)

  // Form definition
  const form = useForm({
    patient_name: "",
    generic_name: "",
    dosage: "",
    form: "Tablet",
    quantity_dispensed: 1,
    notes: "",
  })

  // Filtering dispensations
  const filteredDispensations = dispensations.filter((disp) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      disp.patient_name.toLowerCase().includes(searchLower) ||
      disp.generic_name.toLowerCase().includes(searchLower) ||
      (disp.notes || "").toLowerCase().includes(searchLower)
    )
  })

  // Submit dispensation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.post("/medical/pharmacy/dispensing", {
      onSuccess: () => {
        setIsAddOpen(false)
        form.reset()
      },
    })
  }

  // Reverse dispensation
  const handleReverseSubmit = () => {
    if (!selectedRecord) return
    router.delete(`/medical/pharmacy/dispensing/${selectedRecord.id}`, {
      onSuccess: () => {
        setIsReverseOpen(false)
        setSelectedRecord(null)
      },
    })
  }

  return (
    <>
      <Head title="Medicine Dispensing Portal" />
      <AppLayout breadcrumbs={[{ title: "Pharmacy" }, { title: "Dispensing" }]}>
        
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              <HeartHandshake className="h-8 w-8 text-[#187e52]" />
              Medicine Dispensing Portal
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Record medicine dispensation requests and issue generic drugs to registered patients.
            </p>
          </div>
          <Button 
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#187e52] hover:bg-[#136642] text-white py-5 px-4 font-semibold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            Dispense Medication
          </Button>
        </div>

        {/* Layout Grid */}
        <div className="grid gap-6">
          <Card className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                Dispensation Registry Log
                <span className="rounded-full bg-slate-100 text-slate-600 px-2.5 py-0.5 text-xs font-semibold">
                  {dispensations.length} dispensations
                </span>
              </h3>

              {/* Search Log */}
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by patient, generic name..."
                  className="pl-9 rounded-xl border-slate-200 bg-slate-50/50 focus:border-[#187e52] focus:bg-white text-xs py-4.5"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <Table className="border border-slate-100 rounded-xl overflow-hidden">
              <TableHeader>
                <TableRow className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider hover:bg-slate-50">
                  <TableHead className="py-3.5 px-4 h-auto text-slate-500">Patient Name</TableHead>
                  <TableHead className="py-3.5 px-4 h-auto text-slate-500">Drug Dispensed (Generic)</TableHead>
                  <TableHead className="py-3.5 px-4 text-center h-auto text-slate-500">Quantity</TableHead>
                  <TableHead className="py-3.5 px-4 h-auto text-slate-500">Date Dispensed</TableHead>
                  <TableHead className="py-3.5 px-4 h-auto text-slate-500">Instructions / Notes</TableHead>
                  <TableHead className="py-3.5 px-4 text-right h-auto text-slate-500">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-slate-700 font-medium text-xs">
                {filteredDispensations.length > 0 ? (
                  filteredDispensations.map((disp) => (
                    <TableRow key={disp.id} className="hover:bg-slate-50/30 transition-colors">
                      <TableCell className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        {disp.patient_name}
                      </TableCell>
                      <TableCell className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 uppercase">
                            {disp.generic_name}
                          </span>
                          <span className="block text-[10px] text-slate-400 font-semibold uppercase">
                            {disp.dosage} &bull; {disp.form}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5 px-4 text-center font-extrabold text-slate-800">
                        {disp.quantity_dispensed}{" "}
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">
                          unit(s)
                        </span>
                      </TableCell>
                      <TableCell className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-slate-500">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {new Date(disp.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </TableCell>
                      <TableCell className="py-3.5 px-4 text-slate-600 italic font-normal max-w-xs truncate">
                        {disp.notes || <span className="text-slate-300">No notes</span>}
                      </TableCell>
                      <TableCell className="py-3.5 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="inline-flex items-center gap-1 text-xs border-red-100 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg cursor-pointer py-1.5"
                          onClick={() => {
                            setSelectedRecord(disp)
                            setIsReverseOpen(true)
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                          Reverse
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="max-w-[280px] mx-auto space-y-2">
                        <FileCheck className="h-12 w-12 text-slate-300 mx-auto" />
                        <h4 className="font-bold text-slate-700">No dispensation logs found</h4>
                        <p className="text-xs text-slate-400">
                          Perform a new dispensation to issue medicines to patients.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* DISPENSE MEDICATION DIALOG */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-[1.5rem] p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-800">Dispense Medicine</DialogTitle>
              <DialogDescription className="text-slate-500 text-xs mt-1">
                Enter the patient's name and select the generic medicine formulation to dispense.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="space-y-1">
                <Label htmlFor="patient_name" className="text-xs font-bold text-slate-600">Patient Full Name</Label>
                <Input
                  id="patient_name"
                  required
                  placeholder="e.g. Juan dela Cruz"
                  className="rounded-xl border-slate-200 bg-slate-50/50 focus:border-[#187e52] focus:bg-white text-sm"
                  value={form.data.patient_name}
                  onChange={(e) => form.setData("patient_name", e.target.value)}
                />
                {form.errors.patient_name && (
                  <p className="text-xs text-red-500 font-medium">{form.errors.patient_name}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="generic_name" className="text-xs font-bold text-slate-600">Generic Name</Label>
                <Input
                  id="generic_name"
                  required
                  placeholder="e.g. Paracetamol"
                  className="rounded-xl border-slate-200 bg-slate-50/50 focus:border-[#187e52] focus:bg-white text-sm"
                  value={form.data.generic_name}
                  onChange={(e) => form.setData("generic_name", e.target.value)}
                />
                {form.errors.generic_name && (
                  <p className="text-xs text-red-500 font-medium">{form.errors.generic_name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="dosage" className="text-xs font-bold text-slate-600">Dosage / Formulation</Label>
                  <Input
                    id="dosage"
                    required
                    placeholder="e.g. 500mg"
                    className="rounded-xl border-slate-200 bg-slate-50/50 focus:border-[#187e52] focus:bg-white text-sm"
                    value={form.data.dosage}
                    onChange={(e) => form.setData("dosage", e.target.value)}
                  />
                  {form.errors.dosage && (
                    <p className="text-xs text-red-500 font-medium">{form.errors.dosage}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="form" className="text-xs font-bold text-slate-600">Form</Label>
                  <Select
                    value={form.data.form}
                    onValueChange={(val) => form.setData("form", val)}
                  >
                    <SelectTrigger id="form" className="rounded-xl border-slate-200 bg-slate-50/50 text-sm">
                      <SelectValue placeholder="Select form" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Tablet">Tablet</SelectItem>
                      <SelectItem value="Capsule">Capsule</SelectItem>
                      <SelectItem value="Syrup">Syrup</SelectItem>
                      <SelectItem value="Suspension">Suspension</SelectItem>
                      <SelectItem value="Ointment">Ointment</SelectItem>
                      <SelectItem value="Inhaler">Inhaler</SelectItem>
                      <SelectItem value="Injection">Injection</SelectItem>
                      <SelectItem value="Drops">Drops</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.errors.form && (
                    <p className="text-xs text-red-500 font-medium">{form.errors.form}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="quantity_dispensed" className="text-xs font-bold text-slate-600">Quantity to Dispense</Label>
                <Input
                  id="quantity_dispensed"
                  type="number"
                  required
                  min="1"
                  className="rounded-xl border-slate-200 bg-slate-50/50 focus:border-[#187e52] focus:bg-white text-sm"
                  value={form.data.quantity_dispensed}
                  onChange={(e) => form.setData("quantity_dispensed", parseInt(e.target.value) || 1)}
                />
                {form.errors.quantity_dispensed && (
                  <p className="text-xs text-red-500 font-medium">{form.errors.quantity_dispensed}</p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="notes" className="text-xs font-bold text-slate-600">Instructions / Notes</Label>
                <Input
                  id="notes"
                  placeholder="e.g. 1 tablet 3x daily after meals for 7 days"
                  className="rounded-xl border-slate-200 bg-slate-50/50 focus:border-[#187e52] focus:bg-white text-sm"
                  value={form.data.notes}
                  onChange={(e) => form.setData("notes", e.target.value)}
                />
                {form.errors.notes && (
                  <p className="text-xs text-red-500 font-medium">{form.errors.notes}</p>
                )}
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl cursor-pointer"
                  onClick={() => setIsAddOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={form.processing}
                  className="rounded-xl bg-[#187e52] hover:bg-[#136642] text-white font-semibold cursor-pointer"
                >
                  Dispense
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* REVERSE DIALOG */}
        <Dialog open={isReverseOpen} onOpenChange={setIsReverseOpen}>
          <DialogContent className="sm:max-w-[400px] rounded-[1.5rem] p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-red-600">Reverse Dispensation</DialogTitle>
              <DialogDescription className="text-slate-500 text-xs mt-1">
                Are you sure you want to reverse the dispensation of <span className="font-bold text-slate-800">{selectedRecord?.quantity_dispensed} units</span> of <span className="font-bold text-slate-800">{selectedRecord?.generic_name}</span> to <span className="font-bold text-slate-800">{selectedRecord?.patient_name}</span>?
              </DialogDescription>
            </DialogHeader>
            <div className="py-2.5 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5">
              <Info className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 font-medium leading-normal">
                This will permanently delete this dispensation log record from the patient history list.
              </p>
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl cursor-pointer"
                onClick={() => setIsReverseOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReverseSubmit}
                className="rounded-xl bg-red-600 hover:bg-red-800 text-white font-semibold cursor-pointer"
              >
                Reverse Log
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </AppLayout>
    </>
  )
}
