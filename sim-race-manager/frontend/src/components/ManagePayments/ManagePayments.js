import "../styles/ManagePayments.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "../Card.js";

const ManagePayments = () => {

    const location = useLocation();
    const navigate = useNavigate()
    const customer = location.state
    const [paymentMethods, setPaymentMethods] = useState([])

    useEffect(() => {
        fetchPaymentMethods();
    });

    const fetchPaymentMethods = () => {
        try {
            fetch("http://127.0.0.1:5000/readCustomerPaymentMethods", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customer_id: customer['id'] })
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                setPaymentMethods(data);
            })
            .catch((error) => {
                console.error("Error fetching PaymentMethods:", error.message);
            });
        } catch (error) {
            console.error("Error fetching PaymentMethods:", error.message);
        }
    };

    const showRaces = () => {
        navigate('/CustomerRaces', { state: customer})
    }

    const createPaymentMethod = () =>{
        navigate("/CreatePayment", {state: customer})
    }

    const updateClicked = () => {
        navigate("../Customer", { state: customer['id'] })
    }

    return (

        <div className="user-view">
            <div className="main-container">
                <h3>
                    Name: {customer['first_name']} {customer['last_name']}
                </h3>
                <div className="user-options">
                    <button className="primary-btn" onClick={updateClicked} >
                        Edit Customer
                    </button>
                    <button className="primary-btn" onClick={createPaymentMethod} >
                        Create Payment
                    </button>
                    <button className="primary-btn" onClick={showRaces} >
                        Customer Races
                    </button>
                </div>
                <div className="card-container">
                    {paymentMethods.map((data) => (
                        <Card
                            className="card-obj"
                            key={data.id}
                            customer={customer}
                            objID={data.id}
                            nickName={data.nick_name}
                            name={data.billing_details.name}
                            cardBrand={data.card.brand}
                            cardLast4={data.card.last4}
                            cardExpMonth={data.card.exp_month}
                            cardExpYear={data.card.exp_year}
                            current={data.current}
                        />
                    ))}
                </div>
            </div>
        </div>
    )


}


export default <ManagePayments />
