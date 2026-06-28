import { Head, usePage, router } from "@inertiajs/react"
import {
  FileText,
  Search,
  HeartPulse,
  MapPin,
  Trash2,
  Calendar,
  User,
  Info,
} from "lucide-react"
import React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { usePatientRecordsHook } from "@/hooks/patient-records-hook"
import AppLayout from "@/layouts/AppLayout"
import type { PatientRecord } from "@/types/patient-records-types"

export default function PatientRecords() {
  const { props } = usePage()
  const { patients = [] } = props as unknown as { patients: PatientRecord[] }

  const {
    searchTerm,
    setSearchTerm,
    selectedPatientId,
    setSelectedPatientId,
    filteredPatients,
    activePatient,
    handleDeletePatient,
  } = usePatientRecordsHook(patients)

  return (
    <>
      <Head title="Mental Health Patient Records" />
      <AppLayout breadcrumbs={[{ title: "Mental Health" }, { title: "Patient Records" }]}>
        
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <FileText className="h-7 w-7 text-[#187e52]" />
            Mental Health Client Directory
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Manage case file details and verify registration coordinates for mental health service delivery.
          </p>
        </div>

        {/* Directory Layout */}
        <div className="grid gap-6 lg:grid-cols-12 flex-1 min-h-0">
          
          {/* Patients Table Panel */}
          <Card className="lg:col-span-8 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm flex flex-col space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                Patient Index
                <span className="rounded-full bg-slate-100 text-slate-600 px-2.5 py-0.5 text-xs font-semibold">
                  {patients.length} total
                </span>
              </h3>

              {/* Search */}
              <div className="relative max-w-xs w-full">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by name, barangay, condition..."
                  className="pl-9 rounded-xl border-slate-200 bg-slate-50/50 focus:border-[#187e52] focus:bg-white text-xs py-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <Table className="border border-slate-100 rounded-xl overflow-hidden">
              <TableHeader>
                <TableRow className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider hover:bg-slate-50">
                  <TableHead className="py-3 px-4 h-auto text-slate-500">Patient Name</TableHead>
                  <TableHead className="py-3 px-4 h-auto text-slate-500">Disorder</TableHead>
                  <TableHead className="py-3 px-4 h-auto text-slate-500">Barangay Address</TableHead>
                  <TableHead className="py-3 px-4 h-auto text-right text-slate-500">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-slate-700 font-medium text-xs">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((p) => (
                    <TableRow 
                      key={p.id} 
                      className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                        selectedPatientId === p.id ? "bg-emerald-50/30" : ""
                      }`}
                      onClick={() => setSelectedPatientId(p.id)}
                    >
                      <TableCell className="py-3 px-4 font-semibold text-slate-900">{p.name}</TableCell>
                      <TableCell className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 border border-indigo-100">
                          <HeartPulse className="h-3 w-3 text-indigo-600" />
                          {p.condition}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 px-4 text-slate-500">{p.address}</TableCell>
                      <TableCell className="py-3 px-4 text-right onClick-prevent" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                          onClick={() => handleDeletePatient(p.id, p.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="py-8 text-center text-slate-400">
                      No patient records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>

          {/* Details Panel */}
          <div className="lg:col-span-4 space-y-4">
            {activePatient ? (
              <Card className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                    Active Case File
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-3 flex items-center gap-2">
                    <User className="h-5 w-5 text-slate-400" />
                    {activePatient.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">Patient identification record.</p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">Primary Diagnosis</span>
                    <div className="flex items-center gap-2 text-slate-700 font-semibold bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100/30">
                      <HeartPulse className="h-4 w-4 text-indigo-600" />
                      {activePatient.condition}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">Home Address</span>
                    <div className="flex items-center gap-2 text-slate-700 font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      {activePatient.address}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">Spatial Coordinates</span>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150 font-mono text-[10px] text-slate-600 flex justify-between items-center">
                      <span>Lat: {activePatient.lat.toFixed(6)}</span>
                      <span>Lng: {activePatient.lng.toFixed(6)}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-slate-400 block uppercase tracking-wider text-[10px]">Date Pinned</span>
                    <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>
                        {new Date(activePatient.created_at).toLocaleString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <Button
                    onClick={() => {
                      // Navigate to geotagging page and let map ease/fly to coordinate
                      router.visit(`/medical/geotagging`, {
                        onSuccess: () => {
                          // Note: In a fully responsive SPA, we can pass coordinates in session or state,
                          // or let the map focus on these coordinates.
                        }
                      })
                    }}
                    className="w-full rounded-xl bg-[#187e52] hover:bg-[#136642] text-white font-semibold cursor-pointer py-4"
                  >
                    Locate on Geotag Map
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDeletePatient(activePatient.id, activePatient.name)}
                    className="w-full rounded-xl border-rose-200 hover:bg-rose-50 text-rose-600 font-semibold cursor-pointer py-4"
                  >
                    Delete Case Record
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm text-center py-12 space-y-3">
                <Info className="h-12 w-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-700 text-sm">No patient selected</h3>
                <p className="text-xs text-slate-400 max-w-[200px] mx-auto leading-relaxed">
                  Select a patient from the index table to inspect their spatial files and diagnosis cards.
                </p>
              </Card>
            )}
          </div>
        </div>

      </AppLayout>
    </>
  )
}
