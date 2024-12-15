from flask import Flask
from flask_cors import CORS
from race import Race

app = Flask(__name__)
CORS(app)
race = Race()

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
    


