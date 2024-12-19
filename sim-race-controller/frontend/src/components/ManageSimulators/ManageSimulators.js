import React, { useEffect, useState } from "react";
// import Select from "react-select";
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
                                <th>IP</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {simulators.map((simulator) => (
                            <tr
                                key={simulator.id}
                                >
                                <td>{simulator.name}</td>
                                <td>{simulator.ip}</td>
                                <td>{simulator.status}</td>
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

export default <ManageSimulators/>;
