import React, { useEffect, useState } from "react";
import Select from "react-select";
import "./styles/ManageCustomers.css";
import { useNavigate } from "react-router-dom";

function ManageCustomers() {

    const [customers, setCustomers] = useState([]);

    // Sort key selected of the table of customers
    const [sortKey, setSortKey] = useState(null);
    const [ascending, setAscending] = useState(false)

    const [customerIDVal, setCustomerIDVal] = useState(null)

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = () => {
        try {
        const url = "http://127.0.0.1:5000/readCustomers"
        fetch(url, { method: "GET" })
            .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok")
            }
            return response.json()
            })
            .then((customersData) => {
                setCustomers(customersData)
            })
            .catch((error) => {
                console.error("Error fetching customers:", error.message)
            })
        } catch (error) {
            console.error("Error fetching customers:", error.message);
        }
    };

    const navigate = useNavigate();

    const handleCreateCustomer = () => {
        navigate("../CreateCustomer")
    }

    const handleCustomerClick = (customer_id) => {
        navigate("../Customer", { state: customer_id })
    };

    // Select for sort
    const options = [
        { value: "first_name", label: "First Name" },
        { value: "last_name", label: "Last Name" },
        { value: "email", label: "Email" },
        { value: "age", label: "Age" }
    ]


    const handleAscendingChange = () => {
        setAscending(!ascending);
    };

    const handleSortChange = (sortKey) => {
        setSortKey(sortKey)
    }

    const handleJoinCustomer = (event) => {
        event.preventDefault(); // Prevents the default form submission
        let valid_id = validID(customerIDVal)
        if(valid_id > 0){
            alert("Valid subscription, Thank you!")
        }
        else if (valid_id < 0){
            // Navigate to create account
            handleCreateCustomer()
            alert("No customer found, you will be redirecto to create an account for the customer, thank you!")
        }
        else{
            // navigate to customer
            handleCustomerClick(customerIDVal)
            alert("Subscription is not active, you will be redirected to activate subscription, thank you!")
        }
    };

    function validID(customerID){
        for (let i = 0; i < customers.length; i++){
            if(customerID === customers[i]['id'] && customers[i]['subscription']['status'] === 'Active'){
                return 1
            }
            else if (customerID === customers[i]['id']){
                return 0
            }
        }
        return -1
    }

    const sortCustomers = async () => {
        if(sortKey){
        try {
            // Fields needed to sort customers
            const formValues = {
                sort_key: sortKey.value,
                ascending: ascending,
            };
            const response = await fetch("http://127.0.0.1:5000/sortCustomers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formValues),
            });

            // Check response
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            window.location.reload()
        } catch (error) {
            console.error("Error fetching sort:", error.message);
        }
        } else {
            alert("Select an option");
        }
    }

    return (
        <div className="user-view">
            <div className="main-container">
                <div className="search-bar">
                    <div className="sort-container">
                        <Select 
                            className="select"
                            options={options}
                            onChange={handleSortChange} />
                        <div>
                            Ascending
                            <input
                                type="checkbox"
                                checked={ascending}
                                onChange={handleAscendingChange} />
                        </div>
                        <button className="primary-btn" onClick={sortCustomers}>
                            Sort
                        </button>
                        <button className="primary-btn" onClick={handleCreateCustomer}>
                            + Create Customer
                        </button>
                    </div>
                    <form onSubmit={handleJoinCustomer}>
                        <input
                            type="text"
                            placeholder="Gymrat ID"
                            className="search"
                            onChange={(e) => setCustomerIDVal(e.target.value)}
                        />
                        <button className="submit" type="submit">
                            Join Party
                        </button>
                    </form>
                </div>
                <div className="customer-table">
                    <table>
                        <thead className="customer-thead">
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>DoB (MM/DD/YYYY)</th>
                                <th>Age</th>
                            </tr>
                        </thead>

                        <tbody>
                            {customers.map((customer) => (
                            <tr
                                key={customer.id}
                                onClick={() => handleCustomerClick(customer.id)}
                                >
                                <td>{customer.first_name}</td>
                                <td>{customer.last_name}</td>
                                <td>{customer.email}</td>
                                <td>{customer.birthdate[0].month}/{customer.birthdate[0].day}/{customer.birthdate[0].year}</td>
                                <td>{customer.age}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="footer">
                </div>
            </div>
        </div>
    );
}

export default <ManageCustomers/>;
