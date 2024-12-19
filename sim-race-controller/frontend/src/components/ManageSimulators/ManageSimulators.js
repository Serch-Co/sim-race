import React, { useEffect, useState } from "react";
import "./styles/ManageSimulators.css";
import { useNavigate } from "react-router-dom";

function ManageSimulators() {

    const [simulators, setSimulators] = useState([]);
    const [loading, setLoading] = useState(true)
    const [reloadSign, setReloadSign] = useState(false)

    useEffect(() => {
        try {
            const url = "http://127.0.0.1:8080/readSimulators"
            fetch(url, { method: "GET" })
            .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok")
            }
            return response.json()
            })
            .then((simulatorsData) => {
                setLoading(false)
                setSimulators(simulatorsData)
            })
            .catch((error) => {
                setReloadSign(true)
                console.error("Error fetching simulators:", error.message)
            })
        } catch (error) {
            setReloadSign(true)
            console.error("Error fetching simulators:", error.message);
        }
    }, []);

    const navigate = useNavigate();

    const handleAddSimulator = () => {
        navigate("../AddSimulator")
    }

    const checkSimulatorStatus = () => {
        try {
            setLoading(true)
            const url = "http://127.0.0.1:8080/checkSimulatorsStatus"
            fetch(url, { method: "POST" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok")
                }
                window.location.reload()
                setLoading(false)
                return response.json()
            })
            .catch((error) => {
                alert("Error checking simulators status:", error.message)
            })
        } catch (error) {
            alert("Error checking simulators status:", error.message);
        }
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
                <div className="search-bar">
                    <div className="sort-container">
                        <button className="primary-btn" onClick={handleAddSimulator}>
                            + Add Simulator
                        </button>
                    </div>
                </div>
                <div className="simulator-table">
                    <table>
                        <thead className="simulator-thead">
                            <tr>
                                <th>Name</th>
                                <th>Number</th>
                                <th>IP</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {simulators.map((simulator) => (
                                
                            <tr
                                key={simulator.sim_id}
                                >
                                <td>{simulator.name}</td>
                                <td>{simulator.number}</td>
                                <td>{simulator.ip}</td>
                                <td>{simulator.status ?
                                    <div className="sim-connected">
                                        Connected
                                    </div>:
                                    <div className="sim-not-connected">
                                        Not Connected
                                    </div>
                                }</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="footer">
                    <button className="primary-btn" onClick={checkSimulatorStatus}>
                        Check Simulators Status
                    </button>
                </div>
            </div>
        </div>
    );
}

export default <ManageSimulators/>;
