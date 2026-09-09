import './App.css'
import MapPage from './components/MapPage'
import NavBar from './components/NavBar'
import { useState } from "react"

function App() {

  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  return (
    <>
      <NavBar dropdownOptions={dropdownOptions} setSelectedState={setSelectedState}/>
      <MapPage setDropdownOptions={setDropdownOptions} selectedState={selectedState}/>
    </>
  )
}

export default App
