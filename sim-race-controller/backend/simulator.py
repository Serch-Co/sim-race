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
            'sim_id': new_id
        }
        db.add_simulator(simulator)

