import datetime

class Util:
    def __init__(self) -> None:
        pass
            
    def get_todays_date(self):
        # Get current Date
        timeStamp = datetime.datetime.now()
        month = timeStamp.strftime('%m')
        day = timeStamp.strftime('%d')
        year = timeStamp.strftime('%Y')
        date = {
            "month": int(month),
            "day": int(day),
            "year": int(year)
        }
        return date, timeStamp

    def create_datetime(self, date_string, date_format):
        date = datetime.datetime.strptime(date_string, date_format)
        return date

    def dollar_to_cent(self, amount):
        return amount * 100
    
    def cent_to_dollar(self, amount):
        return amount / 100