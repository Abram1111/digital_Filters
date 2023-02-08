from flask import Flask, render_template, send_file, request, redirect,jsonify,json
import numpy as np

from werkzeug.utils import secure_filename
from filters import Filters
from pathlib import Path
import os

app = Flask(__name__)

def create_app():
    _app = Flask(__name__)
    return _app

filter_object =Filters([(0+0j)],[(0+0j)])

@app.route("/", methods=["GET", "POST"])
def index():
    filter_object.initialize();
    return render_template('index.html')

@app.route("/unitcircle", methods=["GET", "POST"])
def unitcircle():

    zerosAndPoles= None   

    # if request.method == 'POST':

    zerosAndPoles   = json.loads(request.data)
    zeros           = filter_object.change_to_complex(number=zerosAndPoles['zeros'])
    poles           = filter_object.change_to_complex(number=zerosAndPoles['poles'])

    filter_object.update_zerosAndPoles(zeros,poles)
    filter_object.input_output_signals(zerosAndPoles['input'])

    response_data = json.dumps({
        'frequency' : list(filter_object.frequencies),
        'mag'       : list(filter_object.magnitud_response),
        'phase'     : list(filter_object.total_phase_response),
        'output_signal':list(filter_object.output_signal)
    })
    return jsonify(response_data)

    
@app.route("/allpass", methods=["GET", "POST"])
def allpass():
    # zerosAndPoles= None   
    filters   = json.loads(request.data)
    coefficents=[]
    for filter in filters:
        x=complex(filter)
        coefficents.append(x)
    print(coefficents)
    # obj2 =Filters([(0+0j)],[(0+0j)])
    filter_object.allpass_filter(coefficents)
    # print(w,h)
    
    response_data = json.dumps({
        'frequency' : list(filter_object.frequencies),
        'phase'     : list(filter_object.allpass_response),
        'total phase':list(filter_object.total_phase_response)
    })
        
    return jsonify(response_data)
    # filter_object.allpass(filters)

@app.route("/importFilter", methods=["GET", "POST"])
def import_filter():

        response_data = json.dumps({
            'zeros_real'       : [0,0,0],
            'zeros_img'        : [0,0,0],
            'poles_real'       : [0,0,0],
            'poles_img'        : [0,0,0]

                })
        isthisFile = request.files.get('filter')
        if isthisFile:
            filename=isthisFile.filename
            file_path=Path(filename)
            if file_path.is_file():
                print('exist')
                os.remove(filename)
            else:
                print('doesnt exist')
            isthisFile.save(isthisFile.filename)

            zeros_real,zeros_img,poles_real,poles_img=filter_object.upload_filter(isthisFile.filename)
            response_data = json.dumps({
            'zeros_real'       : list(zeros_real),
            'zeros_img'        : list(zeros_img ),
            'poles_real'       : list(poles_real),
            'poles_img'        : list(poles_img)

                            })
        return jsonify(response_data)
 
@app.route("/importSignal", methods=["GET", "POST"])
def import_Signal():
    # downloading file
    isthisFile = request.files.get('signal')
    print(isthisFile)
    if isthisFile: 
        filename=isthisFile.filename
        file_path=Path(filename)
        if file_path.is_file():
            print('exist')
            os.remove(filename)
        else:
            print('doesnt exist')

        isthisFile.save(isthisFile.filename)

        filter_object.upload_signal(isthisFile.filename)

    response_data = json.dumps({

        'uploaded_signal' : list(filter_object.input_signal) ,
        'x_axis'          : list(filter_object.uploaded_signal_x),
        'frequency'       : list(filter_object.frequencies),
        'mag'             : list(filter_object.magnitud_response),
        'phase'           : list(filter_object.total_phase_response),
        'output_signal'   : list(filter_object.output_signal),
    
        })

    return jsonify(response_data)

if __name__ == "__main__":
    
    app.run(debug=True, threaded=True)