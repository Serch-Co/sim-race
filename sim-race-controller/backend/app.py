from flask import Flask, request
from flask_cors import CORS
from race import Race
from simulator import Simulator

app = Flask(__name__)
CORS(app)
race = Race()
simulator = Simulator()

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

################
## SIMULATORS ##
################

# Add Simulator
# Used by
# AddSimulator.js
@app.route('/addSimulator', methods=['POST'])
def add_simulator():
    data = request.json
    simulator.add_simulator(data['name'], data['number'], data['ip'])
    return {"message":'Data recieved successfully!'}, 200

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
    simulator.update_simulator(data['sim_id'], data['updates'])
    return "Simulator Updated!",200
