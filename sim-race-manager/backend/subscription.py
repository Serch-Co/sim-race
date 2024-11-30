from stripe_api import StripeApi
from database import Database

stripe_api = StripeApi()
db = Database()


class Subscription:
    def __init__(self):
        pass

    # Read subscription offered
    def read_subscription_offered(self):
        return db.read_subscription_offered()
    
    # Update subscription offered
    def update_subscription_offered(self, new_price):
        # Check if first change
        if self.read_subscription_offered() == []:
            # create subscription offered in stripe
            stripe_api.create_subscription_offered(new_price)
        else:
            # update subscription offered in stripe
            stripe_api.update_subscription_offered(new_price)

    # Create subscription
    def create_subscription(self, customer_id, payment_method_id, nickname, current):
        stripe_api.create_subscription(customer_id, payment_method_id, nickname, current)
