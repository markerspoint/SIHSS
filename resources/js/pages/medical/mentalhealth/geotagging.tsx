import { Head, usePage } from "@inertiajs/react"
import {
  MapPin,
  HeartPulse,
  FileText,
  PlusCircle,
  Map as MapIcon,
  Search,
  Eye,
} from "lucide-react"
import type maplibregl from "maplibre-gl"
import React, { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Map,
  useMap,
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
import { useGeotagHook } from "@/hooks/geotag-hook"
import AppLayout from "@/layouts/AppLayout"
import type { PatientRecord } from "@/types/geotag-types"

// Helper component to listen to map click events using mapcn's context
function MapClickObserver({ onClick }: { onClick: (coords: maplibregl.LngLat) => void }) {
  const { map } = useMap()

  useEffect(() => {
    if (!map) {
return
}

    const handler = (e: maplibregl.MapMouseEvent) => {
      onClick(e.lngLat)
    }

    map.on("click", handler)

    return () => {
      map.off("click", handler)
    }
  }, [map, onClick])

  return null
}

export default function GeotaggingPortal() {
  const { props } = usePage()
  const { patients = [] } = props as unknown as { patients: PatientRecord[] }

  const {
    searchTerm,
    setSearchTerm,
    name,
    setName,
    barangay,
    setBarangay,
    sitio,
    setSitio,
    condition,
    setCondition,
    lat,
    setLat,
    lng,
    setLng,
    isFetchingAddress,
    mapRef,
    handleSavePatient,
    filteredPatients,
    handleMapClick,
    locatePatient,
  } = useGeotagHook(patients)

  return (
    <>
      <Head title="Mental Health Geotagging" />
      <AppLayout breadcrumbs={[{ title: "Mental Health" }, { title: "Geotagging Portal" }]}>
        
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
            <MapIcon className="h-7 w-7 text-[#187e52]" />
            Mental Health Spatial Registry (Sipalay City)
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Locate and tag residents diagnosed with mental health disorders to map spatial service distribution.
          </p>
        </div>

        {/* Workspace Layout */}
        <div className="grid gap-6 lg:grid-cols-12">
          
          {/* Geotag Form Panel */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
              <CardHeader className="p-0 border-b border-slate-100 pb-3 mb-4">
                <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-[#187e52]" />
                  Geotag Patient Record
                </CardTitle>
                <CardDescription className="text-xs">
                  Fill in clinical details. Click on the map or type manually to pin coordinates.
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSavePatient} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-xs font-bold text-slate-600">Patient Full Name</Label>
                  <Input
                    id="name"
                    required
                    placeholder="e.g. Jane Doe"
                    className="rounded-xl border-slate-200 bg-slate-50/50 focus:border-[#187e52] focus:bg-white text-xs"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="barangay" className="text-xs font-bold text-slate-600 flex justify-between items-center w-full">
                    <span>Home Address (Barangay)</span>
                    {isFetchingAddress && <span className="text-[10px] text-emerald-600 animate-pulse">Detecting...</span>}
                  </Label>
                  <Select value={barangay} onValueChange={(val) => setBarangay(val)}>
                    <SelectTrigger id="barangay" className="rounded-xl border-slate-200 bg-slate-50/50 text-xs">
                      <SelectValue placeholder="Select Barangay" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
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
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="sitio" className="text-xs font-bold text-slate-600 flex justify-between items-center w-full">
                    <span>Sitio / Street / Zone (Optional)</span>
                    {isFetchingAddress && <span className="text-[10px] text-emerald-600 animate-pulse">Detecting...</span>}
                  </Label>
                  <Input
                    id="sitio"
                    placeholder={isFetchingAddress ? "Detecting address..." : "e.g. Sitio Cambugsa"}
                    className="rounded-xl border-slate-200 bg-slate-50/50 focus:border-[#187e52] focus:bg-white text-xs"
                    value={sitio}
                    onChange={(e) => setSitio(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="condition" className="text-xs font-bold text-slate-600">Disorder/Condition</Label>
                  <Select value={condition} onValueChange={(val) => setCondition(val)}>
                    <SelectTrigger id="condition" className="rounded-xl border-slate-200 bg-slate-50/50 text-xs">
                      <SelectValue placeholder="Select disorder" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Schizophrenia">Schizophrenia</SelectItem>
                      <SelectItem value="Bipolar I Disorder">Bipolar I Disorder</SelectItem>
                      <SelectItem value="Major Depressive Disorder">Major Depressive Disorder</SelectItem>
                      <SelectItem value="Post-Traumatic Stress Disorder (PTSD)">PTSD</SelectItem>
                      <SelectItem value="Generalized Anxiety Disorder">Generalized Anxiety</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Coordinates Picker outputs */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="lat" className="text-[10px] font-bold text-slate-500">Latitude</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="any"
                      placeholder="e.g. 9.7497"
                      className="rounded-xl border-slate-200 bg-slate-50/50 focus:border-[#187e52] focus:bg-white font-mono text-[10px] text-slate-800"
                      value={lat}
                      onChange={(e) => {
                        const val = e.target.value
                        setLat(val === "" ? "" : parseFloat(val))
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lng" className="text-[10px] font-bold text-slate-500">Longitude</Label>
                    <Input
                      id="lng"
                      type="number"
                      step="any"
                      placeholder="e.g. 122.4011"
                      className="rounded-xl border-slate-200 bg-slate-50/50 focus:border-[#187e52] focus:bg-white font-mono text-[10px] text-slate-800"
                      value={lng}
                      onChange={(e) => {
                        const val = e.target.value
                        setLng(val === "" ? "" : parseFloat(val))
                      }}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="rounded-xl bg-[#187e52] hover:bg-[#136642] text-white font-semibold w-full mt-3 cursor-pointer py-5"
                >
                  Save Geotagged Patient
                </Button>
              </form>
            </Card>
          </div>

          {/* Map & Directory Table Panel */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* MapLibre Map Viewport wrapper */}
            <Card className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm h-[420px] relative flex flex-col">
              
              <Map
                ref={mapRef}
                theme="light"
                center={[122.4011, 9.7497]} // Sipalay City Center
                zoom={13}
                className="flex-1 w-full rounded-2xl overflow-hidden shadow-inner border border-slate-150"
              >
                <MapControls showZoom showCompass showFullscreen />
                <MapClickObserver onClick={handleMapClick} />

                {/* Render Existing Patients pins */}
                {patients.map((patient) => (
                  <MapMarker
                    key={patient.id}
                    longitude={patient.lng}
                    latitude={patient.lat}
                  >
                    <MarkerContent />
                    <MarkerTooltip>{patient.name}</MarkerTooltip>
                    <MarkerLabel position="bottom">{patient.condition}</MarkerLabel>
                    <MarkerPopup closeButton>
                      <div className="p-1 min-w-[150px]">
                        <h4 className="font-bold text-slate-800 text-sm mb-1">{patient.name}</h4>
                        <p className="text-xs text-slate-500 mb-0.5"><b>Condition:</b> {patient.condition}</p>
                        <p className="text-xs text-slate-500"><b>Address:</b> {patient.address}</p>
                      </div>
                    </MarkerPopup>
                  </MapMarker>
                ))}

                {/* Render Pinned Selection Pin */}
                {lat !== "" && lng !== "" && (
                  <MapMarker longitude={Number(lng)} latitude={Number(lat)}>
                    <MarkerContent>
                      <div className="h-6 w-6 rounded-full border-2 border-white bg-emerald-500 shadow-lg animate-bounce" />
                    </MarkerContent>
                  </MapMarker>
                )}
              </Map>
              
              {/* Floating coordinates indicator */}
              <div className="absolute bottom-6 left-6 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-mono font-bold text-slate-600 shadow flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-emerald-600" />
                Sipalay City Center: 122.4011° E, 9.7497° N
              </div>
            </Card>

            {/* Patients Directory Table inside Geotagging */}
            <Card className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  Geotagged Directory Registry
                  <span className="rounded-full bg-slate-100 text-slate-600 px-2.5 py-0.5 text-xs font-semibold">
                    {patients.length} tagged
                  </span>
                </h3>

                {/* Search */}
                <div className="relative max-w-xs w-full">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search directory..."
                    className="pl-9 rounded-xl border-slate-200 bg-slate-50/50 focus:border-[#187e52] focus:bg-white text-xs py-4"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                      <th className="py-2.5 px-3">Patient Name</th>
                      <th className="py-2.5 px-3">Disorder</th>
                      <th className="py-2.5 px-3">Barangay</th>
                      <th className="py-2.5 px-3 font-mono">Coords (Lat, Lng)</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{p.name}</td>
                          <td className="py-2.5 px-3">
                            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 border border-indigo-100">
                              <HeartPulse className="h-3 w-3 text-indigo-600" />
                              {p.condition}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-500">{p.address}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-500 text-[10px]">{p.lat.toFixed(4)}, {p.lng.toFixed(4)}</td>
                          <td className="py-2.5 px-3 text-right">
                            <Button
                              variant="outline"
                              size="xs"
                              className="inline-flex items-center gap-1 border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer text-[10px] px-2 py-1 h-auto"
                              onClick={() => locatePatient(p)}
                            >
                              <Eye className="h-3 w-3 text-slate-500" />
                              Locate
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          No patients found in search query.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

          </div>

        </div>

      </AppLayout>
    </>
  )
}

