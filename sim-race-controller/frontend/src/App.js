import useLocalStorage from "use-local-storage"
import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import Header from "./components/Header"
import Home from './pages/Home'
import Settings from "./pages/Settings"
import CreateRace from "./pages/CreateRace"
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
					<Route path="/Home" element={Home} />
					<Route path="/Settings" element={Settings} />
					<Route path="/CreateRace" element={CreateRace} />
					<Route path="/*" element={PageNotFound} />
				</Routes>
        	</BrowserRouter>
		</div>
  	);
}

export default App;
