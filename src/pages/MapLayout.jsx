import MapPage from "../components/MapPage";

export default function MapLayout({ setDropdownOptions, selectedState, setView, inputAreaGeom, setSelectedAreaInfo, currentModule }){
    return(
        <MapPage setDropdownOptions={setDropdownOptions} selectedState={selectedState} setView={setView} inputAreaGeom={inputAreaGeom} setSelectedAreaInfo={setSelectedAreaInfo} currentModule={currentModule}/>
    )
}