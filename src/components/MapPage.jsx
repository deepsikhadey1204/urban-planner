import { useRef, useEffect, useState } from "react";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import Home from "@arcgis/core/widgets/Home.js";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";

export default function MapPage({ setDropdownOptions, selectedState }){
    const mapRef = useRef(null);
    const [mapView, setMapView] = useState(null);
    const [stateLyr, setStateLyr] = useState(null);

    //load map
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

    //add widgets and state layer - other layers needs to be added too
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
                color: [255, 255, 0, 0.4],
                style: "solid",
                outline: {
                    color: "yellow",
                    width: 2
                }
            }
        }

        geojsonLyr.renderer = statesRenderer;
        mapView.map.add(geojsonLyr);
        setStateLyr(geojsonLyr);

        let stateQuery = geojsonLyr.createQuery();
        stateQuery.where = "1=1";
        stateQuery.outFields = ["*"];
        stateQuery.returnGeometry = true;
        stateQuery.returnDistinctValues = true;

        let states = [];

        geojsonLyr.queryFeatures(stateQuery).then((response) => {
            if(response.features.length === 0) return;
            response.features.forEach((feature) => {
                let resp = {};
                resp['label'] = feature.attributes.ST_NM;
                resp['value'] = feature.geometry;
                states.push(resp);
            });
           // console.log("States Arr", states);
            setDropdownOptions(states);
        });


    }, [mapView]);

    //zoom to the layer on dropdown selection
    useEffect(() => {
        if(!selectedState) return

        stateLyr.definitionExpression = `ST_NM = '${selectedState.label}'`

        const extent = selectedState.value.extent;
        mapView.goTo(extent.expand(1.2));

    }, [selectedState])

    return(
        <div id="mapDiv" ref={mapRef}></div>
    )
}