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
@app.route("/createCustomer", methods=["POST"])
def createCustomer():
    data = request.get_json()
    return customer.create_customer(data)

# Read customer by id
@app.route("/readCustomer", methods=['GET'])
def read_customer():
    customer_id = request.args.get('customer_id')
    return customer.read_customer(customer_id), 200

# Update Customer
@app.route("/updateCustomer", methods=["POST"])
def update_customer():
    data = request.get_json()
    updates = data['updates']
    customer_id = data['customer_id']
    customer.update_customer(updates, customer_id)
    return "Customer Updated!",200

# Delete Customer using the customer_id
@app.route("/deleteCustomer", methods=["POST"])
def delete_customer():
    data = request.get_json()
    customer.delete_customer(data['customer_id'])
    return "Customer deleted!",200


##################
# CUSTOMER LIST ##
##################

# Read Customers
@app.route("/readCustomers")
def read_customers():
    # call backend to read list of customers
    customers = customer.read_customers()
    return customers

# Sort customer list depending on what the key is
@app.route("/sortCustomers", methods=["POST"])
def sort_customers():
    data = request.get_json()
    customer.sort_customers(data["sort_key"], data["ascending"])
    return {"message": "Data received succesfully"}, 200

##########
## RACE ##
##########

# Create Race
@app.route("/createRace", methods=["POST"])
def create_race():
    data = request.get_json()
    return race.create_race(data['new_race'])

# Update race
@app.route("/updateRace", methods=["POST"])
def update_race():
    data = request.get_json()
    updates = data['updated_race']
    race.update_race(updates, updates['id'], data['price_change'])
    return "Race Updated!",200

# remove Race using the race_id
@app.route("/removeRace", methods=["POST"])
def remove_race():
    data = request.get_json()
    success = race.remove_race(data['race_id'])
    if success: return "race removed!",200
    else: return jsonify({'error': 'The race could not be removed!'}), 400



###############
## RACE LIST ##
###############

# Read Races
@app.route('/readRaces')
def read_races():
    races = race.read_races()
    return races



##############
## PAYMENTS ##
##############

# Read payments from customer
@app.route('/readCustomerPaymentMethods', methods=['POST'])
def read_customer_payment_methods():
    data = request.json
    return payment.read_customer_payment_methods(data['customer_id']), 200

# Create payment for customer
@app.route('/createCustomerPaymentMethod', methods=['POST'])
def create_customer_payment_method():
    data = request.json
    payment.create_customer_payment_method(data['customer_id'], data['payment_method_id'], data['nick_name'], data['current'])
    return {"message": "Data received succesfully"}, 200

# Update current customer Card
@app.route('/updateCustomerCurrentCard', methods=['POST'])
def update_customer_current_card():
    data = request.json
    payment.update_customer_current_card(data['customer_id'], data['payment_id'])
    return {"message": "Data received succesfully"}, 200

# Remove Payment
@app.route('/removeCustomerPaymentMethod', methods=['POST'])
def remove_customer_payment_method():
    data = request.json
    payment.remove_customer_payment_method(data['customer_id'], data['payment_id'])
    return {"message": "Data received succesfully"}, 200
    
# Setup Payment intent for future use
@app.route('/setUpPaymentIntent', methods=['POST'])
def setup_payment_intent():
    return payment.setup_payment_intent()

# Create payment intent
@app.route('/createPaymentIntent', methods=['POST'])
def create_payment_intent():
    data = request.json
    print(data)
    return payment.create_payment_intent(data['races'])



##################
## SUBSCRIPTION ##
##################

# Create suscription
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
@app.route('/readSubscriptionOffered')
def read_subscription_offered():
    subs = subscription.read_subscription_offered()
    return subs

# Update subscription offered
@app.route('/updateSubscriptionOffered', methods=['POST'])
def update_subcription_offered():
    data = request.json
    subscription.update_subscription_offered(data['price'])
    return {"message": "Data received succesfully"}, 200

#############
## QR CODE ##
#############

# Generate QRCode
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