from stripe_api import StripeApi

stripe_api = StripeApi()



class Payment:
    def __init__(self) -> None:
        pass


    # Set up intent for later use
    def setup_payment_intent(self):
        return stripe_api.setup_payment_intent()


