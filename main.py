from flask import Flask, render_template, send_file, request, redirect,jsonify,json

from werkzeug.utils import secure_filename
from filters import Filters

app = Flask(__name__)

def create_app():
    _app = Flask(__name__)
    return _app

obj1 =Filters([(0+0j)],[(0+0j)])

@app.route("/", methods=["GET", "POST"])
def index():
    print('hello')
    return render_template('index.html')

@app.route("/unitcircle", methods=["GET", "POST"])
def unitcircle():

    zerosAndPoles= None   

    # if request.method == 'POST':
    zerosAndPoles   = json.loads(request.data)
    zeros           = obj1.change_to_complex(number=zerosAndPoles['zeros'])
    poles           = obj1.change_to_complex(number=zerosAndPoles['poles'])
    obj1.update_zerosAndPoles(zeros,poles)
    # obj1.input_output_signals(zerosAndPoles['input'])
    # print('output_signal')
    # print(list(obj1.output_signal))
    response_data = json.dumps({
        'frequency' : list(obj1.frequencies),
        'mag'       : list(obj1.magnitud_response),
        'phase'     : list(obj1.phase_response),
        # 'output_signal':list(obj1.output_signal)
    })
    return jsonify(response_data)

    # return render_template('index.html')



@app.route("/importFilter", methods=["GET", "POST"])
def import_filter():
    if request.method == 'POST':

        filter_file1 = request.files['uploaded_filter']
        filter_file1.save(secure_filename('uploaded_filter.csv'))
        obj1.upload_filter('uploaded_filter.csv')

        # response_data = {
        # 'frequency' : obj1.frequencies,
        # 'mag'       : obj1.magnitud_response,
        # 'phase'     : obj1.phase_response
        #     }
        # return jsonify(response_data)

    return render_template('index.html')

@app.route("/importSignal", methods=["GET", "POST"])
def import_Signal():
    if request.method == 'POST':

          signal_file2 = request.files['uploaded_signal']
          signal_file2.save(secure_filename('uploaded_signal.csv'))
          obj1.upload_signal('uploaded_signal.csv')
        # response_data = {
        # 'frequency' : obj1.frequencies,
        # 'mag'       : obj1.magnitud_response,
        # 'phase'     : obj1.phase_response
        #     }
        # return jsonify(response_data)

    return render_template('index.html')

if __name__ == "__main__":
    
    app.run(debug=True, threaded=True)