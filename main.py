from flask import Flask, render_template, send_file, request, redirect,jsonify
import filters as FI
app = Flask(__name__)

def create_app():
    _app = Flask(__name__)
    return _app


@app.route("/", methods=["GET", "POST"])
def index():
    obj1 =FI.Filters()
    obj1.read_zerosandpoles()

    return render_template('index.html')





if __name__ == "__main__":
    
    app.run(debug=True, threaded=True)