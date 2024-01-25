import pandas as pd

def read_excel(file_path):
    return pd.read_excel(file_path)

def join_data():
    # Paths
    contact_path = './data/Contact.xlsx'
    fund_path = './data/Fund.xlsx'
    historical_path = './data/Historical_Data.xlsx'
    vpm_path = './data/VPM.xlsx'

    # Reading from Excel files
    contact_df = read_excel(contact_path)
    fund_df = read_excel(fund_path)
    historical_df = read_excel(historical_path)
    vpm_df = read_excel(vpm_path)
    
    # Merging the 4
    vpm_historical_df = pd.merge(vpm_df, historical_df, on='Symbol', how='inner')
    vpm_historical_contact_df = pd.merge(vpm_historical_df, contact_df, on='Issuer', how='inner')
    final_df = pd.merge(vpm_historical_contact_df, fund_df, on='Symbol', how='inner')
    
    # Selecting the needed columns
    final_columns = ['Issuer', 'Symbol', 'Fund', 'Deal_Team_Contact', 'Price', 'Unobservable_input', 'Unobservable_val', 'Date']
    final_data = final_df[final_columns]
    
    return final_data

def get_all_data():
    # Read, Join the data
    joined_data = join_data()
    # Render to html
    return joined_data.to_html(classes='table table-striped')
