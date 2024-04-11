from flask import Flask, render_template, request, jsonify
from services.excel_connection_svc import get_all_data, ExcelUploader  # Import ExcelUploader
from services.filter_svc import DataFilter

class ExcelReader:
    def __init__(self):
        self.data = get_all_data()

    def read(self, Issuer=None, Symbol=None, filter_date=None):
        data = DataFilter.filter_data(self.data.copy(), Issuer, Symbol, filter_date)
        data['Details'] = data.apply(lambda row: f"<a href='#' class='view-details' data-symbol='{row['Symbol']}'>View Details</a>", axis=1)
        data = data.sort_values('Date', ascending=False).drop_duplicates('Symbol')
        return data.to_html(index=False, escape=False)

    def read_hist(self, Symbol, filter_date=None):
        data = DataFilter.filter_for_details(self.data.copy(), Symbol, filter_date)
        return data.to_html(index=False, escape=False)

class ExcelNavigatorApp:
    def __init__(self, excel_reader):
        self.app = Flask(__name__)
        self.excel_reader = excel_reader

        @self.app.route('/', methods=['GET'])
        def index():
            Issuer = request.args.get('Issuer')
            Symbol = request.args.get('Symbol')
            filter_date = request.args.get('filter_date')
            table_html = self.excel_reader.read(Issuer, Symbol, filter_date)
            return render_template('index.html', table_html=table_html)

        @self.app.route('/details', methods=['POST'])
        def get_details_by_symbol():
            data = request.get_json()
            symbol = data.get('Symbol')
            symbol_data = self.excel_reader.data[self.excel_reader.data['Symbol'] == symbol]
            symbol = symbol_data.iloc[0]['Symbol'] if not symbol_data.empty else None
            filtered_html_data = self.excel_reader.read_hist(Symbol=symbol) if symbol else "No data found."
            return jsonify(filtered_html_data)

        @self.app.route('/upload', methods=['POST'])
        def upload_file():
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
    excel_reader = ExcelReader()
    excel_navigator_app = ExcelNavigatorApp(excel_reader)
    excel_navigator_app.app.run(debug=True)
