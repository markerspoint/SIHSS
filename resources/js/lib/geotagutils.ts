export const SipalayBarangays = [
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

export interface ResolvedAddress {
  barangay: string
  sitio: string
}

export async function fetchAddressFromCoords(lat: number, lng: number): Promise<ResolvedAddress> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`
  )

  if (!res.ok) {
    throw new Error(`Reverse geocoding request failed: ${res.statusText}`)
  }

  const data = await res.json()

  let barangay = ""
  let sitio = ""

  if (data && data.address) {
    const addr = data.address

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
      .map((val) => val.toLowerCase())

    const displayNameLower = (data.display_name || "").toLowerCase()

    for (const brgy of SipalayBarangays) {
      const baseName = brgy.split(" (")[0].toLowerCase()
      const matchesField = searchFields.some((f) => f.includes(baseName) || baseName.includes(f))
      const matchesDisplay = displayNameLower.includes(baseName)

      if (matchesField || matchesDisplay) {
        barangay = brgy
        break
      }
    }

    if (!barangay) {
      if (displayNameLower.includes("poblacion")) {
        if (displayNameLower.includes("barangay 1") || displayNameLower.includes("barangay i")) {
          barangay = "Barangay 1 (Poblacion)"
        } else if (displayNameLower.includes("barangay 2") || displayNameLower.includes("barangay ii")) {
          barangay = "Barangay 2 (Poblacion)"
        } else if (displayNameLower.includes("barangay 3") || displayNameLower.includes("barangay iii")) {
          barangay = "Barangay 3 (Poblacion)"
        } else if (displayNameLower.includes("barangay 4") || displayNameLower.includes("barangay iv")) {
          barangay = "Barangay 4 (Poblacion)"
        } else if (displayNameLower.includes("barangay 5") || displayNameLower.includes("barangay v")) {
          barangay = "Barangay 5 (Poblacion)"
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

    if (addr.neighbourhood && addr.neighbourhood !== (barangay ? barangay.split(" (")[0] : "")) {
      detailsParts.push(addr.neighbourhood)
    }

    if (detailsParts.length > 0) {
      sitio = detailsParts.join(", ")
    }
  }

  return { barangay, sitio }
}
