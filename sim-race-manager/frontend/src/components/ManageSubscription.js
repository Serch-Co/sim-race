import Select from "react-select"
import { useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"




function ManageSubscription(){

    const [subscription, setSubscription] = useState([])

    const defaultFormValues = {
        price: subscription ? subscription.price : "",
    };

    
    const [formValues, setFormValues] = useState({ ...defaultFormValues });
    const location = useLocation()
    const navigate = useNavigate()

    


    useEffect(() => {
        fetchSubscription()
    }, [])

    const fetchSubscription = () => {
        try {
            const url = "http://127.0.0.1:5000/readSubscriptionOffered"
            fetch(url, { method: "GET" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok")
                }
                return response.json()
            })
            .then((subscriptionData) => {
                setSubscription(subscriptionData)
            })
            .catch((error) => {
                console.error("Error fetching subscription:", error.message)
            })
        } catch (error) {
            console.error("Error fetching subscription:", error.message)
        }
    }

    const handleInputChange = (property) => {
        formValues[property.target.ariaLabel] = property.target.value
    };

    const updateClicked = () => {
        updateSubscription()
    }


    /* Update Subscription and send to database */
    const updateSubscription = async () => {
        console.log(formValues)

        /**Call backend update gymrat */
        return fetch("http://127.0.0.1:5000/updateSubscriptionOffered", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
        })
        .then((response) => {
            if (response.ok) {
                navigate('../Home')
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



    if (!subscription){
        console.log(subscription)
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div className="user-view">
            <div className="main-container">
                <div className="user-suscription">
                    {subscription.length == 0 ? 
                        <h3>
                            Assign Subscription Price
                        </h3>:
                        <h3>
                            Subscription
                        </h3>
                    }
                    <div className="user-options">
                        <button className="primary-btn" onClick={updateClicked} >
                            Update Subscription
                        </button>
                    </div>
                    <div className="box">

                        <div className="info-box">
                            Total Price:
                            {subscription.length == 0 ? 
                                <input 
                                    type="number"
                                    className="input-field"
                                    aria-label="price"
                                    placeholder="Price"
                                    onChange={handleInputChange}
                                /> :
                                <input 
                                    type="number"
                                    className="input-field"
                                    aria-label="price"
                                    placeholder={subscription['price']}
                                    onChange={handleInputChange}
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default <ManageSubscription/>




















