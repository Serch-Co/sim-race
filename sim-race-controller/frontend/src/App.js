import useLocalStorage from "use-local-storage"
import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Header from "./components/Header"
import AddSimulator from "./components/ManageSimulators/AddSimulator"
import ManageSimulators from "./components/ManageSimulators/ManageSimulators"
import Home from './pages/Home'
import Settings from "./pages/Settings"
import CreateRace from "./pages/CreateRace"
import Simulator from "./pages/Simulator"
import PageNotFound from "./pages/PageNotFound"

function App() {
	const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches
	const [theme] = useLocalStorage("theme", defaultDark ? "dark" : "light")

	useEffect(() => {
        document.title = process.env.REACT_APP_NAME
    }, []);

  	return (
		<div className="page" data-theme={theme}>
			<BrowserRouter>
				<Header />
				<Routes>
					<Route path="/" element={Home} />
					<Route path="/AddSimulator" element={AddSimulator} />
					<Route path="/ManageSimulators" element={ManageSimulators} />
					<Route path="/Home" element={Home} />
					<Route path="/Settings" element={Settings} />
					<Route path="/CreateRace" element={CreateRace} />
					<Route path="/Simulator" element={Simulator} />
					<Route path="/*" element={PageNotFound} />
				</Routes>
        	</BrowserRouter>
		</div>
  	);
}

export default App;
