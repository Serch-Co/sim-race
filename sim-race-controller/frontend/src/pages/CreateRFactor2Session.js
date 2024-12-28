import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from "react-select";

const CreateRFactor2Session = () => {
/**
 * Memory plug in 
 * https://github.com/TheIronWolfModding/rF2SharedMemoryMapPlugin
 */
    const navigate = useNavigate()
    const location = useLocation()
    const sittings = location.state

    const [form, setForm] = useState({
        track: '',
        car: '',
        laps: 0,
        weather: 'Clear',
    });

    const weatherOpt = [
        { value: 'Clear', label: 'Clear' },
        { value: 'Rain', label: 'Rain' }
    ]

    const handleChange = (e, name) => {
        console.log(e, name)
        setForm({ ...form, [name]: e });
    }

    const goToAssignSittings = () =>{
        navigate('/AssingSittings')
    }

    const handleSubmit = async (e) => {
        console.log(form)
        e.preventDefault();
        let formData = {
            form: form,
            sittings: sittings
        }
        try {
            const url = "http://127.0.0.1:8080/createRFactor2Session"
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            })
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok")
                }
                const responseData = await response.json()
                console.log(responseData)
                if (responseData['error']){
                    alert('Sim '+responseData['number']+': '+responseData['error'])
                    return false
                }
                console.log(responseData)
                // TODO
                // Create a page to manage race, as to pause, resume
                // And watch live telemetry
                // navigate('/LiveTelemetryRFactor2')
                return response.json()
            })
            .catch((error) => {
                alert("Error creating rFactor 2 race:", error.message)
            })
        } catch (error) {
            alert("Error creating rFactor 2 race:", error.message);
        }
    };

  return (
    <div className="user-view">
        <div className="main-container">
            <h3>
                Creating rFactor 2 Race
            </h3>
            <form onSubmit={handleSubmit}>
                <input
                    className="input-field"
                    name="track"
                    aria-label="track"
                    placeholder="Track"
                    onChange={(e) => handleChange(e.target.value, 'track')}
                    required />
                <input
                    className="input-field"
                    name="car"
                    aria-label="car"
                    placeholder="Car"
                    onChange={(e) => handleChange(e.target.value, 'car')}
                    required />
                <input
                    className="input-field"
                    name="laps"
                    aria-label="laps"
                    type="number"
                    placeholder="Laps"
                    onChange={(e) => handleChange(e.target.value, 'laps')}
                    required />
                <Select 
                    name="weather" 
                    onChange={(e) => handleChange(e.value, 'weather')}
                    className="input-field"
                    options={weatherOpt}
                    placeholder="Weather"
                    aria-label="weather"
                    required />
                
                <button className="primary-btn" onClick={goToAssignSittings}>Cancel</button>
                <button className="primary-btn" type="submit">Create Race</button>

            </form>
        </div>
    </div>
  );
};

export default <CreateRFactor2Session/>;
