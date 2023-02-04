from flask import Flask, render_template, send_file, request, redirect,jsonify,json

from werkzeug.utils import secure_filename
from filters import Filters
from pathlib import Path
import os

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
    obj1.input_output_signals(zerosAndPoles['input'])

    response_data = json.dumps({
        'frequency' : list(obj1.frequencies),
        'mag'       : list(obj1.magnitud_response),
        'phase'     : list(obj1.phase_response),
        'output_signal':list(obj1.output_signal)
    })
    return jsonify(response_data)


@app.route("/allpass", methods=["GET", "POST"])
def allpass():
    # zerosAndPoles= None   
    filters   = json.loads(request.data)
    coefficents=[]
    for filter in filters:
        coefficents.append(complex(filter))
    print(coefficents)
    obj2 =Filters([(0+0j)],[(0+0j)])
    obj2.allpass(list(coefficents))
    # print(w,h)
    
    response_data = json.dumps({
        'frequency' : list(obj2.frequencies),
        'phase'     : list(obj2.allpass)
    })
        
    return jsonify(response_data)
    # obj1.allpass(filters)
    

@app.route("/importFilter", methods=["GET", "POST"])
def import_filter():

        isthisFile = request.files.get('filter')
        filename=isthisFile.filename
        file_path=Path(filename)
        if file_path.is_file():
            print('exist')
            os.remove(filename)
        else:
         print('doesnt exist')
         isthisFile.save(isthisFile.filename)

        zeros_real,zeros_img,poles_real,poles_img=obj1.upload_filter(isthisFile.filename)

        response_data = {
        'zeros_real'       : zeros_real,
        'zeros_img'        : zeros_img,
        'poles_real'       : poles_real,
        'poles_img'        : poles_img

            }
        return jsonify(response_data)
 
@app.route("/importSignal", methods=["GET", "POST"])
def import_Signal():
    # downloading file
    isthisFile = request.files.get('signal')
    filename=isthisFile.filename
    file_path=Path(filename)
    if file_path.is_file():
        print('exist')
        os.remove(filename)
    else:
        print('doesnt exist')
        isthisFile.save(isthisFile.filename)

    obj1.upload_signal(isthisFile.filename)
    obj1.input_output_signals(obj1.input_signal)

    response_data = json.dumps({
        'frequency'    : list(obj1.frequencies),
        'mag'          : list(obj1.magnitud_response),
        'phase'        : list(obj1.phase_response),
        'output_signal':list(obj1.output_signal),
        'input_signal' :list(obj1.uploaded_signal_y) ,
        'x_axis'       :list(obj1.uploaded_signal_x) 
    
        })

    return jsonify(response_data)

if __name__ == "__main__":
    
    app.run(debug=True, threaded=True)