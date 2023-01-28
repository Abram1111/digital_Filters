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


@app.route("/import", methods=["GET", "POST"])
def import_filter():
    if request.method == 'POST':

          f = request.files['uploaded_file']
          f.save(secure_filename('uploaded_file.csv'))
          obj1.import_filter('uploaded_file.csv')

    return render_template('index.html')



if __name__ == "__main__":
    
    app.run(debug=True, threaded=True)