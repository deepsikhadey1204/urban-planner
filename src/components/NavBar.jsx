import "../styles/NavBar.css";

export default function NavBar() {
    return (
        <nav className="navbar">
            <div className="navbar-brand">
       
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
                <button className="planner-button">+ Select Area on map</button>
            </div>
        </nav>
    );
}
