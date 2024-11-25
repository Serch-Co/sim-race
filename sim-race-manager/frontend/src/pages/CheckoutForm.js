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
    const [clientSecretIntent, setClientSecretIntent] = useState('')
    const [clientSecretPayment, setClientSecretPayment] = useState('')
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

        const setUpPaymentIntent = () => {
            try {
                fetch('http://127.0.0.1:5000/setUpPaymentIntent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.clientSecret) {
                        setClientSecretIntent(data.clientSecret); // Store clientSecretIntent for later use
                    } else {
                        console.error("Failed to retrieve client secret intent");
                    }
                })
                .catch(error => console.error('Error:', error));
            } catch (error) {
                console.error('Error:', error)
            }
        }
        const createPaymentIntent = async() => {
            try{
                const response = await fetch('http://127.0.0.1:5000/createPaymentIntent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        races: data['races']
                    })
                })
                const newData = await response.json()
                if(newData.clientSecret){
                    setClientSecretPayment(newData.clientSecret)
                }
            } catch (error) {
                console.error('Error:', error)
            }
        }

        setUpPaymentIntent()
        createPaymentIntent()
    }, [data]);

    async function handleSetupIntent() {
        if (!clientSecretIntent) {
            console.error("No client secret available");
            return false
        }
        const cardElement = elements?.getElement(CardElement)

        if(!cardElement){
            console.error('CardElement is not mounted or elements is null in setup intent.')
            return
        }
        
        try {
    
            const { error, setupIntent } = await stripe.confirmCardSetup(clientSecretIntent, {
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
                        customer_id: data['customer']['id'],
                        payment_method_id: setupIntent['payment_method'],
                        nick_name: cardDetails.nickName,
                        current: true,
                        races: data['races']
                    }),
                })
                .then((response) => {
                    if (!response.ok) {
                        return false; // Unsuccessful response
                    }
                    return true
                })
                .catch((error) => {
                    console.error("Error creating payment method:", error);
                    return false; // Error occurred
                });
            }
        }catch(error){
            console.log(error)
        }
    }

    async function handlePaymentIntent() {
        if (!clientSecretPayment) {
            console.error("No client secret available");
            return false
        }
        // console.log('payment intent card details', cardDetails)

        const cardElement = elements?.getElement(CardElement)

        if(!cardElement){
            console.error('card element not found in payment')
            return
        }
        console.log(cardElement)

        const { result } = await stripe.confirmCardPayment(clientSecretPayment, {
            payment_method: {
                card: cardElement,
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
        console.log(result)
        if (result.error) {
            console.error(result.error);
        } else {
            /**Call backend to create a Payment */
            fetch("http://127.0.0.1:5000/createPayment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    customer_id: data['customer']['id'],
                    payment_method_id: '',
                    nick_name: cardDetails.nickName,
                    current: true,
                    races: data['races']
                }),
            })
            .then((response) => {
                if (!response.ok) {
                    return false; // Unsuccessful response
                }
                return true
            })
            .catch((error) => {
                console.error("Error creating payment method:", error);
                return false; // Error occurred
            });
        }
    }

    const handleSubmit = async (event) => {
        // console.log(cardDetails)

        event.preventDefault();
        const intentSuccess = handleSetupIntent()
        // const paymentSuccess = handlePaymentIntent()
        
        if (intentSuccess ){ //&& paymentSuccess){
            navigate('../ManageCustomers')
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
