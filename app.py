from flask import Flask, render_template, request, jsonify
import pandas as pd

class ExcelReader:
    def __init__(self, filename):
        self.filename = filename

    def read_partial(self, issuer=None, symbol=None, deal_team_contact=None):
        data = pd.read_excel(self.filename, engine='openpyxl', usecols=['issuer', 'symbol', 'fund', 'deal_team_contact', 'curr_price_1'])
        
        if issuer:
            data = data[data['issuer'].str.contains(issuer, case=False, na=False)]
        if symbol:
            data = data[data['symbol'].str.contains(symbol, case=False, na=False)]
        if deal_team_contact:
            data = data[data['deal_team_contact'].str.contains(deal_team_contact, case=False, na=False)]

        data['Details'] = data.apply(lambda row: f"<a href='#' class='view-details' data-id='{row.name}'>View Details</a>", axis=1)
        return data.to_html(index=False, escape=False)

    def read_full(self, row_id):
        data = pd.read_excel(self.filename, engine='openpyxl')
        row_data = data.iloc[[row_id]]
        return row_data.to_html(index=False)

class ExcelNavigatorApp:
    def __init__(self, excel_reader):
        self.app = Flask(__name__)
        self.excel_reader = excel_reader

        @self.app.route('/', methods=['GET'])
        def index():
            issuer = request.args.get('issuer')
            symbol = request.args.get('symbol')
            deal_team_contact = request.args.get('deal_team_contact')

            table_html = self.excel_reader.read_partial(issuer, symbol, deal_team_contact)
            return render_template('index.html', table_html=table_html)

        @self.app.route('/details', methods=['POST'])
        def details():
            row_id = request.json.get('row_id')
            full_data = self.excel_reader.read_full(int(row_id))
            return jsonify(full_data)

if __name__ == '__main__':
    filepath = './data/starter_db.xlsx'
    excel_reader = ExcelReader(filepath)
    excel_navigator_app = ExcelNavigatorApp(excel_reader)
    excel_navigator_app.app.run(debug=True)
