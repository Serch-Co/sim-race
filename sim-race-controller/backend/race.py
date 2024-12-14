from database import Database

db = Database()

class Race:
    def __init__(self):
        pass

    ###############
    ## RACE LIST ##
    ###############

    # read list of races in the gym
    def read_races(self):
        races = db.read_races()
        return races

