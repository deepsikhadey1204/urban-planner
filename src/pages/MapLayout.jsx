import MapPage from "../components/MapPage";

export default function MapLayout({ setDropdownOptions, selectedState, setView, inputAreaGeom }){
    return(
        <MapPage setDropdownOptions={setDropdownOptions} selectedState={selectedState} setView={setView} inputAreaGeom={inputAreaGeom}/>
    )
}