from database import Database

db = Database()

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

