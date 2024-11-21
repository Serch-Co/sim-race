from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import qrcode
from io import BytesIO
from customer import Customer

app = Flask(__name__)
CORS(app)
customer = Customer()



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