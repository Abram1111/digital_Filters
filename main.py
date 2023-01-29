from flask import Flask, render_template, send_file, request, redirect,jsonify
from werkzeug.utils import secure_filename

import filters as FI
app = Flask(__name__)

def create_app():
    _app = Flask(__name__)
    return _app

obj1 =FI.Filters([(1+1j),(2+1j),(1+3j)],[(-1-1j),(1-1j),(1+5j)])

@app.route("/", methods=["GET", "POST"])
def index():
# 
    # obj1.update_zerosandpoles([(-0.0+1j)],[(-0.0-1j)])
    return render_template('index.html')


@app.route("/importFilter", methods=["GET", "POST"])
def import_filter():
    if request.method == 'POST':

          filter_file1 = request.files['uploaded_filter']
          filter_file1.save(secure_filename('uploaded_filter.csv'))
          obj1.upload_filter('uploaded_filter.csv')

    return render_template('index.html')

@app.route("/importSignal", methods=["GET", "POST"])
def import_Signal():
    if request.method == 'POST':

          signal_file2 = request.files['uploaded_signal']
          signal_file2.save(secure_filename('uploaded_signal.csv'))
          obj1.upload_signal('uploaded_signal.csv')

    return render_template('index.html')


if __name__ == "__main__":
    
    app.run(debug=True, threaded=True)