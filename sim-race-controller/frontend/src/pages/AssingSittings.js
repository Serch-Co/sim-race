/**
 * Page handles which simulator is used by each customer
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AssignSittings() {

    const [simulators, setSimulators] = useState([]);
    const [loading, setLoading] = useState(true)
    const [reloadSign, setReloadSign] = useState(false)

    useEffect(() => {
        fetchSimulators();
    }, []);

    const fetchSimulators = () => {
        try {
            const url = "http://127.0.0.1:8080/readActiveSimulators";
            fetch(url, { method: "GET" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((simulatorsData) => {
                setLoading(false)
                if (simulatorsData.length === 0){
                    alert('Check simulators status, none active')
                }
                setSimulators(simulatorsData);
            })
            .catch((error) => {
                setReloadSign(true)
                console.error("Error fetching simulators:", error.message);
            });
        } catch (error) {
            setReloadSign(true)
            console.error("Error fetching simulators:", error.message);
        }
    };

    const navigate = useNavigate();

    const handleRaceStartClick = (e) => {
        console.log('selecting what race')
    }

    const goToHome = (e) => {
        navigate('/')
    }


    if(reloadSign){
        return (
            <div>Reload page to try again</div>
        )
    }

    if(loading){
        return (
            <div>Loading...</div>
        )
    }

    return (
        <div className="user-view">
            <div className="main-container">
                <h2>Assign Sittings</h2>
                <table>
                    <thead className="simulator-thead">
                        <tr>
                            <th>Name</th>
                            <th>Customer</th>
                        </tr>
                    </thead>

                    <tbody>
                        {simulators.map((simulator) => (
                        <tr
                            key={simulator.id}>
                            <td>{simulator.name}</td>
                            <td>
                                <input
                                    className="input-field"
                                    required
                                />
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                <div className="user-options">
                    <button
                        className="primary-btn"
                        onClick={handleRaceStartClick}>
                        Select Race
                    </button>
                    <button
                        className="primary-btn"
                        onClick={goToHome}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default <AssignSittings/>;