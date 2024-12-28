from database import Database
from server import Server

db = Database()
server = Server()

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

    ###################
    ## RACE SESSIONS ##
    ###################

    def create_rfactor_2_session(self, session_settings, sittings):
        return server.create_rfactor_2_session(session_settings, sittings)
        
