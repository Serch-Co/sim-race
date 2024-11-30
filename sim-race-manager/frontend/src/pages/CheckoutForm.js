import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate, useLocation } from "react-router-dom";
import { centToDollar } from "../utils/Helpers.js"

const CheckoutForm = () => {
	const navigate = useNavigate()
    const location = useLocation();
    const data = location.state
    const stripe = useStripe();
    const elements = useElements();
    const [totalPrice, setTotalPrice] = useState(0)
    const [clientSecret, setClientSecret] = useState('')
    const [cardDetails, setCardDetails] = useState({
        nickName: '',
        name: '',
        address: '',
        city: '',
        state: '',
        postal_code: ''
    });

    useEffect(() => {
        setTotalPrice(data['totalPrice'])

        fetch('http://127.0.0.1:5000/setUpPaymentIntent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(data => {
            if (data.clientSecret) {
                setClientSecret(data.clientSecret)
            } else {
                console.error("Failed to retrieve client secret intent")
            }
        })
        .catch(error => console.error('Error:', error));

    }, [data]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!clientSecret) {
            console.error("No client secret available");
            return;
        }
    
        const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: cardDetails.name,
                    address: {
                        line1: cardDetails.address,
                        city: cardDetails.city,
                        state: cardDetails.state,
                        postal_code: cardDetails.postal_code
                    }
                },
            }
        });
    
        if (error) {
            console.log(error);
        } else {
            /**Call backend to create a subscription */
            fetch("http://127.0.0.1:5000/createSubscription", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    payment_method_id: setupIntent['payment_method'],
                    amount: totalPrice,
                    nick_name: cardDetails.nickName,
                    current: true,
                    customer_id: data['customer']['id']
                }),
            })
            .then((response) => {
                if (!response.ok) {
                    return false; // Unsuccessful response
                }
                alert('Continue to customer races to add races to Customer')
                navigate('../Customer', { state: data['customer']['id'] })
                return true
            })
            .catch((error) => {
                console.error("Error creating payment method:", error);
                return false; // Error occurred
            });
        }
    };

    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setCardDetails((prevDetails) => ({ ...prevDetails, [name]: value}))
    }

    if(!stripe || !elements || !CardElement){
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div className='user-view'>
            <div className="main-container">
                <div>Card Details</div>
                <form onSubmit={handleSubmit}>
                    <input className='input-field' type="text" name="name" placeholder="Name" onChange={handleChange} required />
                    <input className='input-field' type="text" name="nickName" placeholder="Nickname" onChange={handleChange} required />
                    <input className='input-field' type="text" name="address" placeholder="Address" onChange={handleChange} required />
                    <input className='input-field' type="text" name="city" placeholder="City" onChange={handleChange} required />
                    <input className='input-field' type="text" name="state" placeholder="State" onChange={handleChange} required />
                    <input className='input-field' type="text" name="postal_code" placeholder="Postal Code" onChange={handleChange} required />
                    <CardElement className='input-field'/>
                    <button type="submit">
                        Pay
                    </button>
                </form>
                <div className="info-box">
                    Total Price: {centToDollar(totalPrice)}
                </div>
            </div>
        </div>
        
    );
};

export default CheckoutForm;
