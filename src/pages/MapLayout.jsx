import MapPage from "../components/MapPage";

export default function MapLayout({ setDropdownOptions, selectedState }){
    return(
        <MapPage setDropdownOptions={setDropdownOptions} selectedState={selectedState}/>
    )
}