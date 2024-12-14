/**
 * Page handles which race will be created 
 */
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function CreateRace() {

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

    const handleRaceClick = (e) => {

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
                <h2>Create Race</h2>
                <div>
                    {races.map((race) => (
                        <button 
                            className="menu-item"
                            key={race.id}>
                            {race.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default <CreateRace/>;