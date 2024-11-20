import useLocalStorage from "use-local-storage"
import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from './components/Header'
import Home from './pages/Home'
import Settings from "./pages/Settings"
import CreateCustomer from "./components/ManageCustomers/CreateCustomer"
import ManageCustomers from "./components/ManageCustomers/ManageCustomers"
import CreateRace from "./components/ManageRaces/CreateRace"
import ManageRaces from "./components/ManageRaces/ManageRaces";
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
					<Route path="/Home" element={Home} />
					<Route path="/Settings" element={Settings} />
					<Route path="/CreateCustomer" element={CreateCustomer} />
					<Route path="/ManageCustomers" element={ManageCustomers} />
					<Route path="/CreateRace" element={CreateRace} />
					<Route path="/ManageRaces" element={ManageRaces} />
					<Route path="/*" element={PageNotFound} />
				</Routes>
        	</BrowserRouter>
		</div>
	);
}

export default App;
