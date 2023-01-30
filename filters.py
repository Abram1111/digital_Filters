import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from scipy import signal


class Filters:
    # filter
    zeros=[]
    poles=[]
    # signal
    uploaded_signal=[[],[],[]]
    input_signal=[[],[],[]]
    output_signal=[[],[],[]]
    # graph
    frequencies=[]
    magnitud_response=[]
    phase_response=[]

    def __init__(self, zeros , poles):
            self.update_zerosAndPoles(zeros,poles)


# Signal functions
    def input_output_signals():
        pass

    def upload_signal(self,filename):
        data = pd.read_csv(filename, delimiter= ',')
        self.uploaded_signal[0]=data['time'].tolist()
        self.uploaded_signal[1]=data['amp'].tolist()
# Filter Functions
    def update_zerosAndPoles(self,zeros,poles):
        self.zeros=zeros
        self.poles=poles
        self.update_graph()

    def update_graph (self):

        w, h = signal.freqz_zpk(self.zeros,self.poles, 1, fs=100)
        self.frequencies =w*np.pi/max(w)
        self.magnitud_response=20 * np.log10(abs(h))
        self.phase_response=np.unwrap(np.angle(h))
        self.save_phaseAndMag()

    def save_phaseAndMag(self):
        export_data1 = pd.DataFrame( {
                            'zeros':self.zeros,})
        export_data2 =  pd.DataFrame({
                            'poles':self.poles,})
        temp=pd.concat([export_data1, export_data2], axis=1)
        df = pd.DataFrame(temp)
        df.to_csv("static/assets/data/Zeros_poles.csv")

        ploting_data = {
            'frequency':self.frequencies,
            'mag':self.magnitud_response,
            'phase' :self.phase_response
                }
        df = pd.DataFrame(ploting_data)
        df.to_csv("static/assets/data/magAndPhase.csv")
   
    def upload_filter(self,filename): 
        data = pd.read_csv(filename, delimiter= ',')

        zeros=data['zeros'].tolist()
        for index in np.arange(0,len(zeros)):
                zeros[index]=complex(zeros[index])
        poles=data['poles'].tolist()
        for index in np.arange(0,len(poles)):
                poles[index]=complex(poles[index])

        self.zeros=self.zeros+zeros
        self.poles=self.zeros+poles
        self.update_graph()

        

# def frequencyResponse(zeros, poles, gain):
#     w, h = scipy.signal.freqz_zpk(zeros, poles, gain)
#     magnitude = 20 * np.log10(np.abs(h))
#     angels = np.unwrap(np.angle(h))
#     return w/max(w), np.around(angels, decimals=3), np.around(magnitude, decimals=3)

# def phaseResponse(a):
#     w, h = scipy.signal.freqz([-a, 1.0], [1.0, -a])
#     angels = np.zeros(512) if a==1 else np.unwrap(np.angle(h))
#     return w/max(w), np.around(angels, decimals=3)

# def parseToComplex(pairs):
#     complexNumbers = [0]*len(pairs)
#     for i in range(len(pairs)):
#         x = round(pairs[i][0], 2)
#         y = round(pairs[i][1], 2)
#         complexNumbers[i] = x+ y*1j
#     return complexNumbers

# @app.route('/getFinalFilter', methods=['POST', 'GET'])
# @cross_origin()
# def getFinalFilter():
#     if request.method == 'POST':
#         zerosAndPoles = json.loads(request.data)
#         zeros         = parseToComplex(zerosAndPoles['zeros'])
#         poles         = parseToComplex(zerosAndPoles['poles'])
#         gain          = 1

#         a               = zerosAndPoles['a']

#         w, allPassAngles = getAllPassFrequencyResponse(a)
#         w, filterAngels, filterMagnitude = frequencyResponse(zeros, poles, gain)

#         finalAngles = np.add(allPassAngles, filterAngels)
#         finalMagnitude = filterMagnitude*1

#         response_data = {
#                 'w': w.tolist(),
#                 'angels': finalAngles.tolist(),
#                 'magnitude': finalMagnitude.tolist()
#             }
#     return jsonify(response_data)

# @app.route('/getFilter', methods=['POST'])
# @cross_origin()
# def getFrequencyResponce():
#     if request.method == 'POST':
#         zerosAndPoles   = json.loads(request.data)
#         zeros           = parseToComplex(zerosAndPoles['zeros'])
#         poles           = parseToComplex(zerosAndPoles['poles'])
#         gain            = zerosAndPoles['gain']

#         w, angles, magnitude = frequencyResponse(zeros, poles, gain)
#         response_data = {
#                 'w': w.tolist(),
#                 'angels': angles.tolist(),
#                 'magnitude': magnitude.tolist()
#             }
#     return jsonify(response_data)

# def getAllPassFrequencyResponse(filterCoeffients):
#         filter_angles   = np.zeros(512)
#         w               = np.zeros(512)
#         for coeffient in filterCoeffients:
#             w, angles = phaseResponse(coeffient)
#             filter_angles = np.add(filter_angles, angles)
#         return w, filter_angles

# @app.route('/getAllPassFilter', methods=['POST', 'GET'])
# def getAllPassFilterData():
#     if request.method == 'POST':
#         data                = json.loads(request.data)
#         filterCoeffients    = data['a']
#         w, filter_angles    = getAllPassFrequencyResponse(filterCoeffients)
#         response_data = {
#             'w': w.tolist(),
#             'angels': filter_angles.tolist(),
#         }
#         return jsonify(response_data)
#     else:
#         return 'There is no Post request'


# @app.route('/differenceEquationCoefficients' , methods=['GET','POST'])
# def differenceEquationCoefficients():
#     if request.method == 'POST':

#         zerosAndPoles    = json.loads(request.data)
#         zeros            = parseToComplex(zerosAndPoles['zeros'])
#         poles            = parseToComplex(zerosAndPoles['poles'])
#         b, a             = scipy.signal.zpk2tf(zeros, poles, 1)

#         response_data = {
#             'b': b.flatten().tolist(),
#             'a': a.flatten().tolist()
#         }

#         return jsonify(response_data)
