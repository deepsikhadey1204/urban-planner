import './App.css'
import NavBar from './components/NavBar'
import { useState } from "react"
import MapLayout from './pages/MapLayout';

function App() {

  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [view, setView] = useState(null);
  const [inputAreaGeom, setInputAreaGeom] = useState(null);
  const [currentModule, setCurrentModule] = useState("map");
  return (
    <>
      <NavBar dropdownOptions={dropdownOptions} setSelectedState={setSelectedState} view={view} setInputAreaGeom={setInputAreaGeom} 
      setCurrentModule={setCurrentModule} currentModule={currentModule}/>
      {(() => {
        switch(currentModule){
          case "map":
            return <MapLayout setDropdownOptions={setDropdownOptions} selectedState={selectedState} setView={setView} inputAreaGeom={inputAreaGeom}/>
          case "dashboard":
            return
          case "scenarios":
            return
          case "analysis":
            return
        }
      }

      )()
      }
    </>
  )
}

export default App
