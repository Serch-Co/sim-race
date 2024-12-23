import React, { useState, useEffect } from "react";
import "./styles/Simulator.css";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmSimulatorDeletion from "../components/ManageSimulators/ConfirmSimulatorDelition";

function Simulator() {

    const location = useLocation();
    const sim_id = location.state
    const navigate = useNavigate();

    const [simulator, setSimulator] = useState(null)
    const [loading, setLoading] = useState(true)
    const [reloadSign, setReloadSign] = useState(false)
    
    useEffect(() => {
        try {
            const url = "http://127.0.0.1:8080/readSimulator?sim_id="+sim_id
            fetch(url, { method: "GET" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok")
                }
                return response.json()
            })
            .then((data) => {
                setLoading(false)
                setSimulator(data)
            })
            .catch((error) => {
                setReloadSign(true)
                console.error("Error fetching simulator:", error.message)
            })
        } catch (error) {
            setReloadSign(true)
            console.error("Error fetching simulator:", error.message)
        }
    }, [sim_id])
    
    const defaultFormValues = {
        name: simulator ? simulator.name : "",
        number: simulator ? simulator.number : "", 
        ip: simulator ? simulator.ip : "",
        status: simulator ? simulator.status : "",
        id: simulator ? simulator.id : ""
    };

    const [formValues, setFormValues] = useState({ ...defaultFormValues });
    const [isSaved, setIsSaved] = useState(true)
    const [confimrDeletionModule, setConfimrDeletionModule] = useState(false);

    const handleInputChange = (property) => {
        formValues[property.target.ariaLabel] = property.target.value
        setIsSaved(false);
    };

    const handleNumChange = (property) => {
        formValues[property.target.ariaLabel] = Number(property.target.value)
        setIsSaved(false);
    };

    /**
     * Handle empty spaces that the customer might have erased and assinged to the original value
     * Handle 0 as input and replaces it with the original value
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

    const updateClicked = () => {
        const newFormValues = clearEmptyInput()
        updateSimulator(newFormValues)
    }

    const deleteSimulatorClicked = () => {
        setConfimrDeletionModule(true)
    }

    /* Update Customer and send to database */
    const updateSimulator = async () => {
        const formData = {
            sim_id: sim_id,
            updates: formValues
        }

        /**Call backend update simulator */
        return fetch("http://127.0.0.1:8080/updateSimulator", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        })
        .then((response) => {
            if (response.ok) {
                navigate('../ManageSimulators')
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

    if(reloadSign) {
        return (
            <div>Reload page to try again</div>
        )
    }
    
    if(loading) {
        return (
            <div>Loading...</div>
        )
    }

    return (

        <div className="user-view">
            <div className="main-container">
                <h3>
                    {simulator.name}
                </h3>
                <div className="user-options">
                    <button className="primary-btn" onClick={deleteSimulatorClicked} >
                        Delete Simulator
                    </button>
                    <button
                        className="primary-btn" 
                        onClick={updateClicked} >
                        Edit Simulator
                    </button>
                </div>
                <div className="user-info">
                    <form>
                        <div className="box">
                            <div className="input-box">
                                Name
                                <input
                                    className="input-field"
                                    placeholder={simulator.name}
                                    aria-label="name"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="input-box">
                                Number
                                <input
                                    type="number"
                                    className="input-field"
                                    placeholder={simulator.number}
                                    aria-label="number"
                                    onChange={handleNumChange}
                                />
                            </div>
                            <div className="input-box">
                                IP
                                <input
                                    className="input-field"
                                    placeholder={simulator.ip}
                                    aria-label="ip"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="info-box">
                                Status
                                <div className="info-field">
                                    {simulator.status ?
                                        <div className="sim-connected">
                                            Connected
                                        </div>:
                                        <div className="sim-not-connected">
                                            Not Connected
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="user-options">
                    <button className="primary-btn">
                        Check Status
                    </button>
                </div>
            </div>

            <ConfirmSimulatorDeletion
                trigger={confimrDeletionModule}
                setTrigger={setConfimrDeletionModule}
                sim_name={simulator.name}
                sim_id={simulator.id}
            />
        </div>  
    );
}

export default <Simulator />;
