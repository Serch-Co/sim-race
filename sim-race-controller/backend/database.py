from pymongo import MongoClient
from pymongo.server_api import ServerApi
import os

url = os.getenv("MONGO_DB_URL")
client = MongoClient(url, server_api=ServerApi('1'))
db = client.sim_race_db

class Database:
    def __init__(self):
        self.db = db

    def read_db(self):
        objs = self.db.sim_info.find()
        objs_list = []
        for obj in objs:
            obj["_id"] = str(obj["_id"])
            objs_list += [obj]
        return objs_list

    ###############
    ## RACE LIST ##
    ###############

    # Read active races by returning a list of active races
    def read_active_races(self):
        races = self.read_db()[0]['races']
        active_races = []
        for race in races:
            if race['active']:
                active_races.append(race)
        return active_races

    ####################
    ## SIMULATOR LIST ##
    ####################

    # Read simulators by returning a list of simulators
    def read_simulators(self):
        database = self.read_db()[0]
        if not 'simulators' in database: return []
        return database['simulators']

    # Add Simulator to list
    def add_to_simulator_list(self, simulator):
        old_simulator_list = self.read_simulators()
        # Create an updated list with the new simulator included
        new_list = old_simulator_list + [simulator]
        # Update the list of simulators
        self.update_simulator_list(new_list)

    # Update simulator list
    def update_simulator_list(self, simulator_list):
        self.db.sim_info.update_one({"name": "sim-race"}, {"$set": {"simulators": simulator_list}})


    ################
    ## SIMULATORS ##
    ################

    # Add simulator
    def add_simulator(self, simulator):
        self.add_to_simulator_list(simulator)


