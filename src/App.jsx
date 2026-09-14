import './App.css'
import NavBar from './components/NavBar'
import { useState } from "react"
import MapLayout from './pages/MapLayout';

function App() {

  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  return (
    <>
      <NavBar dropdownOptions={dropdownOptions} setSelectedState={setSelectedState}/>
      <MapLayout setDropdownOptions={setDropdownOptions} selectedState={selectedState}/>
    </>
  )
}

export default App
