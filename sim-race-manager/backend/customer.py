from util import Util
from stripe_api import StripeApi
from database import Database
from dateutil.relativedelta import relativedelta

util = Util()
stripe_api = StripeApi()
db = Database()




class Customer:
    def __init__(self) -> None:
        pass

    ##############
    ## CUSTOMER ##
    ##############

    # Create Customer
    def create_customer(self, new_customer):
        # Adding starting Date
        new_customer['startDate'] = util.get_todays_date()
        # Calculate age
        new_customer['age'] = self.calculate_customer_age(new_customer)
        # Create in stripe and get id
        response_customer_id = stripe_api.create_customer(new_customer)
        # customer_id = response_customer_id[0].json['customer_id']
        # Take care of adding the customer to respective add ons
        # addOn.add_customer_to_add_ons(new_customer['addOns'], customer_id)
        return response_customer_id
    
    # read customer by id
    def read_customer(self,customer_id):
        return db.read_customer(customer_id)
    
    # Update customer info
    def update_customer(self, updates, customer_id):
        updated_items = self.get_actual_updates(updates)
        customer = self.read_customer(customer_id)
        for key in customer:
            if key in updated_items:
                customer[key] = updated_items[key]
        # Calculate age
        customer['age'] = self.calculate_customer_age(customer)
        stripe_api.update_customer(customer, customer_id)

    # Delete customer by customer_id
    def delete_customer(self, customer_id):
        # TODO
        # Check if customer does not have races left
        stripe_api.delete_customer(customer_id)


    ###################
    ## CUSTOMER LIST ##
    ###################

    # read list of customers    
    def read_customers(self):
        customers = db.read_customers()
        return customers
    
    # Sort customers according to the key
    def sort_customers(self, sort_key, ascending):
        db.sort_customers(sort_key, ascending)





    #############
    ## HELPERS ##
    #############

    def calculate_customer_age(self, customer):
        # Todays date
        _, currentDate = util.get_todays_date()
        # Cast to number
        yearDate = int(customer['birthdate'][0]['year'])
        monthDate = int(customer['birthdate'][0]['month'])
        dayDate = int(customer['birthdate'][0]['day'])
        # Assign to customer obj
        customer['birthdate'][0]['year'] = yearDate
        customer['birthdate'][0]['month'] = monthDate
        customer['birthdate'][0]['day'] = dayDate
        # DoB date Object
        date_string = str(yearDate) + '-' + str(monthDate) + '-' + str(dayDate) + ' 00:00:00'
        customer['birthdate'][1] = util.create_datetime(date_string, '%Y-%m-%d %H:%M:%S')
        # Calculate the difference from customers DoB timestamp
        time_difference = relativedelta(currentDate, customer['birthdate'][1])
        # Return only the years
        return time_difference.years
    
    # Get actual updates for customer
    def get_actual_updates(self, updates):
        actual = updates.copy()
        for key in updates:
            if not updates[key]:
                actual.pop(key)
        return actual