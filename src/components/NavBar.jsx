import Dropdown from "../common/Dropdown";
import "../styles/NavBar.css";

export default function NavBar({ dropdownOptions, setSelectedState }) {
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
                <Dropdown options={dropdownOptions} placeholder="Select a state" onSelect={(selected) => setSelectedState(selected)}/>
                <calcite-button icon-start="area-hash-filled-plus" title="Select an area on map" kind="neutral"/>
            </div>
        </nav>
    );
}
