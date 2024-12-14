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

    # Read races by returning a list of races
    def read_races(self):
        return self.read_db()[0]['races']