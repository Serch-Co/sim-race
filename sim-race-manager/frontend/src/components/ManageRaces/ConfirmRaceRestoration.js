/**
 * Takes in a race to restore Race
 */

import React from "react";
import { useNavigate } from "react-router-dom";

function ConfirmRaceRestoraion(props) {
  const navigate = useNavigate();

  /** User has selected to confirm Restoration */
  const confirmRestorationClicked = () => {
    restoreRace(props.raceId);
    props.setTrigger(false);
  };

  /** User has selected to cancel Restoration */
  const cancelRestorationClicked = () => {
    props.setTrigger(false);
  };

  /**Takes in a Race_id to be sent to the backend for Restoration  */
  function restoreRace(raceId) {
    const formData = {
      race_id: raceId
    }
    // Make a fetch request to the restoreRace endpoint
    fetch("http://127.0.0.1:5000/restoreRace", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
    .then(async (response) => {
      if (response.ok) {
        return response.text(); // Return the response text if the request is successful
      }
      const errorData = await response.json()
      alert("Error: "+errorData.error)
      throw new Error(errorData.error)
    })
    .then((data) => {
      // Navigate to manage Races
      navigate("../ManageRaces")
    })
    .catch((error) => {
      console.error("Error:", error.message); // Log any errors that occur
    });
  }

  return props.trigger ? (
    <div className="background">
      <div className="main-container">
        <div className="confirmation-module">
          Restore Race with name: {props.raceName}
          <div>
            <button onClick={confirmRestorationClicked} className="primary-btn">
              Confirm
            </button>
            <button onClick={cancelRestorationClicked} className="primary-btn">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

export default ConfirmRaceRestoraion;
