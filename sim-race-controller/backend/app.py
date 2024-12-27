from flask import Flask, request, jsonify
from flask_cors import CORS
from race import Race
from simulator import Simulator
from customer import Customer

app = Flask(__name__)
CORS(app)
race = Race()
simulator = Simulator()
customer = Customer()

###############
## RACE LIST ##
###############

# Read Active Races
# Used by
# CreateRaces.js
@app.route('/readActiveRaces')
def read_active_races():
    races = race.read_active_races()
    return races

###############
## CUSTOMERS ##
###############

# Check valid customer IDS
# Used by
# AssignSittings.js
@app.route('/checkValidCustomerIDs', methods=['POST'])
def check_valid_customer_ids():
    data = request.json
    valid_ids = customer.check_valid_customer_ids(data['sittings'])
    if valid_ids:
        print('valid ids')
        return {"success": True}, 200
    print('invalid ids')
    return {'success': False}, 200

####################
## SIMULATOR LIST ##
####################

# Read Simulators
# Used by 
# ManageSimulators.js
@app.route('/readSimulators')
def read_simulators():
    simulators = simulator.read_simulators()
    return simulators

# Check simulators status
# Used by
# MangeSimulators.js
@app.route('/checkSimulatorsStatus', methods=['POST'])
def check_simulators_status():
    simulator.check_simulators_status()
    return {"message":'Data recieved successfully!'}, 200

# Read active Simulators
# Used by 
# AssingSittings.js
@app.route('/readActiveSimulators')
def read_active_simulators():
    return simulator.read_active_simulators()

################
## SIMULATORS ##
################

# Add Simulator
# Used by
# AddSimulator.js
@app.route('/addSimulator', methods=['POST'])
def add_simulator():
    data = request.json
    success, message = simulator.add_simulator(data['name'], data['number'], data['ip'])
    return_ob = {}
    return_ob['message'] = message
    if success: 
        return_ob['success'] = True
    else:
        return_ob['success'] = False
    return jsonify(return_ob), 200

# Read Simulator
# Used by
# Simulator.js
@app.route("/readSimulator", methods=['GET'])
def read_simulator():
    sim_id = request.args.get('sim_id')
    return simulator.read_simulator(sim_id), 200

# Update Simulator
# Used by
# Simulator.js
@app.route("/updateSimulator", methods=['POST'])
def update_simulator():
    data = request.json
    success, message = simulator.update_simulator(data['sim_id'], data['updates'])
    return_ob = {}
    return_ob['message'] = message
    if success:
        return_ob['success'] = True
    else:
        return_ob['success'] = False
    return jsonify(return_ob),200

# Remove Simulator
# Used by
# ConfirmSimulatorDeletion.js
@app.route("/removeSimulator", methods=['POST'])
def remove_simulator():
    data = request.json
    simulator.remove_simulator(data['sim_id'])
    return "Simulator Removed!",200

# Check Simulator Status
# Used by
# Simulator.js
@app.route("/checkSimulatorStatus")
def check_simulator_status():
    sim_id = request.args.get('sim_id')
    return simulator.check_simulator_status(sim_id), 200