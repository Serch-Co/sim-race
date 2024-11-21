import Select from "react-select"
import { useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"




function CustomerRaces(){

    
    const location = useLocation()
    const customer = location.state
    const navigate = useNavigate()

    const [availableAddOns, setAddOns] = useState([])
    const [monthPrice, setMonthPrice] = useState(customer['monthPrice'])
    const [annualPrice, setAnnualPrice] = useState(customer['annualPrice'])
    const [totalPrice, setTotalPrice] = useState(0)
    const [prevAddOns, setPrevAddOns] = useState([])

    useEffect(() => {
        fetchAddOns()
        checkSuscription(false)
        // setPrevAddOns(customer['addOns'].slice())
    }, [])

    const fetchAddOns = () => {
        try {
            const url = "http://127.0.0.1:5000/getActiveAddOns"
            fetch(url, { method: "GET" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok")
                }
                return response.json()
            })
            .then((addOnsData) => {
                setAddOns(addOnsData)
            })
            .catch((error) => {
                console.error("Error fetching addOns:", error.message)
            })
        } catch (error) {
            console.error("Error fetching addOns:", error.message)
        }
    }

    function checkSuscription(priceChange, monthlyPrice=0, annuallyPrice=0){
        if(priceChange){
            if(customer['suscriptionType'] === "Monthly"){
                setTotalPrice(monthlyPrice)
            } else if (customer['suscriptionType'] === "Annual"){
                setTotalPrice(annuallyPrice)
            }
        }
        else{
            if(customer['suscriptionType'] === "Monthly"){
                setTotalPrice(monthPrice)
            } else if (customer['suscriptionType'] === "Annual"){
                setTotalPrice(annualPrice)
            }
        }
        
    }

    // Handle change in suscription
	const handleSuscriptionChange = (property) => {
		customer["suscriptionType"] = property.value
        checkSuscription(false)
		// setIsSaved(false)
	}

    function updatePrices(monthPrice, annualPrice){
        setMonthPrice(monthPrice)
        setAnnualPrice(annualPrice)
        
        customer['monthPrice'] = monthPrice
        customer['annualPrice'] = annualPrice

        checkSuscription(true, monthPrice, annualPrice)
    }

    // Handle adding or removing add on
	const handleToggleCompleted = (addOnId) => {
		for(let i = 0; i < availableAddOns.length; i++){
			if(availableAddOns[i]['id'] === addOnId){
				// AddOn not in list, so add it
				if(!isAddOn(addOnId)){
                    availableAddOns[i]['checked'] = true
					customer['addOns'].push(availableAddOns[i]['id'])
                    customer.monthPrice = customer.monthPrice + availableAddOns[i]['monthlyPrice']
                    customer.annualPrice = customer.annualPrice + availableAddOns[i]['annualPrice']
				}
				// addon exists, so remove addon
				else{
                    availableAddOns[i]['checked'] = false
					// find element to remove
					customer['addOns'] = customer['addOns'].filter(item => item !== addOnId)
                    customer.monthPrice = customer.monthPrice - availableAddOns[i]['monthlyPrice']
                    customer.annualPrice = customer.annualPrice - availableAddOns[i]['annualPrice']
				}
				i = availableAddOns.length
			}
		}
        updatePrices(customer.monthPrice, customer.annualPrice)
	}

    function isAddOn(addOnId){
		for (let i = 0; i < customer['addOns'].length; i++){
			if (customer['addOns'][i] === addOnId){
				return true
			}
		}
		return false
	}


    const showPaymentMethods = () => {
        navigate('/ManagePayments', { state: customer})
    }

    const showCustomer = () => {
        navigate("../Customer", { state: customer['id'] })
    }

    const updateClicked = () => {
        updateSubscription(customer)
    }

    const pauseClicked = () => {
        pauseSubscription()
    }

    const resumeClicked = () => {
        resumeSubscription()
    }

    function updateItems(newAddOns){
        let itemsToUpdate = []
        for(let i = 0; i < availableAddOns.length; i++){
            // Both list have addOnID
            if(addOnInList(availableAddOns[i]['id'],newAddOns) && addOnInList(availableAddOns[i]['id'],prevAddOns)){
                itemsToUpdate.push({
                    'id': availableAddOns[i]['id'],
                    'action': 'update'
                })
            }
            // Only New list has addOnID
            else if(addOnInList(availableAddOns[i]['id'], newAddOns)){
                itemsToUpdate.push({
                    'id': availableAddOns[i]['id'],
                    'action': 'add'
                })
            }
            // Only prev list has addOnID
            else if(addOnInList(availableAddOns[i]['id'], prevAddOns)){
                itemsToUpdate.push({
                    'id': availableAddOns[i]['id'],
                    'action': 'remove'
                })
            }
            else{
                continue
            }
        }
        return itemsToUpdate
    }

    function addOnInList(addOn, list){
        for(let i = 0; i < list.length; i++){
            if (list[i] === addOn){
                return true
            }
        }
        return false
    }

    /* Update Subscription and send to database */
    const updateSubscription = async () => {
        let itemsToUpdate = updateItems(customer['addOns'])
        const formData = {
            customer_id: customer['id'],
            updated_customer: customer,
            items_to_update: itemsToUpdate
        }

        /**Call backend update gymrat */
        return fetch("http://127.0.0.1:5000/updateSubscription", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        })
        .then((response) => {
            if (response.ok) {
                navigate('../Customer', { state: customer['id']})
                return true; // Successful response
            } else {
                return false; // Failed response
            }
        })
        .catch((error) => {
            console.error("Error updating Subscription:", error);
            return false; // Error occurred
        });
    }

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

    if (!availableAddOns){
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
                        <button className="primary-btn" onClick={updateClicked} >
                            Update Subscription
                        </button>
                    </div>
                    <div className="box-title">Suscription Status: {customer.subscription.status}</div>
                    <div className="box">
                        
                        
                        <div className="card">
                            <div className="card-header">Choose add-ons</div>

                            <div className="card-body">
                                {availableAddOns.map((item) => {
                                    return (
                                        <div key={item.id} className="checkbox-container">
                                            <input
                                                className="check-list"
                                                type="checkbox"
                                                id={item.id}
                                                name="addOns"
                                                checked={!!isAddOn(item.id) || !!item.checked}
                                                value={item.name}
                                                onChange={() => handleToggleCompleted(item.id)}
                                            />
                                            {item.name}
                                        </div>
                                        )
                                    }
                                )}
                            </div>
                        </div>
                        <div className="info-box">
                            Total Price:
                            <div>
                                {totalPrice}
                            </div>
                        </div>
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




















