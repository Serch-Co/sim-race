import useLocalStorage from "use-local-storage"
import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"

import Header from './components/Header'
import ManageSubscription from "./components/ManageSubscription"
import AddRaces from "./components/ManageCustomers/AddRaces"
import CreateCustomer from "./components/ManageCustomers/CreateCustomer"
import ManageCustomers from "./components/ManageCustomers/ManageCustomers"
import CustomerRaces from "./components/ManageCustomers/CustomerRaces"
import CreateRace from "./components/ManageRaces/CreateRace"
import ManageRaces from "./components/ManageRaces/ManageRaces"
import CreatePayment from "./components/ManagePayments/CreatePayment"
import ManagePayments from "./components/ManagePayments/ManagePayments"
import Home from './pages/Home'
import Settings from "./pages/Settings"
import Customer from "./pages/Customer"
import Race from "./pages/Race"
import CheckoutForm from "./pages/CheckoutForm"
import PageNotFound from "./pages/PageNotFound"

const stripe_key = process.env.REACT_APP_STRIPE_API_KEY
const stripePromise = loadStripe(stripe_key)

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
					<Route path="/ManageSubscription" element={ManageSubscription} />
					<Route path="/AddRaces" element={AddRaces} />
					<Route path="/CreateCustomer" element={CreateCustomer} />
					<Route path="/ManageCustomers" element={ManageCustomers} />
					<Route path="/CustomerRaces" element={CustomerRaces} />
					<Route path="/CreateRace" element={CreateRace} />
					<Route path="/ManageRaces" element={ManageRaces} />
					<Route path="/CreatePayment" element={
						<Elements stripe={stripePromise}>
							<CreatePayment />
						</Elements>
					} />
					<Route path="/ManagePayments" element={ManagePayments} />
					<Route path="/Home" element={Home} />
					<Route path="/Settings" element={Settings} />
					<Route path="/Customer" element={Customer} />
					<Route path="/Race" element={Race} />
					<Route path="/CheckoutForm" element={
						<Elements stripe={stripePromise}>
							<CheckoutForm />
						</Elements>
					} />
					<Route path="/*" element={PageNotFound} />
				</Routes>
        	</BrowserRouter>
		</div>
	);
}

export default App;
