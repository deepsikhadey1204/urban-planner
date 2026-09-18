import { useRef, useEffect, useState } from "react";
import Map from "@arcgis/core/Map.js";
import MapView from "@arcgis/core/views/MapView.js";
import Home from "@arcgis/core/widgets/Home.js";
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer.js";
import populationData from "../../data/population.json";

export default function MapPage({ setDropdownOptions, selectedState, setView, inputAreaGeom }){
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
        setView(view);
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
            url: "../../data/state.geojson",
            title: "Districts"
        });

        const subdistrictLyr = new GeoJSONLayer({
            url: "../../data/subdistricts.geojson",
            title: "SubDistricts"
        })

        //add hospitals layer
        const hospitalGeoJson = new GeoJSONLayer({
            url: "../../data/hospitals.geojson",
            title: "Hospitals"
        })

        //add roads layer
        const roadsGeoJson = new GeoJSONLayer({
            url: "../../data/roads.geojson",
            title: "Roads"
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

        // fetch("http://127.0.0.1:8000").then((resp) => {
        //     console.log(resp);
        // })


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

    }, [selectedState]);

   useEffect(() => {

    if (!inputAreaGeom) return;

    const getAreaData = async () => {

        // Hospital query
        const hospitalQuery = hospitalLyr.createQuery();
        hospitalQuery.geometry = inputAreaGeom;
        hospitalQuery.spatialRelationship = "intersects";
        hospitalQuery.returnGeometry = true;
        hospitalQuery.outFields = ["*"];


        // Road query
        const roadsQuery = roadsLyr.createQuery();
        roadsQuery.geometry = inputAreaGeom;
        roadsQuery.spatialRelationship = "intersects";
        roadsQuery.returnGeometry = true;
        roadsQuery.outFields = ["*"];


        // Subdistrict query
        const subdistrictQuery = subDistrictLyr.createQuery();
        subdistrictQuery.geometry = inputAreaGeom;
        subdistrictQuery.spatialRelationship = "intersects";
        subdistrictQuery.returnGeometry = true;
        subdistrictQuery.outFields = ["*"];


        const [hospitalResponse, roadResponse, subdistrictResponse] = await Promise.all([
            hospitalLyr.queryFeatures(hospitalQuery),
            roadsLyr.queryFeatures(roadsQuery),
            subDistrictLyr.queryFeatures(subdistrictQuery)
        ]);

        const selectedAreaData = {
            hospitals: hospitalResponse.features,
            roads: roadResponse.features,
            subdistricts: subdistrictResponse.features

        };
        
        const analysisData = {
            hospitalCount: selectedAreaData.hospitals.length,

            roadCount: selectedAreaData.roads.length,

            subdistrictCount: selectedAreaData.subdistricts.length,

            subdistricts: selectedAreaData.subdistricts.map((feature) => ({
                name: feature.attributes.ds_name,
                population: feature.attributes.total_popu,
                households: feature.attributes.total_hous,
                forestArea: feature.attributes.forest_are,
                agriculturalArea: feature.attributes.net_area_s,
                irrigatedArea: feature.attributes.area_irrig,
                barrenArea: feature.attributes.barren_un_
            }))
        };

        console.log("Analysis Data:", analysisData);
    };

    getAreaData();

}, [inputAreaGeom]);

    return(
        <div id="mapDiv" ref={mapRef}></div>
    )
}