from flask import Flask, render_template
import excel_connection

app = Flask(__name__)

@app.route('/')
def index():
    data = excel_connection.get_all_data()
    return render_template('index.html', data=data)

if __name__ == '__main__':
    app.run(debug=True)
