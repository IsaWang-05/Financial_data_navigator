from flask import Flask, render_template, request, jsonify
from services.excel_connection_svc import get_all_data, ExcelUploader
from services.filter_svc import DataFilter

class ExcelReader:
    def read(self, Issuer=None, Symbol=None, filter_date=None):
        data = get_all_data()
        filtered_data = DataFilter.filter_data(data, Issuer, Symbol, filter_date)
        filtered_data['Details'] = filtered_data.apply(lambda row: f"<a href='#' class='view-details' data-symbol='{row['Symbol']}'>View Details</a>", axis=1)
        filtered_data = filtered_data.sort_values('Date', ascending=False).drop_duplicates('Symbol')
        return filtered_data.to_html(index=False, escape=False)

    def read_hist(self, Symbol, filter_date=None):
        data = get_all_data()
        filtered_data = DataFilter.filter_for_details(data, Symbol, filter_date)
        return filtered_data.to_html(index=False, escape=False)

class ExcelNavigatorApp:
    def __init__(self):
        self.app = Flask(__name__)
        self.excel_reader = ExcelReader()

        self.app.route('/', methods=['GET'])(self.index)
        self.app.route('/details', methods=['POST'])(self.get_details_by_symbol)
        self.app.route('/upload', methods=['POST'])(self.upload_file)

    def index(self):
        Issuer = request.args.get('Issuer')
        Symbol = request.args.get('Symbol')
        filter_date = request.args.get('filter_date')
        table_html = self.excel_reader.read(Issuer, Symbol, filter_date)
        return render_template('index.html', table_html=table_html)

    def get_details_by_symbol(self):
        data = request.get_json()
        symbol = data.get('Symbol')
        filtered_html_data = self.excel_reader.read_hist(Symbol=symbol) if symbol else "No data found."
        return jsonify(filtered_html_data)

    def upload_file(self):
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        uploader = ExcelUploader()
        try:
            results = uploader.upload_and_update(file)
            message = f"Upload successful, {results['rows_overwritten']} overwritten, {results['rows_created']} created."
            return jsonify({'message': message}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    excel_navigator_app = ExcelNavigatorApp()
    excel_navigator_app.app.run(debug=True)
