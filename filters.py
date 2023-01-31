import abc
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from scipy import signal
import scipy


class Filters:
    # filter
    zeros=[]
    poles=[]
    uploaded_zeros=[]
    uploaded_poles=[]
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

    def change_to_complex(self,number):
        # number=data['zeros']
        counter=0      
        complexNumbers   = [0]*len(number)
        conjugateNumbers = [0]*len(number)
        for i in np.arange(0,len(number)-1):
            x = float(number[i]["X"])/250
            y = float(number[i]["Y"])/250
            complexNumbers[i] = x+ y*1j
            if number[i]['conjugate'] == True :
                conjugateNumbers[counter]= complexNumbers[i]
                counter+=1
        conjugateNumbers = [i for i in conjugateNumbers if i != 0]
        complexNumbers=complexNumbers+conjugateNumbers
        return complexNumbers

    def applying_filter(self):
        num_coeff,deno_coeff=scipy.signal.zpk2tf(self.zeros, self.poles, 1)
        y_n=[]
        if(len(self.input_signal)>max(len(num_coeff),len(deno_coeff))):
            y_n=[0]*(len(self.input_signal)-max(len(num_coeff),len(deno_coeff)))
            for j in  np.arange(0,len(self.input_signal)-max(len(num_coeff),len(deno_coeff))):
                y_n[j] = num_coeff[0]*self.input_signal[j]
                for m in np.arange(1,len(num_coeff)-1):
                    y_n[j] += num_coeff[m]*self.input_signal[j-m] 
                for k in np.arange(1,len(deno_coeff)-1):
                    y_n[j] += - deno_coeff[k]* self.input_signal[j-k]
                y_n[j]=np.real(y_n[j])
        self.output_signal=   y_n   
        export_data1 = pd.DataFrame( {
                            'in':self.input_signal,})
        export_data2 =  pd.DataFrame({
                            'out':self.output_signal,})
        temp=pd.concat([export_data1, export_data2], axis=1)
        df = pd.DataFrame(temp)
        df.to_csv("static/assets/data/inputOutput.csv")               
            
    def upload_signal(self,filename):
        data = pd.read_csv(filename, delimiter= ',')
        self.uploaded_signal[0]=data['time'].tolist()
        self.uploaded_signal[1]=data['amp'].tolist()

    def input_output_signals(self,input):
        self.input_signal=list(np.float_(input))
        self.applying_filter()

# Filter Functions
    def update_zerosAndPoles(self,zeros,poles):
        self.zeros=zeros
        self.poles=poles
        self.update_graph()

    def update_graph (self):
        print(self.zeros)
        print(self.poles)

        w, h = signal.freqz_zpk(self.zeros,self.poles, 1)
        self.frequencies =w
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
        self.uploaded_zeros=zeros
        self.uploaded_poles=poles

        self.zeros=self.zeros+zeros
        self.poles=self.zeros+poles
        self.update_graph()

    def allpass(self,coefficents):
        for coeffient in coefficents:
            w, h =signal.freqz([-np.conj(coeffient), 1.0], [1.0, -coeffient])
            # w, h = signal.freqz([-a, 1.0], [1.0, -a])
            angles = np.zeros(512) if coeffient==1 else np.unwrap(np.angle(h))
            # w, angles = phaseResponse(coeffient)
            filter_angles = np.add(filter_angles, angles)

# def frequencyResponse(zeros, poles, gain):
#     w, h = scipy.signal.freqz_zpk(zeros, poles, gain)
#     magnitude = 20 * np.log10(np.abs(h))
#     angels = np.unwrap(np.angle(h))
#     return w/max(w), np.around(angels, decimals=3), np.around(magnitude, decimals=3)

# def phaseResponse(a):
#     w, h = scipy.signal.freqz([-a, 1.0], [1.0, -a])
#     angels = np.zeros(512) if a==1 else np.unwrap(np.angle(h))
#     return w/max(w), np.around(angels, decimals=3)



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
