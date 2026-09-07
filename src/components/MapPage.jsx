import { useRef, useEffect, useState } from "react";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import Home from "@arcgis/core/widgets/Home.js";

export default function MapPage(){
    const mapRef = useRef(null);
    const [mapView, setMapView] = useState(null);

    useEffect(() => {
        const map = new Map({
            basemap: "satellite"
        });

        const view = new MapView({
            map: map,
            container: mapRef.current,
            center: [78, 28],
            zoom: 4
        });

        setMapView(view);
    }, []);

    useEffect(() => {

        if(!mapView) return;

        const homeWidget = new Home({
            view: mapView
        });

        mapView.ui.add(homeWidget, "top-left");

    }, [mapView]);

    return(
        <div id="mapDiv" ref={mapRef}></div>
    )
}