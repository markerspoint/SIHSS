export const SIPALAY_BARANGAYS = [
  "Barangay 1 (Poblacion)",
  "Barangay 2 (Poblacion)",
  "Barangay 3 (Poblacion)",
  "Barangay 4 (Poblacion)",
  "Barangay 5 (Poblacion)",
  "Cabadiangan",
  "Camindangan",
  "Canturay",
  "Cartagena",
  "Cayhagan",
  "Gil Montilla",
  "Mambaroto",
  "Manlucahoc",
  "Maricalum",
  "Nabulao",
  "Nauhang",
  "San Jose",
]

interface NominatimAddress {
  suburb?: string
  village?: string
  neighbourhood?: string
  quarter?: string
  hamlet?: string
  town?: string
  city_district?: string
  city?: string
  amenity?: string
  building?: string
  shop?: string
  road?: string
  [key: string]: any
}

interface NominatimResponse {
  address?: NominatimAddress
  display_name?: string
  [key: string]: any
}

export interface GeotagAddressResult {
  barangay: string
  sitio: string
}

export async function reverseGeocode(lat: number, lng: number): Promise<GeotagAddressResult | null> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Nominatim API returned status ${res.status}`)
  }
  
  const data: NominatimResponse = await res.json()

  if (!data || !data.address) {
    return null
  }

  const addr = data.address
  let matchedBarangay = ""

  const searchFields = [
    addr.suburb,
    addr.village,
    addr.neighbourhood,
    addr.quarter,
    addr.hamlet,
    addr.town,
    addr.city_district,
    addr.city,
  ]
    .filter(Boolean)
    .map((val) => String(val).toLowerCase())

  const displayNameLower = (data.display_name || "").toLowerCase()

  for (const brgy of SIPALAY_BARANGAYS) {
    const baseName = brgy.split(" (")[0].toLowerCase()
    const matchesField = searchFields.some((f) => f.includes(baseName) || baseName.includes(f))
    const matchesDisplay = displayNameLower.includes(baseName)

    if (matchesField || matchesDisplay) {
      matchedBarangay = brgy
      break
    }
  }

  if (!matchedBarangay) {
    if (displayNameLower.includes("poblacion")) {
      if (displayNameLower.includes("barangay 1") || displayNameLower.includes("barangay i")) {
        matchedBarangay = "Barangay 1 (Poblacion)"
      } else if (displayNameLower.includes("barangay 2") || displayNameLower.includes("barangay ii")) {
        matchedBarangay = "Barangay 2 (Poblacion)"
      } else if (displayNameLower.includes("barangay 3") || displayNameLower.includes("barangay iii")) {
        matchedBarangay = "Barangay 3 (Poblacion)"
      } else if (displayNameLower.includes("barangay 4") || displayNameLower.includes("barangay iv")) {
        matchedBarangay = "Barangay 4 (Poblacion)"
      } else if (displayNameLower.includes("barangay 5") || displayNameLower.includes("barangay v")) {
        matchedBarangay = "Barangay 5 (Poblacion)"
      }
    }
  }

  const detailsParts = []

  if (addr.amenity) {
detailsParts.push(addr.amenity)
}

  if (addr.building) {
detailsParts.push(addr.building)
}

  if (addr.shop) {
detailsParts.push(addr.shop)
}

  if (addr.road) {
detailsParts.push(addr.road)
}

  if (addr.neighbourhood && addr.neighbourhood !== (matchedBarangay ? matchedBarangay.split(" (")[0] : "")) {
    detailsParts.push(addr.neighbourhood)
  }

  return {
    barangay: matchedBarangay,
    sitio: detailsParts.length > 0 ? detailsParts.join(", ") : "",
  }
}
