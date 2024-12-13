/**
 * Takes in a races to add to confirm payment
 */

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { dollarToCent } from '../../utils/Helpers'

function AddRaces() {
  	const navigate = useNavigate();
	const location = useLocation();
	const data = location.state

	/* Update Subscription and send to database */
    const makePayment = async () => {
        const formData = {
            customer_id: data.customer['id'],
			amount: dollarToCent(data.totalAmount),
			currency: 'usd',
            customer: data.customer,
            races: data.races
        }

        /**Call backend update gymrat */
        return fetch("http://127.0.0.1:5000/addRacesPayment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        })
        .then((response) => {
            if (response.ok) {
                navigate('../Customer', { state: data.customer['id']})
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

	/**Customer has selected to cancel add races */
	const cancelAddRacesClicked = () => {
		navigate('../CustomerRaces', { state: data.customer })
	};

	return (
		<div className="user-view">
			<div className="main-container">
				Amount to Pay: {data.totalAmount}
				<div>
				<button onClick={makePayment} className="secondary-btn">
					Confirm
				</button>
				<button onClick={cancelAddRacesClicked} className="secondary-btn">
					Cancel
				</button>
				</div>
			</div>
		</div>
	)
}

export default <AddRaces />;
