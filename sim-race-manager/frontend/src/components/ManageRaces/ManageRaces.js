import React, { useEffect, useState } from "react";
// import "./styles/ManageRaces.css"
import { useNavigate } from "react-router-dom";

function ManageRaces() {

    const [races, setRaces] = useState([]);
    const [loading, setLoading] = useState(true)
    const [reloadSign, setReloadSign] = useState(false)

    useEffect(() => {
        fetchRaces();
    }, []);

    const fetchRaces = () => {
        try {
            const url = "http://127.0.0.1:5000/readRaces";
            fetch(url, { method: "GET" })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((racesData) => {
                setLoading(false)
                setRaces(racesData);
            })
            .catch((error) => {
                setReloadSign(true)
                console.error("Error fetching races:", error.message);
            });
        } catch (error) {
            setReloadSign(true)
            console.error("Error fetching races:", error.message);
        }
    };

    const navigate = useNavigate();

    const handleCreateRace = () => {
        navigate("../CreateRace")
    }

    const handleRaceClick = (race) => {
        navigate("../Race", { state: race })
    };

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
                <h2>Races</h2>
                <button className="primary-btn" onClick={handleCreateRace}>
                    + Create Race
                </button>

                <div className="event-table">
                    <table>
                        <thead className="event-thead">
                            <tr>
                            <th>Game</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Active</th>
                            </tr>
                        </thead>

                        <tbody>
                            {races.map((race) => (
                            <tr
                                key={race.id}
                                onClick={() => handleRaceClick(race)}
                                >
                                <td>{race.name}</td>
                                <td>{race.description}</td>
                                <td>{race.price}</td>
                                <td>{race.active.toString()}</td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default <ManageRaces />;
