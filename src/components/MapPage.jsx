import { useRef, useEffect, useState } from "react"
import Map from "@arcgis/core/Map"
import MapView from "@arcgis/core/views/MapView"

export default function MapPage(){
    const mapRef = useRef(null)

    useEffect(() => {
        const map = new Map({
            basemap: "satellite"
        });

        const mapview = new MapView({
            map: map,
            container: mapRef.current,
            center: [78, 28],
            zoom: 4
        })
    }, [])

    return(
        <div id="mapDiv" ref={mapRef}></div>
    )
}