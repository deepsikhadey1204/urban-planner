import { useRef, useEffect, useState } from "react";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import Home from "@arcgis/core/widgets/Home.js";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";

export default function MapPage({ setDropdownOptions, selectedState }){
    const mapRef = useRef(null);
    const [mapView, setMapView] = useState(null);
    const [stateLyr, setStateLyr] = useState(null);
    const [hospitalLyr, setHospitalLyr] = useState(null);
    const [roadsLyr, setRoadsLyr] = useState(null);
    const [subDistrictLyr, setSubDistrictlyr] = useState(null);

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
    //TODO - move folder to server folder and fetch data from api
    useEffect(() => {

        if(!mapView) return;

        //add home widget
        const homeWidget = new Home({
            view: mapView
        });

        mapView.ui.add(homeWidget, "top-left");

        //add district boundary layer
        const geojsonLyr = new GeoJSONLayer({
            url: "../../data/state.geojson"
        });

        const subdistrictLyr = new GeoJSONLayer({
            url: "../../data/subdistricts.geojson"
        })

        //add hospitals layer
        const hospitalGeoJson = new GeoJSONLayer({
            url: "../../data/hospitals.geojson"
        })

        //add roads layer
        const roadsGeoJson = new GeoJSONLayer({
            url: "../../data/roads.geojson"
        });

        //add a renderer to roads
        let roadsRenderer = {
            type: "simple",
            symbol: {
                type: "simple-line",
                color: "red"
            }
        }

        //add a renderer to the district layer
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

        //add a renderer to subdistrict layer
        let subdistrictRenderer = {
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

        //hospitals renderer
        let hospitalRenderer = {
            type: "simple",
            symbol: {
                type: "simple-marker",
                color: "yellow",
                style: "solid",
                size: 5,
                outline: {
                    color: "red",
                    width: 1
                }
            }
        }

        geojsonLyr.renderer = statesRenderer;
        hospitalGeoJson.renderer = hospitalRenderer;
        roadsGeoJson.renderer = roadsRenderer;
        subdistrictLyr.renderer = subdistrictRenderer;
        subdistrictLyr.visible = false;

        mapView.map.add(geojsonLyr);
        mapView.map.add(hospitalGeoJson);
        mapView.map.add(roadsGeoJson);
        mapView.map.add(subdistrictLyr);

        setStateLyr(geojsonLyr);
        setHospitalLyr(hospitalGeoJson);
        setRoadsLyr(roadsGeoJson);
        setSubDistrictlyr(subdistrictLyr);

        let hospitalQuery = hospitalGeoJson.createQuery();
        hospitalQuery.where = "1=1";
        hospitalQuery.outFields = ["*"];
        hospitalQuery.returnGeometry = false;
        hospitalQuery.returnDistinctValues = true;

        hospitalGeoJson.queryFeatures(hospitalQuery).then((hospitals) => {
            console.log(hospitals.features);
        })

        geojsonLyr.definitionExpression = `ST_NM = 'Maharashtra'`;
        geojsonLyr.definitionExpression = "ST_NM = 'Maharashtra'";
        geojsonLyr.when(() => {
            geojsonLyr.queryExtent({
                where: "ST_NM = 'Maharashtra'",
                returnGeometry: true,
                outFields: ["ST_NM"]
            }).then((response) => {
                if (!response.extent) return;
                mapView.goTo(response.extent);
            });
        });

        geojsonLyr.queryFeatures({
                where: "ST_NM = 'Maharashtra'",
                returnGeometry: true,
                outFields: ["ST_NM", "DISTRICT"]
            }).then((response) => {
                if (!response.features.length > 0) return;

                const districtOptions = response.features.map((feature) => ({
                    label: feature.attributes.DISTRICT,
                    value: feature.geometry
                }));

                setDropdownOptions(districtOptions);

            });

        fetch("http://127.0.0.1:8000").then((resp) => {
            console.log(resp);
        })


    }, [mapView]);

    //zoom to the layer on dropdown selection
    useEffect(() => {
        if(!selectedState) return

        subDistrictLyr.definitionExpression = `district = '${selectedState.label}'`

        const extent = selectedState.value.extent;

        subDistrictLyr.visible = true;
        stateLyr.visible = false;
        roadsLyr.visible = false;
        hospitalLyr.visible = false;
        mapView.goTo(extent.expand(1.2));

    }, [selectedState])

    return(
        <div id="mapDiv" ref={mapRef}></div>
    )
}