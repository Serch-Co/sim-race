from flask import jsonify
from stripe_api import StripeApi
from database import Database
from race import Race

stripe_api = StripeApi()
db = Database()
race = Race()


class Payment:
    def __init__(self) -> None:
        pass

    #####################
    ## PAYMENT INTENTS ##
    #####################

    # Set up intent for later use
    def setup_payment_intent(self):
        return stripe_api.setup_payment_intent()
    
    # # Create payment intent
    # def create_payment_intent(self, races):
    #     return stripe_api.create_payment_intent(races)

    ##############
    ## PAYMENTS ##
    ##############

    # Read customer payment mehtods available
    def read_customer_payment_methods(self, customer_id):
        payments = []
        for payment in db.read_customer_payment_methods(customer_id):
            try:
                payment_method = stripe_api.retrieve_payment_method(payment['id']) 
                payments.append({
                    'id': payment_method.id,
                    'nick_name': payment['nick_name'],
                    'current' : payment['current'],
                    'type': payment_method.type,
                    'card': {
                        'brand': payment_method.card.brand,
                        'last4': payment_method.card.last4,
                        'exp_month': payment_method.card.exp_month,
                        'exp_year': payment_method.card.exp_year
                    },
                    'billing_details': payment_method.billing_details,
                })
            except Exception as e:
                print(e)
                return jsonify({'error': str(e)}), 400
        return payments

    # Create customer payment method
    def create_customer_payment_method(self, customer_id, payment_method_id, nick_name, current):
        # Attach payment to customer
        stripe_api.attach_payment_to_customer(payment_method_id, customer_id)
        # Add payment to db
        db.create_customer_payment_method(customer_id, payment_method_id, nick_name, current)

    # Update customer card in use
    def update_customer_current_card(self, customer_id, payment_id):
        # Update payment method in subscription in stripe
        stripe_api.update_subscription_payment_method(customer_id, payment_id)
        # Get payments
        payments = self.read_customer_payment_methods(customer_id)
        # Remove the current card
        payments = self.remove_current_card(payments)
        # Update current card
        payments = self.select_current_card(payments, payment_id)
        # Send to db
        db.update_customer_payment_methods(payments, customer_id)
        
    # Remove customer Payment method
    def remove_customer_payment_method(self, customer_id, payment_id):
        stripe_api.remove_customer_payment_method(customer_id, payment_id)

    # Remove current payment from customer
    # turn current property to false inside the payment method object
    def remove_current_card(self, payments):
        for payment in payments:
            if payment['current'] == True:
                payment['current'] = False
        return payments

    # Select current payemnt for customer
    # turn current property of payment_id to true
    def select_current_card(self, payments, payment_id):
        for payment in payments:
            if payment['id'] == payment_id:
                payment['current'] = True
        return payments
    
    # Make Payment
    def add_races_payment(self, customer_id, amount, currency, customer, races):
        races = race.update_customer_race_list(customer_id, races)
        stripe_api.add_races_payment(customer_id, amount, currency, customer, races)