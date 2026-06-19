import { Head, usePage } from "@inertiajs/react"
import {
  Map as MapIcon,
  Filter,
  MapPin,
  HeartPulse,
  Info,
} from "lucide-react"
import type maplibregl from "maplibre-gl"
import React, { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MapControls,
  MarkerTooltip,
  MarkerLabel,
} from "@/components/ui/map"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import AppLayout from "@/layouts/AppLayout"
import type { PatientRecord } from "@/types/geotag-types"

export default function PatientsTagged() {
  const { props } = usePage()
  const { patients = [] } = props as unknown as { patients: PatientRecord[] }

  const [selectedCondition, setSelectedCondition] = useState("ALL")

  // MapRef to fly map to coordinates
  const mapRef = useRef<maplibregl.Map | null>(null)

  // Filter patients
  const filteredPatients = selectedCondition === "ALL"
    ? patients
    : patients.filter(p => p.condition === selectedCondition)

  // Fly to the first matched patient on filter change
  useEffect(() => {
    if (filteredPatients.length > 0 && mapRef.current) {
      mapRef.current.flyTo({
        center: [filteredPatients[0].lng, filteredPatients[0].lat],
        zoom: 13,
        speed: 0.5
      })
    }
  }, [filteredPatients])

  return (
    <>
      <Head title="Patients Tagged Spatial Map" />
      <AppLayout breadcrumbs={[{ title: "Mental Health" }, { title: "Patients Tagged" }]}>
        
        {/* Header section with filter controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              <MapIcon className="h-7 w-7 text-[#187e52]" />
              Spatial Distribution Map
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Geographic distribution of mental health cases in Sipalay City barangays.
            </p>
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm self-start md:self-auto min-w-[240px]">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <div className="flex-1">
              <Select value={selectedCondition} onValueChange={(val) => setSelectedCondition(val)}>
                <SelectTrigger className="border-0 shadow-none focus:ring-0 p-0 text-xs font-bold text-slate-700 h-auto cursor-pointer">
                  <SelectValue placeholder="Filter by condition" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="ALL">All Conditions</SelectItem>
                  <SelectItem value="Schizophrenia">Schizophrenia</SelectItem>
                  <SelectItem value="Bipolar I Disorder">Bipolar I Disorder</SelectItem>
                  <SelectItem value="Major Depressive Disorder">Major Depressive Disorder</SelectItem>
                  <SelectItem value="Post-Traumatic Stress Disorder (PTSD)">PTSD</SelectItem>
                  <SelectItem value="Generalized Anxiety Disorder">Generalized Anxiety</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Map and details layout */}
        <div className="grid gap-6 lg:grid-cols-12 flex-1 min-h-0">
          
          {/* Map Section */}
          <Card className="lg:col-span-9 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm h-[600px] relative flex flex-col overflow-hidden">
            <Map
              ref={mapRef}
              theme="light"
              center={[122.4011, 9.7497]} // Sipalay City Center
              zoom={13}
              className="flex-1 w-full rounded-2xl overflow-hidden shadow-inner border border-slate-150"
            >
              <MapControls showZoom showCompass showFullscreen />

              {filteredPatients.map((patient) => (
                <MapMarker
                  key={patient.id}
                  longitude={patient.lng}
                  latitude={patient.lat}
                >
                  <MarkerContent />
                  <MarkerTooltip>{patient.name}</MarkerTooltip>
                  <MarkerLabel position="bottom">{patient.condition}</MarkerLabel>
                  <MarkerPopup closeButton>
                    <div className="p-1 min-w-[160px]">
                      <h4 className="font-bold text-slate-800 text-sm mb-1">{patient.name}</h4>
                      <p className="text-xs text-slate-500 mb-0.5"><b>Condition:</b> {patient.condition}</p>
                      <p className="text-xs text-slate-500"><b>Address:</b> {patient.address}</p>
                      <p className="text-[9px] font-mono text-slate-400 mt-1">{patient.lat.toFixed(5)}, {patient.lng.toFixed(5)}</p>
                    </div>
                  </MarkerPopup>
                </MapMarker>
              ))}
            </Map>
            
            {/* Status indicators */}
            <div className="absolute bottom-6 left-6 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-mono font-bold text-slate-600 shadow flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-red-600" />
              Showing {filteredPatients.length} of {patients.length} total geotags
            </div>
          </Card>

          {/* Side stats card */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <HeartPulse className="h-5 w-5 text-indigo-600" />
                  Filter Summary
                </h3>
                <p className="text-xs text-slate-400 font-medium">Selected condition statistics.</p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-center items-center text-center">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Pins</span>
                  <span className="text-4xl font-extrabold text-slate-900 mt-1">{filteredPatients.length}</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2.5 text-xs text-slate-500 font-medium leading-relaxed">
                    <Info className="h-4.5 w-4.5 text-[#187e52] shrink-0 mt-0.5" />
                    <span>Click on any map pin to display patient identity and Barangay location.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-500 font-medium leading-relaxed">
                    <Info className="h-4.5 w-4.5 text-[#187e52] shrink-0 mt-0.5" />
                    <span>The map shows exact coordinates. Zoom in to identify specific residential clusters.</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* List of active filtered patients */}
            <Card className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm flex flex-col h-[330px] overflow-hidden">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-3 shrink-0">
                Registry Index ({filteredPatients.length})
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {filteredPatients.length > 0 ? (
                  filteredPatients.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        if (mapRef.current) {
                          mapRef.current.flyTo({
                            center: [p.lng, p.lat],
                            zoom: 15,
                            speed: 0.8
                          })
                        }
                      }}
                      className="w-full text-left p-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-lg text-xs transition-colors flex flex-col gap-1 cursor-pointer"
                    >
                      <span className="font-bold text-slate-800 truncate">{p.name}</span>
                      <span className="text-[10px] text-slate-500 truncate">{p.address}</span>
                      <span className="text-[9px] font-mono text-slate-400">{p.lat.toFixed(4)}, {p.lng.toFixed(4)}</span>
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-8">No records match filter.</p>
                )}
              </div>
            </Card>
          </div>
        </div>

      </AppLayout>
    </>
  )
}
