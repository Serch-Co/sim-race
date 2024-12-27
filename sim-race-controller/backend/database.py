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

    # Remove simulator from list using index
    def remove_from_simulator_list(self, index):
        simulator_list = self.read_simulators()
        # Make sure not to go out of range
        if index < len(simulator_list) and index >= 0:
            # Remove the simulator using the index
            del simulator_list[index]
        # Update the list of simulators with the new changes
        self.update_simulator_list(simulator_list)

    # read active simulators
    def read_active_simulators(self):
        active_sims = []
        for simulator in self.read_simulators():
            if simulator['status']:
                active_sims.append(simulator)
        return active_sims

    ################
    ## SIMULATORS ##
    ################

    # Add simulator
    def add_simulator(self, simulator):
        # Check unique port for each simulator
        for sim in self.read_simulators():
            if sim['ip'] == simulator['ip']:
                return False, "IP is in use"
            if sim['port'] == simulator['port']:
                return False, "Port is in use"
        self.add_to_simulator_list(simulator)
        return True, "Success adding simulator"

    # Read simulator by id
    def read_simulator(self, sim_id):
        for simulator in self.read_simulators():
            if simulator['id'] == sim_id:
                return simulator

    # update simulator
    def update_simulator(self, sim_id, updates):
        simulators = self.read_simulators()
        new_simulators_list = []
        ip_list = []
        port_list = []
        for simulator in simulators:
            # Check for repetings ip & ports
            # Chek which sim to update
            if sim_id == simulator["id"]:
                if updates['ip'] in ip_list:
                    return False, "IP in use"
                if updates['port'] in port_list:
                    return False, "Port in use"
                new_simulators_list.append(updates)
                ip_list.append(updates['ip'])
                port_list.append(updates['port'])
            else: 
                new_simulators_list.append(simulator)
                ip_list.append(simulator['ip'])
                port_list.append(simulator['port'])
            
        self.update_simulator_list(new_simulators_list)
        return True, "Success updating simulator"

    # Remove simulator
    def remove_simulator(self, sim_id):
        i = 0
        # Loop through simulators to find the simulator
        for simulator in self.read_simulators():
            if simulator['id'] == sim_id:
                # Remove simulator from the list
                self.remove_from_simulator_list(i)
            i += 1

    ###############
    ## CUSTOMERS ##
    ###############
    
    # customer exists by id
    def find_customer(self, customer_id):
        for customer in self.read_db()[0]['customers']:
            if customer['id'] == customer_id:
                return True
        return False

    # Check valid customer ids
    def check_valid_customer_ids(self, sittings):
        for sitting in sittings:
            if not self.find_customer(sitting['customer_id']):
                print(sitting['customer_id'],'does not exist')
                return False
        print(sittings)
        return True