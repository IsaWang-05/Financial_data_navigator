from flask import Flask, render_template, request, jsonify
import pandas as pd

class ExcelReader:
    def __init__(self, filename):
        self.filename = filename

    def read(self, Issuer=None, Symbol=None, Deal_team_contact=None):
        data = pd.read_excel(self.filename, engine='openpyxl')
        
        if Issuer:
            data = data[data['Issuer'].str.contains(Issuer, case=False, na=False)]
        if Symbol:
            data = data[data['Symbol'].str.contains(Symbol, case=False, na=False)]
        if Deal_team_contact:
            data = data[data['Deal_team_contact'].str.contains(Deal_team_contact, case=False, na=False)]

        # show only the newest record for each symbol
        data = data.sort_values('Date', ascending=False).drop_duplicates('Symbol')

        data['Details'] = data.apply(lambda row: f"<a href='#' class='view-details' data-id='{row.name}'>View Details</a>", axis=1)
        return data.to_html(index=False, escape=False)

    def read_hist(self, Symbol):
        data = pd.read_excel(self.filename, engine='openpyxl')
        data = data[data['Symbol'] == Symbol]

        # sort all records by date (earliest to latest)
        data = data.sort_values('Date', ascending=True)

        return data.to_html(index=False, escape=False)


class ExcelNavigatorApp:
    def __init__(self, excel_reader):
        self.app = Flask(__name__)
        self.excel_reader = excel_reader

        @self.app.route('/', methods=['GET'])
        def index():
            Issuer = request.args.get('Issuer')
            Symbol = request.args.get('Symbol')
            Deal_team_contact = request.args.get('Deal_team_contact')

            table_html = self.excel_reader.read(Issuer, Symbol, Deal_team_contact)
            return render_template('index.html', table_html=table_html)

        @self.app.route('/details', methods=['POST'])
               
        def get_details_by_symbol():
            data = request.get_json()
            row_id = data['row_id']

            full_data = pd.read_excel(excel_reader.filename, engine='openpyxl')
            symbol = full_data.iloc[row_id]['Symbol']

            filtered_html_data = excel_reader.read_hist(Symbol=symbol)

            return jsonify(filtered_html_data)


if __name__ == '__main__':
    filepath = './data/starter_db.xlsx'
    excel_reader = ExcelReader(filepath)
    excel_navigator_app = ExcelNavigatorApp(excel_reader)
    excel_navigator_app.app.run(debug=True)
