/**
 * Page handles which simulator is used by each customer
 */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AssignSittings() {

    const [simulators, setSimulators] = useState([]);
    const [loading, setLoading] = useState(true)
    const [reloadSign, setReloadSign] = useState(false)
    const [sittings, setSittings] = useState([])
    const [validIDs, setValidIDs] = useState(false)

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
        let finalSittings = clearSittings()
        checkCustomerIDs()
        console.log('validIDS:',validIDs)
        if(finalSittings.length === 0){
            alert('No sittings assigned')
        }
        else if(!validIDs){
            alert('There are customerIDs that are not valid')
        }
        else{
            navigate("/CreateRace", { state: finalSittings })
        }
    }

    const goToHome = () => {
        navigate('/')
    }

    function checkCustomerIDs(){
        if (sittings.length === 0){
            return false
        }
        try {
            fetch("http://127.0.0.1:8080/checkValidCustomerIDs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({sittings: sittings}),
            })
            .then(async (response) => {
                if (!response.ok) {
                    return false; // Unsuccessful response
                }
                return true
            })
            .then((data) => {
                setValidIDs(data)
            })
            .catch((error) => {
                console.error('Something wrong checking customer IDs', error)
                return false; // Error occurred
            });
        } catch (error) {
            console.error('Something wrong checking customer IDs', error)
            return false
        }
    }

    const handleInputChange = (customer_id, sim_id) => {
        /** check if sim_id in sittings
         * if sim_id in sittings, change customer_id
         * if sim_id not in sittings add to sittings
         */
        let newSittings = []
        if(!sim_in_use(sim_id)){
            for(let i = 0; i < sittings.length; i++){
                newSittings.push({
                    'sim_id': sittings[i]['sim_id'],
                    'customer_id': sittings[i]['customer_id']
                })
            }
            newSittings.push({
                            'sim_id': sim_id,
                            'customer_id': customer_id
                        })
        }
        else{
            for(let i = 0; i < sittings.length; i++){
                if(sittings[i]['sim_id'] === sim_id){
                    newSittings.push({
                        'sim_id': sim_id,
                        'customer_id': customer_id
                    })
                }
                else{
                    newSittings.push({
                        'sim_id': sittings[i]['sim_id'],
                        'customer_id': sittings[i]['customer_id']
                    })
                }
            }
        }
        setSittings(newSittings)
    }

    function clearSittings(){
        let clearSittings = []
        for(let i = 0; i < sittings.length; i++){
            if (sittings[i]['customer_id'] === ""){
                console.log(sittings[i]['sim_id'], 'empty')
            }
            else{
                clearSittings.push({
                    'sim_id': sittings[i]['sim_id'],
                    'customer_id': sittings[i]['customer_id']
                })
            }
        }
        return clearSittings
    }

    function sim_in_use(sim_id){
        for (let i = 0; i < sittings.length; i++){
            if (sittings[i]['sim_id'] === sim_id){
                return true
            }
        }
        return false
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
                            <th>Customer ID</th>
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
                                    placeholder="Customer ID"
                                    onChange={(e) => handleInputChange(e.target.value, simulator.id)}
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