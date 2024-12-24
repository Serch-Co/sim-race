from database import Database

db = Database()

class Customer:
    def __init__(self):
        pass

    def check_valid_customer_ids(self, sittings):
        return db.check_valid_customer_ids(sittings)
