import stripe
from flask import jsonify
from database import Database
import os

stripe.api_key = os.getenv('STRIPE_KEY')
db = Database()


class StripeApi:
    def __init__(self) -> None:
        pass


    ###############
    ## CUSTOMERS ##
    ###############

    # Create Customer
    def create_customer(self, customer):
        try:
            new_customer = stripe.Customer.create(
                name=customer['first_name']+' '+customer['last_name'],
                email=customer['email']
            )
            # Assign corresponding id
            customer['id'] = new_customer['id']
            return jsonify({'customer_id': db.create_customer(customer)}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 400
        
    # Update customer
    def update_customer(self, updates, customer_id):
        try:
            updated_customer = stripe.Customer.modify(
                customer_id,
                email=updates['email'],
                name=updates['first_name']+' '+updates['last_name']
            )
            db.update_customer(updates, customer_id)
            return jsonify({'updated_customer': updated_customer}), 200
        except Exception as e:
            return jsonify(error=str(e)), 400
        
    # Delete customer
    def delete_customer(self, customer_id):
        try:
            deleted_customer = stripe.Customer.delete(customer_id)
            db.delete_customer(customer_id)
            return jsonify({'deleted_customer': deleted_customer}), 200
        except Exception as e:
            return jsonify(error=str(e)), 400



