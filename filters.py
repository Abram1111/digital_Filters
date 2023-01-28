import matplotlib.pyplot as plt

import numpy as np
from scipy import signal


class Filters:
    # zeros=[0,1,0-1j,0+1j,]
    # poles=[0,1,0-1j,0+1j,]
    zeros=[(-0.0+1j)]
    poles=[(-0.0-1j)]
    magnitud_response=[]
    phase_response=[]
    input_signal=[]
    output_signal=[]

    def __init__(self, zeros=0,poles=0):
    
        self.zeros = zeros
        self.poles = poles

    def import_filter():
        pass
    def export_filter():
        pass
    def input_output_signals():
        pass
    
    def read_zerosandpoles (self):
        w, h = signal.freqz_zpk(self.zeros,self.poles, 1, fs=100)

        fig = plt.figure()
        ax1 = fig.add_subplot(1, 1, 1)
        ax1.set_title('Digital filter frequency response')
        ax1.plot(w, 20 * np.log10(abs(h)), 'b')
        ax1.set_ylabel('Amplitude [dB]', color='b')
        ax1.set_xlabel('Frequency [Hz]')
        ax1.grid(True)
        ax2 = ax1.twinx()
        angles = np.unwrap(np.angle(h))
        ax2.plot(w, angles, 'g')
        ax2.set_ylabel('Angle [radians]', color='g')
        plt.axis('tight')
        plt.savefig('static/assets/images/zeros_poles')


        

obj1 =Filters('filter1')
obj1.read_zerosandpoles()