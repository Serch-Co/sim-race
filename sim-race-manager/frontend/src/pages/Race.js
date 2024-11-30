import React, { useState } from "react";
// import "./styles/user.css";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmRaceDeletion from "../components/ManageRaces/ConfirmRaceDeletion"
// import ConfirmRaceRestoration from "../Components/ManageRaces/ConfirmRaceRestoration.js"

function Race() {

    const location = useLocation();
    const race = location.state
    const navigate = useNavigate();

    const defaultFormValues = {
        name: race ? race.name : "",
        price: race ? race.price : "",
        description: race ? race.description : "",
        id: race ? race.id : "",
        price_id: race ? race.price_id : "",
        active: race ? race.active : ""
    };

    const [formValues, setFormValues] = useState({ ...defaultFormValues });
    const [isSaved, setIsSaved] = useState(true)
    const [confimrDeletionModule, setConfimrDeletionModule] = useState(false);
    const [confimrRestorationModule, setConfimrRestorationModule] = useState(false);
    const [priceChange, setPriceChange] = useState(false)


    const updateClicked = () => {
        const newFormValues = clearEmptyInput()
        updateRace(newFormValues)
    };

    const handleInputChange = (property) => {
        formValues[property.target.ariaLabel] = property.target.value
        setIsSaved(false);
    };

    // Handle change in number
	const handleInputNumChange = (property) => {
		formValues[property.target.ariaLabel] = Number(property.target.value)
        setPriceChange(true)
		setIsSaved(false);
	}

    /**
     * Handle empty spaces that race might have erased and assinged to the original value
     * Handle 0 as input and replaces it with the original value
     * @returns the object with completed object
     */
    function clearEmptyInput(){
        for (let key in formValues) {
            if(formValues[key] === ''){
                formValues[key] = defaultFormValues[key]
            }
            if(formValues[key] === 0){
                formValues[key] = defaultFormValues[key]
            }
        }
        return formValues
    }

    const deleteRaceClicked = () => {
        setConfimrDeletionModule(true);
    }
    const restoreRaceClicked = () => {
        setConfimrRestorationModule(true)
    }


    /* Update Race and send to database */
    const updateRace = async () => {
        const formData = {
            updated_race: formValues,
            price_change: priceChange
        }

        /**Call backend update gymrat */
        return fetch("http://127.0.0.1:5000/updateRace", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        })
        .then((response) => {
            if (response.ok) {
                navigate('../ManageRaces')
                return true; // Successful response
            } else {
                return false; // Failed response
            }
        })
        .catch((error) => {
            console.error("Error updating Race:", error);
            return false; // Error occurred
        });
    }


    return (

        <div className="user-view">
            <div className="main-container">
                <h3>
                    {race.name}
                </h3>
                <div className="user-options">
                    <div>
                        {race.active ? 
                        <button className="primary-btn" onClick={deleteRaceClicked} >
                            Delete Add On
                        </button> : 
                        <button className="primary-btn" onClick={restoreRaceClicked} >
                            Restore Add On
                        </button>}
                    </div>
                    <button
                        className="primary-btn" 
                        onClick={updateClicked} >
                        Edit Add On
                    </button>
                </div>
                <div className="add-on-info">
                    <form>
                        <div className="add-on-name">
                            <div className="box-title">Name</div>
                            <div className="box">
                                <div className="input-box">
                                    <input
                                        className="input-field"
                                        placeholder={race.name}
                                        aria-label="name"
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="add-on-description">
                            <div className="box-title">Description</div>
                            <div className="input-box">
                                <input
                                    className="input-field"
                                    placeholder={race.description}
                                    aria-label="description"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>


                        <div className="add-on-price">
                            <div className="box-title">Price</div>
                            <div className="box">
                                <div className="info-box">
                                <input
                                        className="input-field" 
                                        type="number"
                                        aria-label="price"
                                        placeholder={race.price}
                                        onChange={handleInputNumChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {/* <ConfirmRaceRestoration
                trigger={confimrRestorationModule}
                setTrigger={setConfimrRestorationModule}
                raceName={race.name}
                raceId={race.id}
            /> */}
            <ConfirmRaceDeletion
                trigger={confimrDeletionModule}
                setTrigger={setConfimrDeletionModule}
                raceName={race.name}
                raceId={race.id}
            />
        </div>  
    );
}

export default <Race />;
