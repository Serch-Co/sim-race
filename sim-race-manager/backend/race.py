from database import Database
from stripe_api import StripeApi

db = Database()
stripe_api = StripeApi()

class Race:
    def __init__(self):
        pass

    ###########
    ## RACES ##
    ###########

    # Create race
    def create_race(self, new_race):
        # Create in stripe and get id
        response_race_id = stripe_api.create_race(new_race)
        # race_id = response_race_id[0].json['race_id']
        # Take care of adding the race to respective
        # addOn.add_race_to_add_ons(new_race['addOns'], race_id)
        return response_race_id
    
    # Update race info
    def update_race(self, updates, race_id, price_change):
        stripe_api.update_race(updates, race_id, price_change)

    # remove race by race_id
    def remove_race(self, race_id):
        return stripe_api.remove_race(race_id)


    ###############
    ## RACE LIST ##
    ###############

    # read list of races in the gym
    def read_races(self):
        races = db.read_races()
        return races
    
    ####################
    ## CUSTOMER RACES ##
    ####################

    # Make the customer race list as objects
    def update_customer_race_list(self, customer_id, races):
        # Read current races to merge with new
        customer_races = db.read_customer(customer_id)['races']
        original_dict = {item["id"]: item for item in customer_races}
        # Update original list with customer list
        for race in races:
            if race["id"] in original_dict:
                # Update quantity for existing item
                original_dict[race["id"]]["quantity"] += race["quantity"]
            else:
                # Add new item
                original_dict[race["id"]] = {
                    'id': race['id'],
                    'name': race['name'],
                    'description': race['description'],
                    'quantity': race['quantity']
                }
        return list(original_dict.values())


