import { router } from "@inertiajs/react"
import type maplibregl from "maplibre-gl"
import type React from "react";
import { useState, useEffect, useRef, useMemo } from "react"
import { reverseGeocode } from "@/lib/geotag-utils"
import type { PatientRecord } from "@/types/geotag-types"

export function useGeotagHook(initialPatients: PatientRecord[] = []) {
  const [searchTerm, setSearchTerm] = useState("")

  // New Patient Form State
  const [name, setName] = useState("")
  const [barangay, setBarangay] = useState("")
  const [sitio, setSitio] = useState("")
  const [condition, setCondition] = useState("")
  const [lat, setLat] = useState<number | "">("")
  const [lng, setLng] = useState<number | "">("")
  const [isFetchingAddress, setIsFetchingAddress] = useState(false)

  // MapRef to fly map to coordinates
  const mapRef = useRef<maplibregl.Map | null>(null)

  // Fly map when coordinate values are pinned
  useEffect(() => {
    const latitude = Number(lat)
    const longitude = Number(lng)

    if (
      mapRef.current &&
      lat !== "" &&
      lng !== "" &&
      !isNaN(latitude) &&
      !isNaN(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    ) {
      mapRef.current.flyTo({
        center: [longitude, latitude],
        speed: 0.5,
      })
    }
  }, [lat, lng])

  // Form submission handler
  const handleSavePatient = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !barangay || !condition || lat === "" || lng === "") {
      alert("Please fill out all fields (Name, Barangay, Condition, Latitude, and Longitude).")

      return
    }

    const fullAddress = sitio ? `${barangay}, ${sitio}` : barangay

    router.post(
      "/medical/geotagging",
      {
        name,
        address: fullAddress,
        condition,
        lat: Number(lat),
        lng: Number(lng),
      },
      {
        onSuccess: () => {
          // Reset inputs
          setName("")
          setBarangay("")
          setSitio("")
          setCondition("")
          setLat("")
          setLng("")
          alert("Patient geotagged and registered successfully!")
        },
        onError: (errors) => {
          alert(Object.values(errors).join("\n"))
        },
      }
    )
  }

  // Filter patients by search
  const filteredPatients = useMemo(() => {
    return initialPatients.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [initialPatients, searchTerm])

  // Map click handler (triggering geocoding and setting form state)
  const handleMapClick = async (lngLat: maplibregl.LngLat) => {
    const latitude = parseFloat(lngLat.lat.toFixed(6))
    const longitude = parseFloat(lngLat.lng.toFixed(6))
    setLat(latitude)
    setLng(longitude)

    setIsFetchingAddress(true)

    try {
      const result = await reverseGeocode(latitude, longitude)

      if (result) {
        if (result.barangay) {
          setBarangay(result.barangay)
        }

        setSitio(result.sitio)
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err)
    } finally {
      setIsFetchingAddress(false)
    }
  }

  // Centering map helper on a patient record
  const locatePatient = (p: PatientRecord) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [p.lng, p.lat],
        zoom: 14,
        speed: 0.8,
      })
    }
  }

  return {
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
  }
}
