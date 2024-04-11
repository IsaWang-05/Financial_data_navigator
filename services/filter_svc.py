import pandas as pd

class DataFilter:
    @staticmethod
    def filter_data(data, Issuer=None, Symbol=None, filter_date=None):
        if Issuer:
            data = data[data['Issuer'].str.contains(Issuer, case=False, na=False)]
        if Symbol:
            data = data[data['Symbol'].str.contains(Symbol, case=False, na=False)]
        if filter_date:
            filter_date = pd.to_datetime(filter_date)
            data = data[data['Date'] <= filter_date]
        return data

    @staticmethod
    def filter_for_details(data, Symbol, filter_date=None):
        data = data[data['Symbol'] == Symbol]
        '''
        if filter_date:
            filter_date = pd.to_datetime(filter_date)
            data = data[data['Date'] <= filter_date]
        '''
        return data.sort_values('Date', ascending=True)
