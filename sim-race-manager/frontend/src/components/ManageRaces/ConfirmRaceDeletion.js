/**
 * Takes in a projets name to delete a project
 */

import React from "react";
import { useNavigate } from "react-router-dom";

function ConfirmRaceDeletion(props) {
  const navigate = useNavigate();

  /** User has selected to confirm deletion */
  const confirmDeletionClicked = () => {
    deleteRace(props.raceId);
    props.setTrigger(false);
  };

  /** User has selected to cancel deletion */
  const cancelDeletionClicked = () => {
    props.setTrigger(false);
  };

  /**Takes in a Race_id to be sent to the backend for deletion  */
  function deleteRace(raceId) {
    const formData = {
      race_id: raceId
    }
    // Make a fetch request to the deleteRace endpoint
    fetch("http://127.0.0.1:5000/removeRace", {
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
      console.log("Error:", error.message); // Log any errors that occur
    });
  }

  return props.trigger ? (
    <div className="background">
      <div className="main-container">
        <div className="confirmation-module">
          Delete Race with name: {props.raceName}
          <div>
            <button onClick={confirmDeletionClicked} className="primary-btn">
              Confirm
            </button>
            <button onClick={cancelDeletionClicked} className="primary-btn">
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

export default ConfirmRaceDeletion;
