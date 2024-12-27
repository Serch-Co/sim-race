from database import Database
from server import Server
import random

db = Database()
server = Server()

class Simulator:
    def __init__(self):
        pass

    ####################
    ## SIMULATOR LIST ##
    ####################

    # read list of simulators
    def read_simulators(self):
        simulators = db.read_simulators()
        return simulators
    
    # Check simulators status
    def check_simulators_status(self):
        server.check_simulators_status(self.read_simulators())

    # Read active simulators
    def read_active_simulators(self):
        return db.read_active_simulators()

    ################
    ## SIMULATORS ##
    ################

    # add simulator
    def add_simulator(self, name, number, ip):
        new_id = random.randint(10**9, 10**10 - 1)
        # Simulator obj
        simulator = {
            'name': name,
            'number': number,
            'ip': ip,
            'port': 5001,
            'id': str('sim_'+str(new_id))
        }
        return db.add_simulator(simulator)

    # Read simulator by id
    def read_simulator(self, sim_id):
        return db.read_simulator(sim_id)
    
    # Update Simulator
    def update_simulator(self, sim_id, updates):
        return db.update_simulator(sim_id, updates)

    # Remove simulator
    def remove_simulator(self, sim_id):
        db.remove_simulator(sim_id)

    # Check simulator Status
    def check_simulator_status(self, sim_id):
        return server.check_simulator_status(sim_id)


