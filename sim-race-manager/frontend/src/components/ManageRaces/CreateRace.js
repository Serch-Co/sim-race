import React, { useState } from "react";
// import "../styles/createAddOn.css";
import { useNavigate } from "react-router-dom";

function CreateRace() {
	const navigate = useNavigate()

	const defaultFormValues = {
        game: '',
        price: ''
	};

	const [formValues, setFormValues] = useState({ ...defaultFormValues });
	const [isSaved, setIsSaved] = useState(true)

	const createClicked = () => {
		const newFormValues = clearEmptyInput()
		CreateRace(newFormValues)
	};

	// Handle change
	const handleInputChange = (property) => {
		formValues[property.target.ariaLabel] = property.target.value
		setIsSaved(false);
	}

    // Handle change in number
	const handleInputNumChange = (property) => {
		formValues[property.target.ariaLabel] = Number(property.target.value)
		setIsSaved(false);
	}

	/**
	 * Handle empty spaces that user might have erased and assinged to the original value
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

	/* create add on and send to database */
	const createRace = async () => {
		const formData = {
			new_add_on: formValues
		}

		/**Call backend to add gymrat */
		return fetch("http://127.0.0.1:5000/createRace", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(formData),
		})
		.then((response) => {
			if (response.ok) {
				// window.location.reload()
				navigate("../ManageRaces")
				return true; // Successful response
			} else {
				return false; // Failed response
			}
		})
		.catch((error) => {
			console.error("Error updating add On:", error);
			return false; // Error occurred
		});
	}


  return (

    <div className="user-view">
        <div className="main-container">
            <h3>
                Create Race
            </h3>
            <div className="race-options">
                <button
                    className="primary-btn" 
                    onClick={createClicked}>
                    + Create
                </button>
            </div>
            <div className="race-info">
                    <form>
                        <div className="race-game">
                            <div className="box-title">Game</div>
                            <div className="box">
                                <div className="input-box">
                                    <input
                                        className="input-field"
                                        placeholder="Game"
                                        aria-label="game"
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="race-price">
                            <div className="box-title">Price</div>
                            <div className="box">
                                <div className="input-box">
                                    <input
                                        className="input-field" 
                                        type="number"
                                        aria-label="price"
                                        placeholder="Price"
                                        onChange={handleInputNumChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
        </div>
    </div>  
  );
}

export default <CreateRace />;