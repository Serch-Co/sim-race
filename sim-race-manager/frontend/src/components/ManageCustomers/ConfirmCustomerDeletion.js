/**
 * Takes in a projets name to delete a project
 */

import React from "react";
import { useNavigate } from "react-router-dom";

function ConfirmCustomerDeletion(props) {
  const navigate = useNavigate();

  /**Customer has selected to confirm deletion */
  const confirmDeletionClicked = () => {
    deleteCustomer(props.customerId);
    props.setTrigger(false);
  };

  /**Customer has selected to cancel deletion */
  const cancelDeletionClicked = () => {
    props.setTrigger(false);
  };

  /**Takes in a customer_id to be sent to the backend for deletion  */
  function deleteCustomer(customerId) {
    const formData = {
      customer_id: customerId
    }
    // Make a fetch request to the deleteCustomer endpoint
    fetch("http://127.0.0.1:5000/deleteCustomer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
    .then((response) => {
      if (response.ok) {
        return response.text(); // Return the response text if the request is successful
      }
      throw new Error("Network response was not ok.");
    })
    .then((data) => {
      // Navigate to manage Customers
      navigate("../ManageCustomers")
    })
    .catch((error) => {
      console.error("Error:", error); // Log any errors that occur
    });
  }

  return props.trigger ? (
    <div className="background">
      <div className="main-container">
        <div className="confirmation-module">
          <div>Delete Customer with email: {props.customerEmail}</div>
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

export default ConfirmCustomerDeletion;
