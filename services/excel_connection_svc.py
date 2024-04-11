import pandas as pd

# Global paths for data files
CONTACT_PATH = './data/Contact.xlsx'
FUND_PATH = './data/Fund.xlsx'
HISTORICAL_PATH = './data/Historical_Data.xlsx'
VPM_PATH = './data/VPM.xlsx'

class ExcelReader:
    def read(self, file_path):
        return pd.read_excel(file_path)

class ContactDataProcessor:
    def __init__(self, file_path):
        self.file_path = file_path
        self.reader = ExcelReader()

    def process(self):
        contact_df = self.reader.read(self.file_path)
        contact_df['Deal_Team_Contact'] = contact_df.groupby('Issuer')['Deal_Team_Contact'].transform(lambda x: ', '.join(x.unique()))
        return contact_df.drop_duplicates(subset='Issuer')

class FundDataProcessor:
    def __init__(self, file_path):
        self.file_path = file_path
        self.reader = ExcelReader()

    def process(self):
        fund_df = self.reader.read(self.file_path)
        fund_df['Fund'] = fund_df.groupby('Symbol')['Fund'].transform(lambda x: ', '.join(x.unique()))
        return fund_df.drop_duplicates(subset='Symbol')

class DataMerger:
    def __init__(self, contact_processor, fund_processor, historical_path, vpm_path):
        self.contact_processor = contact_processor
        self.fund_processor = fund_processor
        self.historical_path = historical_path
        self.vpm_path = vpm_path
        self.reader = ExcelReader()

    def merge_data(self):
        contact_df = self.contact_processor.process()
        fund_df = self.fund_processor.process()
        historical_df = self.reader.read(self.historical_path)
        vpm_df = self.reader.read(self.vpm_path)

        merged_df = pd.merge(historical_df, vpm_df, on='Symbol', how='left')
        merged_df = pd.merge(merged_df, contact_df, on='Issuer', how='left')
        merged_df = pd.merge(merged_df, fund_df, on='Symbol', how='left')

        return self._select_columns(merged_df)

    def _select_columns(self, df):
        final_columns = ['Issuer', 'Symbol', 'Fund', 'Deal_Team_Contact', 'Price', 'Unobservable_input', 'Unobservable_val', 'Date']
        final_data = df[final_columns]
        final_data['Date'] = pd.to_datetime(final_data['Date'])
        return final_data

class ExcelUploader:
    def __init__(self):
        self.historical_data_path = HISTORICAL_PATH

    def upload_and_update(self, file_stream):
        # Load the historical data
        historical_df = pd.read_excel(self.historical_data_path)
        # Load the uploaded data
        new_data_df = pd.read_excel(file_stream)

        # Merging data with preference to 'new_data_df'
        combined_df = pd.concat([historical_df, new_data_df]).drop_duplicates(
            subset=['Symbol', 'Date'], keep='last')

        # Count stats for feedback
        total_rows_written = new_data_df.shape[0]
        rows_overwritten = total_rows_written - (combined_df.shape[0] - historical_df.shape[0])

        # Write back to the Excel file
        combined_df.to_excel(self.historical_data_path, index=False)

        return {"total_rows": total_rows_written, "rows_overwritten": rows_overwritten}

def get_all_data():
    contact_processor = ContactDataProcessor(CONTACT_PATH)
    fund_processor = FundDataProcessor(FUND_PATH)
    merger = DataMerger(contact_processor, fund_processor, HISTORICAL_PATH, VPM_PATH)

    return merger.merge_data()
