from flask import Flask
from flask_cors import CORS
from race import Race
from simulator import Simulator

app = Flask(__name__)
CORS(app)
race = Race()
simulator = Simulator()

###########
## RACES ##
###########

# Read Active Races
# Used by
# CreateRaces.js
@app.route('/readActiveRaces')
def read_active_races():
    races = race.read_active_races()
    return races
    
################
## SIMULATORS ##
################

# Read Simulators
# Used by 
# ManageSimulators.js
@app.route('/readSimulators')
def read_simulators():
    simulators = simulator.read_simulators()
    return simulators


