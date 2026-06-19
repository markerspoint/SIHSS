import type maplibregl from "maplibre-gl"
import { useState, useEffect, useRef, useMemo } from "react"
import type { PatientRecord } from "@/types/patient-records-types"

export function usePatientsTaggedHook(initialPatients: PatientRecord[] = []) {
  const [selectedCondition, setSelectedCondition] = useState("ALL")

  // MapRef to fly map to coordinates
  const mapRef = useRef<maplibregl.Map | null>(null)

  // Filter patients by selected condition
  const filteredPatients = useMemo(() => {
    return selectedCondition === "ALL"
      ? initialPatients
      : initialPatients.filter((p) => p.condition === selectedCondition)
  }, [initialPatients, selectedCondition])

  // Fly to the first matched patient on filter change
  useEffect(() => {
    if (filteredPatients.length > 0 && mapRef.current) {
      mapRef.current.flyTo({
        center: [filteredPatients[0].lng, filteredPatients[0].lat],
        zoom: 13,
        speed: 0.5,
      })
    }
  }, [filteredPatients])

  // Fly camera to a specific patient coordinates
  const flyToPatient = (p: PatientRecord) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [p.lng, p.lat],
        zoom: 15,
        speed: 0.8,
      })
    }
  }

  return {
    selectedCondition,
    setSelectedCondition,
    mapRef,
    filteredPatients,
    flyToPatient,
  }
}
