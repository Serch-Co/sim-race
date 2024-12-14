import { useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import "./styles/CustomerRaces.css"

function CustomerRaces(){

    const location = useLocation()
    const customer = location.state
    const navigate = useNavigate()

    const [totalPrice, setTotalPrice] = useState(0)
    const [availableRaces, setAvailableRaces] = useState([])
    const [loading, setLoading] = useState(true)
    const [reloadSign, setReloadSign] = useState(false)
    const [races, setRaces] = useState([])
    const [exitRacePrice, setExitRacePrice] = useState([])

    useEffect(() => {
        try {
            const url = "http://127.0.0.1:5000/readRaces";
            fetch(url, { method: "GET" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((racesData) => {
                setLoading(false)
                setAvailableRaces(racesData);
            })
            .catch((error) => {
                setReloadSign(true)
                console.error("Error fetching races:", error.message);
            });
        } catch (error) {
            setReloadSign(true)
            console.error("Error fetching races:", error.message);
        }
    }, [setReloadSign])

    const showPaymentMethods = () => {
        navigate('/ManagePayments', { state: customer})
    }

    const showCustomer = () => {
        navigate("../Customer", { state: customer['id'] })
    }

    const updateClicked = () => {
        let data = {
            customer: customer,
            totalAmount: totalPrice,
            races: races
        }
        navigate('../AddRaces', { state: data } )
    }

    const pauseClicked = () => {
        pauseSubscription()
    }

    const resumeClicked = () => {
        resumeSubscription()
    }

    // TODO CURRENTLY NOT IN USE
    /* pause Subscription and send to database */
    const pauseSubscription = async () => {
        /**Call backend pause gymrat */
        return fetch("http://127.0.0.1:5000/pauseSubscription", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({customer_id: customer['id']}),
        })
        .then((response) => {
            if (response.ok) {
                navigate('../Customer', { state: customer['id'] })
                return true; // Successful response
            } else {
                return false; // Failed response
            }
        })
        .catch((error) => {
            console.error("Error pausing Subscription:", error);
            return false; // Error occurred
        });
    }

    // TODO CURRENTLY NOT IN USE
    /* resume Subscription and send to database */
    const resumeSubscription = async () => {
        /**Call backend resume gymrat */
        return fetch("http://127.0.0.1:5000/resumeSubscription", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({customer_id: customer['id']}),
        })
        .then((response) => {
            if (response.ok) {
                navigate('../Customer', { state: customer['id'] })
                return true; // Successful response
            } else {
                return false; // Failed response
            }
        })
        .catch((error) => {
            console.error("Error resuming Subscription:", error);
            return false; // Error occurred
        });
    }

    function readCurrentRaces(raceID){
        if(customer['races'].length === 0){
            return 0
        }
        for(let i = 0; i < customer['races'].length; i++){
            if(customer['races'][i]['id'] === raceID){
                return customer['races'][i]['quantity']
            }
        }
        return 0
    }

    const updateRaces = (e, race, index) => {
        let quantity = Number(e.target.value)
        setRaces((prevRaces) => {
            const existingRace = prevRaces.find((item) => item.id === race.id);
            if (existingRace) {
                // Update the quantity
                let racePrice = quantity * race.price
                exitRacePrice[index] = racePrice
                updateTotalPrice()
                return prevRaces
                .map((item) =>
                    item.id === race.id
                    ? { ...item, quantity: quantity }
                    : item
                )
                .filter((item) => item.quantity > 0); // Remove items with quantity 0
            } else {
                // Add new item if quantity > 0
                let racePrice = quantity * race.price
                exitRacePrice[index] = racePrice
                updateTotalPrice()
                return quantity > 0 ? [...prevRaces, { ...race, quantity }] : prevRaces;
            }
        })
    }

    function updateTotalPrice(){
        let total = 0
        for(let i = 0; i < exitRacePrice.length; i++){
            if(exitRacePrice[i]){
                total += exitRacePrice[i]
            }
        }
        setTotalPrice(total)
    }

    if(reloadSign){
        return (
            <div>Reload page to try again</div>
        )
    }

    if(loading){
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div className="user-view">
            <div className="main-container">
                <div className="user-suscription">
                    <h3>
                        {customer.first_name} {customer.last_name}
                    </h3>
                    <div className="user-options">
                        <button className="primary-btn" onClick={showCustomer} >
                            Edit Customer
                        </button>
                        <button className="primary-btn" onClick={showPaymentMethods} >
                            Payment Methods
                        </button>
                        {totalPrice > 0 ?
                            <button className="primary-btn" onClick={updateClicked} >
                                Update Races
                            </button> : 
                            <button className="primary-btn">
                            Update Races
                            </button>
                        }
                    </div>
                    <div className="box-title">Suscription Status: {customer.subscription.status}</div>
                    <div className="box">
                        <table>
                            <thead className="race-thead">
                                <tr>
                                    <th>Name</th>
                                    <th>Price each</th>
                                    <th>To Add</th>
                                    <th>Current</th>
                                    <th>Exit Price</th>
                                </tr>
                            </thead>

                            <tbody>
                                {availableRaces.map((race, index) => (
                                <tr
                                    key={race.id}
                                    >
                                        {race.active ?
                                        <>
                                            <td>{race.name}</td>
                                            <td>{race.price}</td>
                                            <td>
                                                <input
                                                    className="input-num-field"
                                                    type="number"
                                                    aria-label="quantity"
                                                    onChange={(e) => updateRaces(e, race, index)} />
                                            </td>
                                            <td>{readCurrentRaces(race.id)}</td>
                                            <td>{exitRacePrice[index] ? exitRacePrice[index] : 0}</td>
                                        </>
                                        : <>
                                            <td>{race.name}</td>
                                            <td>N/A</td>
                                            <td>N/A</td>
                                            <td>{readCurrentRaces(race.id)}</td>
                                            <td>N/A</td>
                                        </>}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="total-price-info-box">
                        Total Price: {totalPrice}
                    </div>
                    <div>
                        {customer.subscription.status === 'Active' ? 
                        <button className="primary-btn" onClick={pauseClicked} >
                            Pause Subscription
                        </button> : 
                        <button className="primary-btn" onClick={resumeClicked} >
                            Resume Subscription
                        </button>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default <CustomerRaces/>
