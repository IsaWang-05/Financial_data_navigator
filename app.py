from flask import Flask, render_template, request, jsonify
import pandas as pd

app = Flask(__name__)
filepath = './data/starter_db.xlsx'

# Function to read starter columns
def read_partial_excel(filename, issuer=None, symbol=None, deal_team_contact=None):
    data = pd.read_excel(filename, engine='openpyxl', usecols=['issuer', 'symbol', 'fund', 'deal_team_contact', 'curr_price'])
    
    # Apply filters if parameters are provided
    if issuer:
        data = data[data['issuer'].str.contains(issuer, case=False, na=False)]
    if symbol:
        data = data[data['symbol'].str.contains(symbol, case=False, na=False)]
    if deal_team_contact:
        data = data[data['deal_team_contact'].str.contains(deal_team_contact, case=False, na=False)]

    # Add a link column for each row to view full data
    data['Details'] = data.apply(lambda row: f"<a href='#' class='view-details' data-id='{row.name}'>View Details</a>", axis=1)
    
    return data.to_html(index=False, escape=False)


# Function to read full data when prompted
def read_full_excel(filename, row_id):
    data = pd.read_excel(filename, engine='openpyxl')
    row_data = data.iloc[[row_id]]
    return row_data.to_html(index=False)

# API Endpoints
@app.route('/', methods=['GET'])
def index():
    # extracting query parameters from the request
    issuer = request.args.get('issuer')
    symbol = request.args.get('symbol')
    deal_team_contact = request.args.get('deal_team_contact')

    # passing these parameters to the read_partial_excel function
    table_html = read_partial_excel(filepath, issuer, symbol, deal_team_contact)
    return render_template('index.html', table_html=table_html)


@app.route('/details', methods=['POST'])
def details():
    row_id = request.json.get('row_id')
    full_data = read_full_excel(filepath, int(row_id))
    return jsonify(full_data)

if __name__ == '__main__':
    app.run(debug=True)
