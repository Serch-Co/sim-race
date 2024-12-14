from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import qrcode
from io import BytesIO
from customer import Customer
from payment import Payment
from subscription import Subscription
from race import Race

app = Flask(__name__)
CORS(app)
customer = Customer()
payment = Payment()
subscription = Subscription()
race = Race()

##############
## CUSTOMER ##
##############

# Create customer
# Used by 
# CreateCustomer.js
@app.route("/createCustomer", methods=["POST"])
def createCustomer():
    data = request.get_json()
    return customer.create_customer(data)

# Read customer by id
# Used by
# Customer.js
@app.route("/readCustomer", methods=['GET'])
def read_customer():
    customer_id = request.args.get('customer_id')
    return customer.read_customer(customer_id), 200

# Update Customer
# Used by
# Customer.js
@app.route("/updateCustomer", methods=["POST"])
def update_customer():
    data = request.get_json()
    updates = data['updates']
    customer_id = data['customer_id']
    customer.update_customer(updates, customer_id)
    return "Customer Updated!",200

# Delete Customer using the customer_id
# Used by
# ConfirmCustomerDeletion.js
@app.route("/deleteCustomer", methods=["POST"])
def delete_customer():
    data = request.get_json()
    customer.delete_customer(data['customer_id'])
    return "Customer deleted!",200


##################
# CUSTOMER LIST ##
##################

# Read Customers
# Used by
# ManageCustomers.js
@app.route("/readCustomers")
def read_customers():
    # call backend to read list of customers
    customers = customer.read_customers()
    return customers

# Sort customer list depending on what the key is
# Used by
# ManageCustomers.js
@app.route("/sortCustomers", methods=["POST"])
def sort_customers():
    data = request.get_json()
    customer.sort_customers(data["sort_key"], data["ascending"])
    return {"message": "Data received succesfully"}, 200

##########
## RACE ##
##########

# Create Race
# Used by
# CreateRace.js
@app.route("/createRace", methods=["POST"])
def create_race():
    data = request.get_json()
    return race.create_race(data['new_race'])

# Update race
# Used by
# Race.js
@app.route("/updateRace", methods=["POST"])
def update_race():
    data = request.get_json()
    updates = data['updated_race']
    race.update_race(updates, updates['id'], data['price_change'])
    return "Race Updated!",200

# remove Race using the race_id
# Used by 
# ConfirmRaceDeletion.js
@app.route("/removeRace", methods=["POST"])
def remove_race():
    data = request.get_json()
    success = race.remove_race(data['race_id'])
    if success: return "race removed!",200
    else: return jsonify({'error': 'The race could not be removed!'}), 400

# restore Race using the race_id
# Used by 
# ConfirmRaceRestoration.js
@app.route("/restoreRace", methods=["POST"])
def restore_race():
    data = request.get_json()
    success = race.restore_race(data['race_id'])
    if success: return "race restored!",200
    else: return jsonify({'error': 'The race could not be removed!'}), 400


###############
## RACE LIST ##
###############

# Read Races
# Used by
# CustomerRaces.js
# ManageRaces.js
@app.route('/readRaces')
def read_races():
    races = race.read_races()
    return races



##############
## PAYMENTS ##
##############

# Read payments from customer
# Used by
# ManagePayments.js
@app.route('/readCustomerPaymentMethods', methods=['POST'])
def read_customer_payment_methods():
    data = request.json
    return payment.read_customer_payment_methods(data['customer_id']), 200

# Create payment for customer
# Used by
# CreatePayment.js
@app.route('/createCustomerPaymentMethod', methods=['POST'])
def create_customer_payment_method():
    data = request.json
    payment.create_customer_payment_method(data['customer_id'], data['payment_method_id'], data['nick_name'], data['current'])
    return {"message": "Data received succesfully"}, 200

# Update current customer Card
# Used by
# Card.js
@app.route('/updateCustomerCurrentCard', methods=['POST'])
def update_customer_current_card():
    data = request.json
    payment.update_customer_current_card(data['customer_id'], data['payment_id'])
    return {"message": "Data received succesfully"}, 200

# Remove Payment
# Used by
# Card.js
@app.route('/removeCustomerPaymentMethod', methods=['POST'])
def remove_customer_payment_method():
    data = request.json
    payment.remove_customer_payment_method(data['customer_id'], data['payment_id'])
    return {"message": "Data received succesfully"}, 200

# Make Payment for Races
# Used by 
# AddRaces.js
@app.route('/addRacesPayment', methods=['POST'])
def add_races_payment():
    data = request.json
    payment.add_races_payment(
        data['customer_id'],
        data['amount'],
        data['currency'],
        data['customer'],
        data['races']
    )
    return {"message": "Data received succesfully"}, 200

#####################
## PAYMENT INTENTS ##
#####################

# Setup Payment intent for future use
# Used by
# CreatePayment.js
# CheckoutForm.js
@app.route('/setUpPaymentIntent', methods=['POST'])
def setup_payment_intent():
    return payment.setup_payment_intent()

##################
## SUBSCRIPTION ##
##################

# Create suscription
# Used by
# CheckoutForm.js
@app.route('/createSubscription', methods=['POST'])
def create_subscription():
    data = request.json
    subscription.create_subscription(
        data['customer_id'],
        data['payment_method_id'],
        data['nick_name'],
        data['current']
    )
    return {"message": "Data received succesfully"}, 200

# Read subscription offered
# Used by
# CreateCustomer.js
# ManageSubscription.js
@app.route('/readSubscriptionOffered')
def read_subscription_offered():
    subs = subscription.read_subscription_offered()
    return subs

# Update subscription offered
# Used by
# ManageSubscription.js
@app.route('/updateSubscriptionOffered', methods=['POST'])
def update_subcription_offered():
    data = request.json
    subscription.update_subscription_offered(data['price'])
    return {"message": "Data received succesfully"}, 200

#############
## QR CODE ##
#############

# Generate QRCode
# Used by
# Customer.js
@app.route('/generateQR', methods=['POST'])
def generate_qrcode():
    data = request.json.get('customer_id')
    
    if not data:
        return jsonify({"error": "Customer ID is required"}), 400

    # Create QR code
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill='black', back_color='white')

    # Convert image to byte stream
    img_io = BytesIO()
    img.save(img_io, 'PNG')
    img_io.seek(0)

    return send_file(img_io, mimetype='image/png')