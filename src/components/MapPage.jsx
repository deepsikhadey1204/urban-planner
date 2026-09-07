import { useRef, useEffect, useState } from "react";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import Home from "@arcgis/core/widgets/Home.js";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";

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

        //add home widget
        const homeWidget = new Home({
            view: mapView
        });

        mapView.ui.add(homeWidget, "top-left");

        //add state boundary layer
        const geojsonLyr = new GeoJSONLayer({
            url: "../../data/state.geojson"
        });

        //add a renderer to the geojson layer
        let statesRenderer = {
            type: "simple",
            symbol: {
                type: "simple-fill",
                color: [0, 0, 0, 0],
                style: "solid",
                outline: {
                    color: "black",
                    width: 2
                }
            }
        }

        geojsonLyr.renderer = statesRenderer;
        mapView.map.add(geojsonLyr);

        let stateQuery = geojsonLyr.createQuery();
        stateQuery.where = "1=1";
        stateQuery.outFields = ["*"];
        stateQuery.returnGeometry = false;
        stateQuery.returnDistinctValues = true;

        geojsonLyr.queryFeatures(stateQuery).then((response) => console.log("Resp", response));

    }, [mapView]);

    return(
        <div id="mapDiv" ref={mapRef}></div>
    )
}