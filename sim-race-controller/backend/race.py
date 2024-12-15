from database import Database

db = Database()

class Race:
    def __init__(self):
        pass

    ###############
    ## RACE LIST ##
    ###############

    # read list of races in the gym
    def read_active_races(self):
        races = db.read_active_races()
        return races

