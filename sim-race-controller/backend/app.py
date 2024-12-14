from flask import Flask
from flask_cors import CORS
from race import Race

app = Flask(__name__)
CORS(app)
race = Race()

###########
## RACES ##
###########

# Read Races
# Used by
# CreateRaces.js
@app.route('/readRaces')
def read_races():
    races = race.read_races()
    return races
    


