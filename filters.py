import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from scipy import signal


class Filters:

    zeros=[]
    poles=[]
    frequencies=[]
    magnitud_response=[]
    phase_response=[]
    input_signal=[]
    output_signal=[]

    def __init__(self, zeros,poles):
        self.zeros=zeros
        self.poles=poles
        self.update_zerosandpoles()



    def import_filter(self,filename):
        
        data = pd.read_csv(filename, delimiter= ',')

        zeros=data['zeros'].tolist()

        for index in np.arange(0,len(zeros)):
                zeros[index]=complex(zeros[index])
        print (zeros)
        
        poles=data['poles'].tolist()

        for index in np.arange(0,len(poles)):
                poles[index]=complex(poles[index])
        print (poles)
       
      

        # poles=data['poles']
        # for index in range(0,len(poles)):
        #     poles[index]=complex(poles[index])
        # # print (poles)

        self.zeros=self.zeros+zeros
        self.poles=self.zeros+poles
        # print(self.zeros)
        self.update_zerosandpoles()


    def input_output_signals():
        pass

    def save_pahseandmag(self):

        export_data1 = pd.DataFrame( {
        'zeros':self.zeros,
            })
        export_data2 =  pd.DataFrame({
        'poles':self.poles,
            })
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

    def update_zerosandpoles (self):

        w, h = signal.freqz_zpk(self.zeros,self.poles, 1, fs=100)
        self.frequencies=w
        self.magnitud_response=20 * np.log10(abs(h))
        self.phase_response=np.unwrap(np.angle(h))
        self.save_pahseandmag()



        

