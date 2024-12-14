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
    ## CUSTOMERS ##
    ###############

    # Create customer using
    def create_customer(self, customer):
        # Send customer to add it to the list
        self.add_to_customer_list(customer)
        return customer['id']

    # Read customer using customer_id
    def read_customer(self, customer_id):
        for customer in self.read_customers():
            if customer['id'] == customer_id:
                return customer
            
    # Update customer in the customer_list fo the db
    def update_customer(self, updates, customer_id):
        customers = self.read_customers()
        new_customers_list = []
        for customer in customers:
            if customer_id == customer["id"]:
                new_customers_list.append(updates)
            else: 
                new_customers_list.append(customer)
        self.update_customer_list(new_customers_list)

    # Delete customer using customer_id
    def delete_customer(self, customer_id):
        i = 0
        # Loop through customers to find the customer
        for customer in self.read_customers():
            if customer['id'] == customer_id:
                # Remove customer from the list inside the project
                self.remove_from_customer_list(i)
            i += 1

    ###################
    ## CUSTOMER LIST ##
    ###################

    # Read customers by returning a list of customers
    def read_customers(self):
        return self.read_db()[0]['customers']

    # Add customer to the list
    def add_to_customer_list(self, customer):
        old_customer_list = self.read_customers()
        # Create an updated list with the new customer included
        new_list = old_customer_list + [customer]
        # Update the list of customers
        self.update_customer_list(new_list)

    # Update customer list
    def update_customer_list(self, customer_list):
        self.db.sim_info.update_one({"name": "sim-race"}, {"$set": {"customers": customer_list}})

    # Sort customers in the database according to the sort_key 
    def sort_customers(self, sort_key, ascending):
        # Get customers
        customers = self.read_customers()[0]["customers"]
        # list of objects that do have the key
        filter_obj = []
        # list of objects that do not have the key
        no_key = []
        # Assign customers to temporary list within the for loop
        for customer in customers:
            # Add the object to respective list
            if sort_key in customer:
                filter_obj.append(customer)
            else:
                no_key.append(customer)
        # Sort list with respect to the filter object
        sorted_list = sorted(filter_obj, key=lambda x:x[sort_key], reverse=not ascending)
        # Add lists together
        sorted_list = sorted_list + no_key
        # Update the database
        self.update_customer_list(sorted_list)

    # Remove customer from list using index
    def remove_from_customer_list(self, index):
        customer_list = self.read_customers()
        # Make sure not to go out of range
        if index < len(customer_list) and index >= 0:
            # Remove the customer using the index
            del customer_list[index]
        # Update the list of customers without the removed customer
        self.db.sim_info.update_one({"name": "sim-race"}, {"$set": {"customers": customer_list}})

    ###########
    ## RACES ##
    ########### 

    # Create Race
    def create_race(self, race):
        # Send race to the list
        self.add_to_race_list(race)

    # Read race
    def read_race_by_id(self, race_id):
        for race in self.read_races():
            if(race['id'] == race_id):
                return race
    
    # Update race in the race_list fo the db
    def update_race(self, updates, race_id):
        races = self.read_races()
        new_race_list = []
        for race in races:
            if race_id == race["id"]:
                new_race_list.append(updates)
            else: 
                new_race_list.append(race)
        self.update_race_list(new_race_list)
    


    # Checks if an race can be deleted
    def can_remove_race(self, race_id):
        # Loop through customers
        for customer in self.read_customers():
            print(customer)
            # Check if customer has races left
            for race in customer['races']:
                print(race)
                # Return False if found
                if race_id == race:
                    return False
        # return True
        return True


    ###############
    ## RACE LIST ##
    ###############

    # Read races by returning a list of races
    def read_races(self):
        return self.read_db()[0]['races']
    
    # Add race to the list
    def add_to_race_list(self, race):
        # Create an updated list with the new race included
        new_list = self.read_races() + [race]
        # Update the list of races
        self.update_race_list(new_list)

    # Update race list
    def update_race_list(self, race_list):
        self.db.sim_info.update_one({"name": "sim-race"}, {"$set": {"races": race_list}})


    ###########################
    ## SUBSCRIPTION  OFFERED ##
    ###########################

    # Create subscription offered
    def create_subscription_offered(self, subscription):
        self.update_subscription_offered(subscription)

    # Read subscription offered
    def read_subscription_offered(self):
        subscription = self.db.sim_info.find()[0]
        if 'subscription' in subscription:
            return subscription['subscription']
        return []
    
    # Update subscription offered
    def update_subscription_offered(self, subscription):
        self.db.sim_info.update_one({"name": "sim-race"}, {"$set": {"subscription": subscription}})

    ##################
    ## SUBSCRIPTION ##
    ##################

    # Create subscription
    def create_subscription(self, customer_id, payment_method_id, subscription_id, subs_items):
        customer = self.read_customer(customer_id)
        customer['subscription'] = {
            'status': 'Active',
            'def_payment_method_id': payment_method_id,
            'id': subscription_id,
            'items': subs_items
        }
        self.update_customer(customer, customer_id)

    ##############
    ## PAYMENTS ##
    ##############

    # Read customer payments
    def read_customer_payment_methods(self, customer_id):
        return self.read_customer(customer_id)['payments']

    # Create Payment and assign to customer using customer_id
    def create_customer_payment_method(self, customer_id, payment_id, nick_name, current):
        customer = self.read_customer(customer_id)
        payment = {
            'id': payment_id,
            'nick_name': nick_name,
            'current': current
        }
        customer['payments'].append(payment)
        self.update_customer(customer, customer_id)

    # Update Payments for customer
    def update_customer_payment_methods(self, payments, customer_id):
        customer = self.read_customer(customer_id)
        customer['payments'] = payments
        self.update_customer(customer, customer_id)

    # Remove payement method from customer
    def remove_customer_payment_method(self, customer_id, payment_id):
        payments = self.read_customer_payment_methods(customer_id)
        for i in range(0, len(payments)):
            if payments[i]['id'] == payment_id:
                payments.pop(i)
                break
        self.update_customer_payment_methods(payments, customer_id)










