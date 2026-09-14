import Dropdown from "../common/Dropdown";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel.js";
import "../styles/NavBar.css";
import { useEffect, useState } from "react";
import { useRef } from "react";

export default function NavBar({ dropdownOptions, setSelectedState, view, setInputAreaGeom }) { 

    const [sketchVM, setSketchVM] = useState(null);
    const [selectedOptn, setSelectedOptn] = useState(true);
    const graphicsLayerRef = useRef(null);

    
    useEffect(() => {
        if(!view) return;
        let graphicsLayer = new GraphicsLayer();
        graphicsLayerRef.current = graphicsLayer;

        const polygonSymbol = {
        type: "simple-fill",
        color: [242, 188, 148, 0],
        outline: {
            color: [114, 38, 32, 0.7],
            width: 3,
        },
        };

        view.map.add(graphicsLayer);

        const sketchViewModel = new SketchViewModel({
        view: view,
        layer: graphicsLayer,
        polygonSymbol: polygonSymbol,
        });
        setSketchVM(sketchViewModel);

        sketchViewModel.on("create", (evt) => {
            if(evt.state == "complete"){
                console.log(evt.graphic.geometry);
                setInputAreaGeom(evt.graphic.geometry);
            }
        })

    }, [view])

    const handleSelectArea = () => {
        graphicsLayerRef.current.removeAll();
        if(!sketchVM) return;

        sketchVM.create("polygon");
        
    }

    return (
        <nav className="navbar">
            <div className="navbar-brand">
        {/* change icon later to a proper one */}
         <div className="brand-icon">⌂</div> 
                <div>
                    <h2>City Planner</h2>
                    <span>Urban Intelligence</span>
                </div>
            </div>

            <div className="navbar-links">
                <a href="#dashboard">Dashboard</a>
                <a href="#map" className="active">City Map</a>
                <a href="#analysis">Analysis</a>
                <a href="#scenarios">Scenarios</a>
            </div>

            <div className="navbar-actions">
                <Dropdown options={dropdownOptions} placeholder="Select a district" onSelect={(selected) => {
                                                                                                setSelectedState(selected); 
                                                                                                setSelectedOptn(false);
                                                                                                graphicsLayerRef.current.removeAll();
                                                                                            }}/>
                <calcite-button disabled={selectedOptn} icon-start="area-hash-filled-plus" title="Select an area on map" kind="neutral" onClick={handleSelectArea}/>
            </div>
        </nav>
    );
}
