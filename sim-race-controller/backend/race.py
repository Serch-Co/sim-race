from database import Database

db = Database()

class Race:
    def __init__(self):
        pass

    ###############
    ## RACE LIST ##
    ###############

    # read list of races
    def read_active_races(self):
        races = db.read_active_races()
        return races

