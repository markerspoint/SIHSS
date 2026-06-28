import { Head, usePage } from "@inertiajs/react"
import {
  FileText,
  Search,
  Calendar,
  User,
  Info,
  Pill,
  Activity,
  History,
  Clock,
} from "lucide-react"
import React, { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import AppLayout from "@/layouts/AppLayout"

interface MedicationLog {
  id: number
  generic_name: string
  dosage: string
  form: string
  quantity_dispensed: number
  notes: string | null
  date: string
}

interface PatientHistory {
  name: string
  last_visit: string
  history: MedicationLog[]
}

export default function Patients() {
  const { props } = usePage()
  const { patients = [] } = props as unknown as { patients: PatientHistory[] }

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatientName, setSelectedPatientName] = useState<string | null>(
    patients.length > 0 ? patients[0].name : null
  )

  // Filter patients list
  const filteredPatients = patients.filter((p) => {
    const searchLower = searchTerm.toLowerCase()
    const matchesName = p.name.toLowerCase().includes(searchLower)
    const matchesDrug = p.history.some((h) => h.generic_name.toLowerCase().includes(searchLower))
    return matchesName || matchesDrug
  })

  // Selected patient details
  const activePatientName = selectedPatientName || (filteredPatients.length > 0 ? filteredPatients[0].name : null)
  const activePatient = patients.find((p) => p.name === activePatientName)

  return (
    <>
      <Head title="Patient Medication History" />
      <AppLayout breadcrumbs={[{ title: "Pharmacy" }, { title: "Patient History" }]}>
        
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <History className="h-8 w-8 text-[#187e52]" />
            Patient Medication History
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Search patients and review their historical medication dispensation timelines and last visits.
          </p>
        </div>

        {/* Directory Layout */}
        <div className="grid gap-6 lg:grid-cols-12 flex-1 min-h-0">
          
          {/* Patients Index Panel */}
          <Card className="lg:col-span-5 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm flex flex-col space-y-4">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                Patient Index
                <span className="rounded-full bg-slate-100 text-slate-600 px-2.5 py-0.5 text-xs font-semibold">
                  {patients.length} patients
                </span>
              </h3>

              {/* Search */}
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search by patient or generic drug..."
                  className="pl-9 rounded-xl border-slate-200 bg-slate-50/50 focus:border-[#187e52] focus:bg-white text-xs py-4.5"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto max-h-[500px] space-y-2 pr-1">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((p) => {
                  const isActive = activePatientName === p.name
                  return (
                    <div
                      key={p.name}
                      onClick={() => setSelectedPatientName(p.name)}
                      className={`group flex items-center justify-between rounded-xl p-4 transition-all duration-200 cursor-pointer border ${
                        isActive
                          ? "bg-emerald-50/30 border-emerald-100 shadow-sm"
                          : "bg-white border-slate-100 hover:bg-slate-50/30 hover:border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-extrabold text-sm ${
                          isActive 
                            ? "bg-emerald-500 text-white" 
                            : "bg-slate-50 text-slate-500 group-hover:bg-slate-100"
                        }`}>
                          <User className="h-4.5 w-4.5" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-800 leading-none">{p.name}</h4>
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                            <Clock className="h-3 w-3" />
                            Last Visit: {new Date(p.last_visit).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <User className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-500">No patients matched search</p>
                </div>
              )}
            </div>
          </Card>

          {/* History Details Panel */}
          <Card className="lg:col-span-7 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm flex flex-col space-y-6">
            {activePatient ? (
              <>
                {/* Active Patient Details Header */}
                <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-[#187e52] font-extrabold text-lg border border-emerald-100">
                    {activePatient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .substring(0, 2)}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-extrabold text-slate-900 leading-tight">{activePatient.name}</h3>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      Last visit: {new Date(activePatient.last_visit).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {/* Medication Timeline */}
                <div className="flex-1 overflow-y-auto max-h-[420px] space-y-4 pr-1">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="h-4.5 w-4.5 text-[#187e52]" />
                    Medication Logs ({activePatient.history.length})
                  </h4>

                  <div className="relative border-l border-slate-100 ml-4.5 space-y-6 pt-2 pb-4">
                    {activePatient.history.map((log) => (
                      <div key={log.id} className="relative pl-7">
                        {/* Timeline point */}
                        <div className="absolute -left-2 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-white">
                          <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        </div>

                        {/* Card item */}
                        <div className="space-y-2 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl p-4 transition-all duration-200">
                          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                            <h5 className="text-xs font-bold text-slate-900 uppercase flex items-center gap-1.5">
                              <Pill className="h-4.5 w-4.5 text-slate-400" />
                              {log.generic_name}
                              <span className="font-semibold text-slate-500 lowercase">
                                ({log.dosage} &bull; {log.form})
                              </span>
                            </h5>
                            <span className="text-[10px] text-slate-400 font-bold bg-white px-2 py-0.5 rounded-lg border border-slate-200/60 self-start sm:self-auto font-mono">
                              {new Date(log.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-xs font-medium border-t border-slate-100/80 pt-2 text-slate-600">
                            <div>
                              <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">Quantity Dispensed</span>
                              <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">
                                {log.quantity_dispensed}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">Instructions</span>
                              <span className="italic text-slate-700 block mt-0.5 leading-relaxed font-semibold">
                                {log.notes || "No notes provided"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-24 text-center text-slate-400 flex-1 flex flex-col items-center justify-center space-y-2">
                <FileText className="h-14 w-14 text-slate-200" />
                <h4 className="font-bold text-slate-700">Select a Patient</h4>
                <p className="text-xs text-slate-400 max-w-[240px]">
                  Select a patient record from the list to view their complete history.
                </p>
              </div>
            )}
          </Card>

        </div>

      </AppLayout>
    </>
  )
}
