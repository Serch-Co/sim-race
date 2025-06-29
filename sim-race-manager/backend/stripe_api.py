import stripe
from flask import jsonify
from database import Database
from util import Util
import os

stripe.api_key = os.getenv('STRIPE_KEY')
db = Database()
util = Util()


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
        
    ###########
    ## RACES ##
    ###########

    # Create Race
    def create_race(self, race):
        print(race)
        # Create in stripe 
        try:
            # Create the race
            product = stripe.Product.create(
                name=race['name'],
                description=race['description'],
                active=True
            )
            # Create a price for month add on
            price = stripe.Price.create(
                product=product.id,
                unit_amount=util.dollar_to_cent(race['price']),  # Price
                currency='usd'
            )
            race['id'] = product.id
            race['price_id'] = price.id
            race['active'] = True
            # Call db to add it
            db.create_race(race)

            return jsonify({
                'product': product,
                'price': price
            }), 200

        except Exception as e:
            print(e)
            return jsonify({'error': str(e)}), 400

    # Update race info
    def update_race(self, updates, race_id, price_change):
        if price_change:
            try:
                # Create a new price for the product
                new_price = stripe.Price.create(
                    unit_amount=util.dollar_to_cent(updates['price']),
                    currency='USD',
                    product=race_id,
                )
                stripe.Price.modify(
                    updates['price_id'],
                    active=False
                )
                updates['price_id'] = new_price.id
                # Update the product fields
                product = stripe.Product.modify(
                    updates['id'],
                    name=updates['name'],
                    description=updates['description'],
                    active=True
                )
                # Add to db
                db.update_race(updates, race_id)
                return new_price
            except Exception as e:
                return {"error": str(e)}
        else:
            try:
                # Update the product annual fields
                product = stripe.Product.modify(
                    updates['id'],
                    name=updates['name'],
                    description=updates['description'],
                    active=True
                )
                # Add to db
                db.update_race(updates, race_id)
                return product
            except Exception as e:
                return {"error": str(e)}

    # remove race by race_id
    def remove_race(self, race_id):
        race = db.read_race_by_id(race_id)
        try:
            if not db.can_remove_race(race_id):
                return False
            # Archive the product
            product = stripe.Product.modify(
                race['id'],
                active=False  # This deactivates the product
            )
            race['active'] = False
            db.update_race(race, race_id)
            return True
        except Exception as e:
            print(str(e))
            return False
        
    # Restore race by race_id
    def restore_race(self, race_id):
        race = db.read_race_by_id(race_id)
        try:
            # Archive the product
            product = stripe.Product.modify(
                race['id'],
                active=True  # This restores the product
            )
            race['active'] = True
            db.update_race(race, race_id)
            return True
        except Exception as e:
            print(str(e))
            return False

    ##############
    ## PAYMENTS ##
    ##############

    # Set up intent for later use
    def setup_payment_intent(self):
        try:
            # Create a SetupIntent
            setup_intent = stripe.SetupIntent.create()
            return jsonify({
                'clientSecret': setup_intent['client_secret']
            })
        except Exception as e:
            return jsonify(error=str(e)), 403

    # # Create Payment
    # def create_payment_intent(self, data):
    #     try:
    #         # Create a PaymentIntent
    #         intent = stripe.PaymentIntent.create(
    #             amount=data['amount'],  # Amount in cents
    #             currency='usd', 
    #             automatic_payment_methods={
    #                 'enabled': True,  # Automatically handle payment methods
    #             },
    #         )
    #         return jsonify({'clientSecret': intent['client_secret']})
    #     except Exception as e:
    #         print(e)
    #         return jsonify({'error': str(e)}), 400


    # Attach payment to customer
    def attach_payment_to_customer(self, payment_method_id, customer_id):
        stripe.PaymentMethod.attach(
                payment_method_id,
                customer=customer_id,
            )

    # Retrieve Payment from stripe
    def retrieve_payment_method(self, payment_id):
        return stripe.PaymentMethod.retrieve(payment_id)
    
    # Remove customer payment method
    def remove_customer_payment_method(self, customer_id, payment_method_id):
        stripe.PaymentMethod.detach(payment_method_id)
        db.remove_customer_payment_method(customer_id, payment_method_id)

    # Update customer payment method in subscription
    def update_subscription_payment_method(self, customer_id, payment_method_id):
        customer = db.read_customer(customer_id)
        # Update the subscription to use the new payment method in stripe
        stripe.Subscription.modify(
            customer['subscription']['id'],
            default_payment_method=payment_method_id
        )
        # Update payment method in database
        customer['subscription']['def_payment_method_id'] = payment_method_id
        db.update_customer(customer, customer_id)

    # Make Payment
    def add_races_payment(self, customer_id, amount, currency, customer, races):
        def_payment_method_id = self.find_def_payment_method_id(customer_id)
        try:
            intent = stripe.PaymentIntent.create(
                amount=amount,
                currency=currency,
                customer=customer_id,
                payment_method=def_payment_method_id,
                off_session=True,
                confirm=True
            )
            updated_customer = customer
            updated_customer['races'] = races
            # Call db to update the customer
            db.update_customer(updated_customer, customer_id)

            return jsonify({"status": "success", "paymentIntent": intent})
        except stripe.error.CardError as e:
            print(e)
            return jsonify({"error": str(e.user_message)}), 400
        except Exception as e:
            print(e)
            return jsonify({"error": str(e)}), 400

    # Find default payment method id
    def find_def_payment_method_id(self, customer_id):
        payments = db.read_customer_payment_methods(customer_id)
        for payment in payments:
            if payment['current']:
                return payment['id']
        
    ###################
    ## SUBSCRIPTIONS ##
    ###################

    # Create Suscription plan
    def create_subscription(self, customer_id, payment_method_id, nickname, current):
        try:
            # Get customer
            customer = db.read_customer(customer_id)
            # Attach payment to customer
            self.attach_payment_to_customer(payment_method_id, customer_id)
            invoice_items = [{
                'price': db.read_subscription_offered()['price_id'],
                'quantity': 1
            }]
            # Create a subscription for recurring payments
            subscription = stripe.Subscription.create(
                customer=customer_id,
                items=invoice_items,
                default_payment_method=payment_method_id,
            )
            # Add Subscription to customer in db
            db.create_subscription(customer_id, payment_method_id, subscription.id, invoice_items[0])
            # Create payment in the db for customer
            db.create_customer_payment_method(customer_id, payment_method_id, nickname, current)
        except Exception as e:
            print(e)
            return jsonify(error=str(e)), 403
        
    
    # Create subscription offered
    def create_subscription_offered(self, price):
        # Create in stripe 
        try:
            # Create the subscription
            subscription_product = stripe.Product.create(
                name='Subscription',
                description='All Access',
                active=True
            )
            # Create a price for subscription
            price_obj = stripe.Price.create(
                product=subscription_product.id,
                unit_amount=int(price),  # Price
                currency='usd',
                recurring={
                    'interval': 'year',
                }
            )
            subscription = {
                'name': 'Subscription',
                'description': 'All Access',
                'product_id': subscription_product.id,
                'price': price,
                'price_id': price_obj.id,
                'active': True
            }
            db.create_subscription_offered(subscription)

            return jsonify({
                'product': subscription_product,
                'price': price
            }), 200

        except Exception as e:
            print(e)
            return jsonify({'error': str(e)}), 400

    # Update subscription offered
    def update_subscription_offered(self, new_price):
        try:
            subs_offered = db.read_subscription_offered()
            # Create a new price for the product
            new_price_obj = stripe.Price.create(
                product=subs_offered['product_id'],
                unit_amount=int(new_price),
                currency='usd',
                recurring={
                    'interval': 'year',
                }
            )
            stripe.Price.modify(
                subs_offered['price_id'],
                active=False
            )
            subs_offered['price_id'] = new_price_obj.id
            subs_offered['price'] = new_price
            # Update the product fields
            product = stripe.Product.modify(
                subs_offered['product_id'],
                name=subs_offered['name'],
                description=subs_offered['description'],
                active=True
            )
            # Add to db
            db.update_subscription_offered(subs_offered)
            return new_price_obj
        except Exception as e:
            print(e)
            return {"error": str(e)}
