import type maplibregl from "maplibre-gl"
import { useEffect } from "react"
import { useMap } from "@/components/ui/map"

// Helper component to listen to map click events using mapcn's context
export function MapClickObserver({ onClick }: { onClick: (coords: maplibregl.LngLat) => void }) {
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
