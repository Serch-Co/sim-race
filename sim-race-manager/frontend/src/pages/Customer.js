import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./styles/Customer.css";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmCustomerDeletion from "../components/ManageCustomers/ConfirmCustomerDeletion"

function Customer() {

    const location = useLocation();
    const customer_id = location.state
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null)

    const fetchCustomer = async () => {
        try {
            const url = "http://127.0.0.1:5000/readCustomer?customer_id="+customer_id
            fetch(url, { method: "GET" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok")
                }
                return response.json()
            })
            .then((data) => {
                setCustomer(data)
            })
            .catch((error) => {
                console.error("Error fetching Customer:", error.message)
            })
        } catch (error) {
            console.error("Error fetching Customer:", error.message)
        }
    }
    
    useEffect(() => {
        fetchCustomer()
    }, [])
    
    const defaultFormValues = {
        first_name: customer ? customer.first_name : "",
        last_name: customer ? customer.last_name : "", 
        email: customer ? customer.email : "",
        birthdate: [
            {
                month: customer ? customer.birthdate[0].month : "",
                day: customer ? customer.birthdate[0].day : "",
                year: customer ? customer.birthdate[0].year : "",
            },
            {
                timeStampDoB: customer ? customer.birthdate[1] : "",
            }
        ]
    };

    const [formValues, setFormValues] = useState({ ...defaultFormValues });
    const [isSaved, setIsSaved] = useState(true)
    const [confimrDeletionModule, setConfimrDeletionModule] = useState(false);

    const monthOpt = [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September"},
        { value: 10, label: "October"},
        { value: 11, label: "November"},
        { value: 12, label: "December"}
    ]
    const dayOpt = [
        { value: 1, label: 1 },
        { value: 2, label: 2 },
        { value: 3, label: 3 },
        { value: 4, label: 4 },
        { value: 5, label: 5 },
        { value: 6, label: 6 },
        { value: 7, label: 7 },
        { value: 8, label: 8 },
        { value: 9, label: 9 },
        { value: 10, label: 10 },
        { value: 11, label: 11 },
        { value: 12, label: 12 },
        { value: 13, label: 13 },
        { value: 14, label: 14 },
        { value: 15, label: 15 },
        { value: 16, label: 16 },
        { value: 17, label: 17 },
        { value: 18, label: 18 },
        { value: 19, label: 19 },
        { value: 20, label: 20 },
        { value: 21, label: 21 },
        { value: 22, label: 22 },
        { value: 23, label: 23 },
        { value: 24, label: 24 },
        { value: 25, label: 25 },
        { value: 26, label: 26 },
        { value: 28, label: 28 },
        { value: 29, label: 29 },
        { value: 30, label: 30 },
        { value: 31, label: 31 }
    ]

    // Handle Change in birth month
    const handleMonthChange = (property) => {
        formValues["birthdate"][0].month = property.value
        setIsSaved(false);
    }

    // Handle change in birth day
    const handleDayChange = (property) => {
        formValues["birthdate"][0].day = property.value
        setIsSaved(false);
    }

    // Handle change in birth year
    const handleYearChange = (property) => {
        formValues["birthdate"][0].year = property.target.value
        setIsSaved(false);
    }

    const handleInputChange = (property) => {
        formValues[property.target.ariaLabel] = property.target.value
        setIsSaved(false);
    };

    function adjustDoB(inputDoB, defDoB){
        for(let i = 0; i < inputDoB.length; i++){
            for(let item in inputDoB[i]){
                if (item !== 'timeStampDoB'){
                    if(inputDoB[i][item] === ''){
                        inputDoB[i][item] = +defDoB[i][item]
                    }
                }
                else if(inputDoB[i][item] === ''){
                    inputDoB[i][item] = defDoB[i][item]
                }
            }
        }
        return inputDoB
    }

    /**
     * Handle empty spaces that the customer might have erased and assinged to the original value
     * Handle 0 as input and replaces it with the original value
     * @returns the object with completed object
     */
    function clearEmptyInput(){
        let dobNotChanged = true
        for (let key in formValues) {
            if(key === "birthdate"){
                formValues[key] = adjustDoB(formValues[key], defaultFormValues[key])
                dobNotChanged = false
            }
            else if(formValues[key] === ''){
                formValues[key] = defaultFormValues[key]
            }
        }
        if(dobNotChanged){
            delete formValues.birthdate
        }
        return formValues
    }

    const showRaces = () => {
        navigate('/CustomerRaces', { state: customer })
    }

    const showPaymentMethods = () => {
        navigate('/ManagePayments', { state: customer })
    }

    const generateQRCode =  async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/generateQR", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ customer_id: customer['id'] }),
            })
            const blob = await response.blob()
            const qrCodeUrl = URL.createObjectURL(blob)
            // Download qrCode
            const link = document.createElement("a")
            link.href = qrCodeUrl
            link.download = `${customer['id']}_qrCode.png`
            document.body.appendChild(link)
            link.click()
            // Clean up the link
            document.body.removeChild(link)
        } catch (error) {
            console.error("Error generating barcode:", error)
        }
    }

    const updateClicked = () => {
        const newFormValues = clearEmptyInput()
        updateCustomer(newFormValues)
    }

    const deleteCustomerClicked = () => {
        setConfimrDeletionModule(true)
    }

    /* Update Customer and send to database */
    const updateCustomer = async () => {
        const formData = {
            updates: formValues,
            customer_id: customer_id
        }

        /**Call backend update gymrat */
        return fetch("http://127.0.0.1:5000/updateCustomer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        })
        .then((response) => {
            if (response.ok) {
                navigate('../ManageCustomers')
                return true; // Successful response
            } else {
                return false; // Failed response
            }
        })
        .catch((error) => {
            console.error("Error updating customer:", error);
            return false; // Error occurred
        });
    }

    // Check if customer is detected
    if(!customer) {
        return (
            <div>Loading...</div>
        )
    }

    return (

        <div className="user-view">
            <div className="main-container">
                <h3>
                    {customer.first_name} {customer.last_name}
                </h3>
                <div className="user-options">
                    <button className="primary-btn" onClick={deleteCustomerClicked} >
                        Delete Customer
                    </button>
                    <button
                        className="primary-btn" 
                        onClick={updateClicked} >
                        Edit Customer
                    </button>
                    <button className="primary-btn" onClick={showPaymentMethods} >
                        Payment Methods
                    </button>
                    <button className="primary-btn" onClick={showRaces} >
                        Customer Races
                    </button>
                    <button className="primary-btn" onClick={generateQRCode} >
                        Generate QRCode
                    </button>
                </div>
                <div className="user-info">
                    <form>
                        <div className="user-name">
                            <div className="box-title">Customer name</div>
                            <div className="box">
                                <div className="input-box">
                                    First Name
                                    <input
                                        className="input-field"
                                        placeholder={customer.first_name}
                                        aria-label="first_name"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="input-box">
                                    Last Name
                                    <input
                                        className="input-field"
                                        placeholder={customer.last_name}
                                        aria-label="last_name"
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="user-email">
                            <div className="box-title">Email</div>
                            <div className="input-box">
                                <input
                                    className="input-field"
                                    placeholder={customer.email}
                                    aria-label="email"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="user-dob">
                            <div className="box-title">Date of Birth</div>
                            <div className="box">
                                <div className="input-box">
                                    Month
                                    <Select
                                        className="input-field"
                                        options={monthOpt}
                                        placeholder={customer.birthdate[0].month}
                                        aria-label="monBirthdate"
                                        onChange={handleMonthChange}
                                    />
                                </div>
                                <div className="input-box">
                                    Day
                                    <Select
                                        className="input-field"
                                        options={dayOpt}
                                        placeholder={customer.birthdate[0].day}
                                        aria-label="dayBirthdate"
                                        onChange={handleDayChange}
                                    />
                                </div>
                                <div className="input-box">
                                    Year
                                    <input
                                        type="number"
                                        className="input-field"
                                        placeholder={customer.birthdate[0].year}
                                        aria-label="yearBirthdate"
                                        onChange={handleYearChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="user-startDate">
                            <div className="box-title">Start Date</div>
                            <div className="box">
                                <div className="info-box">
                                    Month
                                    <div
                                        className="info-field" 
                                        aria-label="user-start-month">
                                        {customer.startDate[0].month}</div>
                                </div>
                                <div className="info-box">
                                    Day
                                    <div 
                                        className="info-field"
                                        aria-label="user-start-day">
                                        {customer.startDate[0].day}</div>
                                </div>
                                <div className="info-box">
                                    Year
                                    <div 
                                        className="info-field"
                                        aria-label="user-start-year">
                                        {customer.startDate[0].year}</div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <ConfirmCustomerDeletion
                trigger={confimrDeletionModule}
                setTrigger={setConfimrDeletionModule}
                customerEmail={customer.email}
                customerId={customer.id}
            />
        </div>  
    );
}

export default <Customer />;
