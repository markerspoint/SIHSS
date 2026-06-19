import { router } from "@inertiajs/react"
import { useState, useMemo } from "react"
import type { PatientRecord } from "@/types/patient-records-types"

export function usePatientRecordsHook(initialPatients: PatientRecord[] = []) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    initialPatients.length > 0 ? initialPatients[0].id : null
  )

  // Filter patients by search term
  const filteredPatients = useMemo(() => {
    return initialPatients.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [initialPatients, searchTerm])

  // Resolve active patient details
  const activePatient = useMemo(() => {
    return initialPatients.find((p) => p.id === selectedPatientId) || null
  }, [initialPatients, selectedPatientId])

  // Delete Patient handler
  const handleDeletePatient = (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete the record of ${name}? This action cannot be undone.`)) {
      router.delete(`/medical/geotagging/${id}`, {
        onSuccess: () => {
          alert("Patient record deleted successfully.")

          // If the deleted patient was the active one, pick the next available
          if (selectedPatientId === id) {
            const remaining = initialPatients.filter((p) => p.id !== id)
            setSelectedPatientId(remaining.length > 0 ? remaining[0].id : null)
          }
        },
        onError: (errors) => {
          alert(Object.values(errors).join("\n"))
        },
      })
    }
  }

  return {
    searchTerm,
    setSearchTerm,
    selectedPatientId,
    setSelectedPatientId,
    filteredPatients,
    activePatient,
    handleDeletePatient,
  }
}
