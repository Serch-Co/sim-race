import React from 'react';
import './styles/Card.css'; 

const Card = ({ 
	customer,
	objID,
	nickName,
	name,
	cardBrand,
	cardLast4,
	cardExpMonth,
	cardExpYear,
	current
}) => {
	
	const deleteCard = () => {
		try {
			fetch("http://127.0.0.1:5000/removeCustomerPaymentMethod", {
				method: "POST",
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					customer_id: customer['id'],
					payment_id: objID
				})
			})
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				window.location.reload()
				return response.json();
			})
			.catch((error) => {
				console.error("Error removing PaymentMethod:", error.message);
			});
		} catch (error) {
			console.error("Error removing PaymentMethod:", error.message);
		}
	}

	const selectCurrentCard = () => {
        try {
            fetch("http://127.0.0.1:5000/updateCustomerCurrentCard", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
					customer_id: customer['id'],
					payment_id: objID
				})
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
				window.location.reload()
                return response.json();
            })
            .catch((error) => {
                console.error("Error updating current Card:", error.message);
            });
        } catch (error) {
            console.error("Error updating current Card:", error.message);
        }
    }
	
	return (current) ? (
		<div className="card">
			<div className="card-current">
				<div className="card-info-line">
					<h2>{nickName}</h2>
				</div>
				<div className="card-info-line">
					<p>{name}</p>
					<p>{cardBrand}</p>
				</div>
				<div className="card-info-line">
					<p>**** {cardLast4}</p>
					<p>{cardExpMonth} / {cardExpYear}</p>
				</div>
			</div>
		</div>
	) : (
		<div className="card">
			<div className="card-content">
				<div className="card-info-line">
					<h2>{nickName}</h2>
					<button className="make-curr-btn" onClick={selectCurrentCard}>Make Current</button>
					<button className="delete-btn" onClick={deleteCard}>delete</button>
				</div>
				<div className="card-info-line">
					<p>{name}</p>
					<p>{cardBrand}</p>
				</div>
				<div className="card-info-line">
					<p>**** {cardLast4}</p>
					<p>{cardExpMonth} / {cardExpYear}</p>
				</div>
			</div>
		</div>
	);
};

export default Card;
