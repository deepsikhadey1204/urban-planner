import './App.css'
import NavBar from './components/NavBar'
import { useState } from "react"
import MapLayout from './pages/MapLayout';

function App() {

  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [view, setView] = useState(null);
  const [inputAreaGeom, setInputAreaGeom] = useState(null);
  return (
    <>
      <NavBar dropdownOptions={dropdownOptions} setSelectedState={setSelectedState} view={view} setInputAreaGeom={setInputAreaGeom}/>
      <MapLayout setDropdownOptions={setDropdownOptions} selectedState={selectedState} setView={setView} inputAreaGeom={inputAreaGeom}/>
    </>
  )
}

export default App
