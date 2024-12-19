import React, { useState } from "react";
import "./styles/AddSimulator.css";
import { useNavigate } from "react-router-dom";

function AddSimulator() {
	const navigate = useNavigate()

	const [isSaved, setIsSaved] = useState(true)
	const defaultFormValues = {
		number: "",
		name: "",
		ip: "", 
		status: "",
		id: "",
	};

	const [formValues, setFormValues] = useState({ ...defaultFormValues });

	const handleInputChange = (property) => {
		formValues[property.target.ariaLabel] = property.target.value
		setIsSaved(false);
	};

	const handleInputNumChange = (property) => {
		formValues[property.target.ariaLabel] = Number(property.target.value)
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

	/* Add Simulator and send to database */
	const addSimulator = async () => {
		console.log(formValues)
		/**Call backend to add simulator */
		return fetch("http://127.0.0.1:8080/addSimulator", {
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
			formValues['id'] = responseData['sim_id']
			navigate("../ManageSimulators")
			return true
		})
		.catch((error) => {
			console.error("Error Adding Simulator:", error);
			return false; // Error occurred
		});
	}

	const handleSubmit = (e) => {
		// Prevent from loading 
		e.preventDefault();
			
		const newFormValues = clearEmptyInput()
		addSimulator(newFormValues)
	  };

  return (

    <div className="user-view">
        <div className="main-container">
            <h3>
                Add Simulator
            </h3>
            <div className="customer-info">
                <form onSubmit={handleSubmit}>
                    <div className="customer-name">
                        <div className="box">
							<div className="input-box">
                                Name
                                <input
                                    className="input-field"
                                    placeholder="Name"
                                    aria-label="name"
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="input-box">
                                Number
                                <input
									type="number"
                                    className="input-field"
                                    placeholder="Number"
                                    aria-label="number"
                                    onChange={handleInputNumChange}
                                    required
                                />
                            </div>
                            <div className="input-box">
                                IP Address
                                <input
                                    className="input-field"
                                    placeholder="IP address"
                                    aria-label="ip"
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
					
					<div className="user-options">
						<button
							className="primary-btn"
							type="submit">
							Add Simulator
						</button>
					</div>
                </form>
            </div>
        </div>
    </div>  
  );
}

export default <AddSimulator/>;