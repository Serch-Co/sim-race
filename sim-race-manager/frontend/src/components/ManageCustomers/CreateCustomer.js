import React, { useEffect, useState } from "react";
import Select from "react-select";
import "./styles/CreateCustomer.css";
import { useNavigate } from "react-router-dom";
import { centToDollar } from "../../utils/Helpers";

function CreateCustomer() {
	const navigate = useNavigate()
	const [subscriptionPrice, setSubscriptionPrice] = useState(0)

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
                setSubscriptionPrice(subscriptionData['price'])
            })
            .catch((error) => {
                console.error("Error fetching subscription:", error.message)
            })
        } catch (error) {
            console.error("Error fetching subscription:", error.message)
        }
    }
	
	const [isSaved, setIsSaved] = useState(true)
	const defaultFormValues = {
		first_name: "",
		last_name: "", 
		email: "",
		birthdate: [
			{
				month: "",
				day: "",
				year: "",
			},
			{
				timeStampDoB: ""
			}
		],
		age: "",
		subscriptionPrice: 0,
		startDate: {
			month: "",
			day: "",
			year: "",
		},
		payments: [],
		subscription: [],
		races: [],
		id: "",
	};

	// Regex pattern for validating email
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const [emailError, setEmailError] = useState("");

	const [formValues, setFormValues] = useState({ ...defaultFormValues });

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

	const createClicked = () => {
		const newFormValues = clearEmptyInput()
		createCustomer(newFormValues)
	};

	// Handle Change in birth month
	const handleMonthChange = (property) => {
		formValues["birthdate"][0]["month"] = property.value
		setIsSaved(false);
	}

	// Handle change in birth day
	const handleDayChange = (property) => {
		formValues["birthdate"][0]["day"] = property.value
		setIsSaved(false);
	}

	// Handle change in birth year
	const handleYearChange = (property) => {
		const year = +property.target.value
		formValues["birthdate"][0]["year"] = year
		setIsSaved(false);
	}

	// Handle validation for email
	const validateEmail = (property) => {
		const value = property.target.value;
		formValues[property.target.ariaLabel] = value
		if (!emailRegex.test(value)) {
			setEmailError('Invalid Email')
		} else {
			setEmailError('')
		}
	};

	const handleInputChange = (property) => {
		formValues[property.target.ariaLabel] = property.target.value
		setIsSaved(false);
	};

	/**
	 * Handle empty spaces that customer might have erased and assinged to the original value
	 * @returns the object with completed object
	 */
	function clearEmptyInput(){
		for (let key in formValues) {
			if(formValues[key] === ''){
				formValues[key] = defaultFormValues[key]
			}
		}
		return formValues
	}

	/* create Customer and send to database */
	const createCustomer = async () => {
		formValues['subscriptionPrice'] = subscriptionPrice

		/**Call backend to add gymrat */
		return fetch("http://127.0.0.1:5000/createCustomer", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(formValues),
		})
		.then(async (response) => {
			if (!response.ok) {
				return false; // Unsuccessful response
			}

			const responseData = await response.json();
			formValues['id'] = responseData['customer_id']
			let data = {
				customer: formValues,
				totalPrice: subscriptionPrice,
			}
			navigate("../CheckoutForm", { state: data })
			return true
		})
		.catch((error) => {
			console.error("Error creating customer:", error);
			return false; // Error occurred
		});
	}

	const handleSubmit = (e) => {
		// Prevent from loading 
		e.preventDefault();
		if (emailError && formValues['email']){
			alert('Something wrong with the email')
		}
		else{
			// Call the create method
			createClicked()
		}
	  };

	if(!subscriptionPrice){
		return (
			<div>Loading...</div>
		)
	}


  return (

    <div className="user-view">
        <div className="main-container">
            <h3>
                Create Customer
            </h3>
            <div className="customer-info">
                <form onSubmit={handleSubmit}>
                    <div className="customer-name">
                        <div className="box-title">Customer name</div>
                        <div className="box">
                            <div className="input-box">
                                First Name
                                <input
                                    className="input-field"
                                    placeholder="First Name"
                                    aria-label="first_name"
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="input-box">
                                Last Name
                                <input
                                    className="input-field"
                                    placeholder="Last Name"
                                    aria-label="last_name"
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="customer-email">
                        <div className="box-title">Email</div>
                        <div className="input-box">
                            <input
                                className="input-field"
                                placeholder="Email"
                                aria-label="email"
                                onChange={validateEmail}
								required
                            />
                        </div>
                    </div>
                    <div className="customer-dob">
                        <div className="box-title">Date of Birth</div>
                        <div className="box">
                            <div className="input-box">
                                Month
                                <Select
                                    className="input-field"
                                    options={monthOpt}
                                    placeholder="Month"
                                    aria-label="monBirthdate"
                                    onChange={handleMonthChange}
                                    required
                                />
                            </div>
                            <div className="input-box">
                                Day
                                <Select
                                    className="input-field"
                                    options={dayOpt}
                                    placeholder="Day"
                                    aria-label="dayBirthdate"
                                    onChange={handleDayChange}
                                    required
                                />
                            </div>
                            <div className="input-box">
                                Year
                                <input
                                    type="number"
                                    className="input-field"
                                    placeholder="Year"
                                    aria-label="yearBirthdate"
                                    onChange={handleYearChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="customer-suscription">
                    <div className="box-title">Suscription per Year</div>
                        <div className="box">
							<div className="info-box">
								Price: {centToDollar(subscriptionPrice)}
							</div>
                        </div>
                    </div>
					
					<div className="user-options">
						<button
							className="primary-btn"
							type="submit">
							Proceed to Checkout
						</button>
					</div>
                </form>
            </div>
        </div>
    </div>  
  );
}

export default <CreateCustomer/>;