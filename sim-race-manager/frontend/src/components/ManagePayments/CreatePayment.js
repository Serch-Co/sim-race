import React, { useState, useEffect } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useNavigate, useLocation } from "react-router-dom"

const CreatePayment = () => {
	const navigate = useNavigate()
    const location = useLocation()
    const data = location.state
    const stripe = useStripe()
    const elements = useElements()
    const [clientSecret, setClientSecret] = useState('')
    const [cardDetails, setCardDetails] = useState({
        nickName: '',
        name: '',
        address: '',
        city: '',
        state: '',
        postal_code: ''
    })

    useEffect(() => {
        fetch('http://127.0.0.1:5000/setUpPaymentIntent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(data => {
            if (data.clientSecret) {
                setClientSecret(data.clientSecret) // Store clientSecret for later use
            } else {
                console.error("Failed to retrieve client secret")
            }
        })
        .catch(error => console.error('Error:', error))
    }, [])

    const handleSubmit = async (event) => {

        event.preventDefault()

        if (!clientSecret) {
            console.error("No client secret available")
            return
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
                }
            }
        })
    
        if (error) {
            console.log(error)
        } else {

            /**Call backend to add payment to customer */
            fetch("http://127.0.0.1:5000/createCustomerPaymentMethod", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    payment_method_id: setupIntent['payment_method'],
                    nick_name: cardDetails.nickName,
                    current: false,
                    customer_id: data['id']
                }),
            })
            .then((response) => {
                if (!response.ok) {
                    return false // Successful response
                }

                navigate('/ManagePayments', {state: data})
                return true
            })
            .catch((error) => {
                console.error("Error creating payment method:", error)
                return false // Error occurred
            })

        }

    }

    const goToPayments = () => {
        navigate("/ManagePayments", {state: data})
        
    }

    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setCardDetails((prevDetails) => ({ ...prevDetails, [name]: value}))
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
                    <button type="submit" disabled={!stripe}>
                        Add Payment Method
                    </button>
                    <button type="button" onClick={goToPayments}>
                        Go to Payments
                    </button>
                </form>
            </div>
        </div>
        
    )
}

export default CreatePayment
