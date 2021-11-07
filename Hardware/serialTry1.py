import serial
import time
import requests
import datetime

ser = serial.Serial('/dev/cu.usbmodem141101')

compByte = ""
tenBytes = []
while True:
    curByte = str(ser.read(1))[2]
    if curByte == " ":
        tenBytes += [compByte]
        if len(tenBytes) == 10:
            r = requests.post('http://127.0.0.1:5000/send/100', json={
            "first": True,
            "continue": True,
            "data": tenBytes,
            "time": datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
            })
            tenBytes = []
        compByte = ""
    else:
        compByte += curByte

ser.close()
