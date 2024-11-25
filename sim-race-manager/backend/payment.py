from stripe_api import StripeApi

stripe_api = StripeApi()



class Payment:
    def __init__(self) -> None:
        pass

    #####################
    ## PAYMENT INTENTS ##
    #####################

    # Set up intent for later use
    def setup_payment_intent(self):
        return stripe_api.setup_payment_intent()
    
    # Create payment intent
    def create_payment_intent(self, races):
        return stripe_api.create_payment_intent(races)


