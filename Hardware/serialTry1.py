import serial

ser = serial.Serial('/dev/cu.usbmodem141101')

compByte = ""
tenBytes = []
while True:
    curByte = str(ser.read(1))[2]
    if curByte == " ":
        tenBytes += [compByte]
        if len(tenBytes) == 10:
            print(tenBytes) #add post req
            tenBytes = []
        compByte = ""
    else:
        compByte += curByte

ser.close()
