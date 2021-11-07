from flask import Flask, jsonify, request, _request_ctx_stack
from flask_cors import cross_origin
from flask_mysqldb import MySQL
import numpy as np
import json
from six.moves.urllib.request import urlopen
from functools import wraps
from jose import jwt

AUTH0_DOMAIN = 'dev-mauoedtp.us.auth0.com'
API_AUDIENCE = '127.0.0.1:5000'
ALGORITHMS = ["RS256"]
global curDevice
curDevice = {}

mysql = MySQL()
app = Flask(__name__)
app.config['MYSQL_HOST'] = '34.69.88.21'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'main'

mysql.init_app(app)

@app.route("/")
def status():
    return {'status': 'OK'}, 200

class deviceData():
    def __init__(self, device_id):
        self.lag = 10
        self.threshold = 3.5
        self.influence = 0.9
        self.prevSignal = 0
        self.filteredY = []
        self.avgFilter = 0
        self.stdFilter = 0
        self.init_part = True
    
    def nextData(self, val):
        signal = 0
        if len(self.filteredY) < self.lag:
            self.filteredY.append(val)
        elif self.init_part:
            self.avgFilter = np.mean(self.filteredY)
            self.stdFilter = np.std(self.filteredY)
            self.init_part = False
        else:
            if abs(val-self.avgFilter) > self.threshold*self.stdFilter:
                if val > self.avgFilter:
                    signal = 1
                else:
                    signal = -1
                self.filteredY.append(self.influence*val+(1-self.influence)*self.filteredY[-1])
            else:
                signal = 0
                self.filteredY.append(val)
            self.filteredY.pop(0)
            self.avgFilter = np.mean(self.filteredY)
            self.stdFilter = np.std(self.filteredY)
        return signal

@app.route("/send/<int:number>", methods=['POST'])
def post_data(number):
    global curDevice
    res = request.get_json()
    if res["first"]:
        curDevice[str(number)] = deviceData(number) 
    elif res["continue"]:
        signal = 0
        err_num = 0
        for i in res["data"]:
            s = curDevice[str(number)].nextData(i)
            signal = 1 if signal == 1 else 1 if s == -1 else s
            err_num = 1 if s == -1 else 2
        try:
            cur = mysql.connection.cursor()
            cur.execute("INSERT INTO data VALUES (%s, %s, %s, %s)", (number, res["time"], str(res["data"]), np.mean(res["data"])))
            if signal == 1:
                cur.execute("INSERT INTO spikes VALUES (%s, %s, %s)", (number, res["time"], err_num))
            mysql.connection.commit()
            cur.close()
        except:
            return {"status": 400, "reason": "Can't update to database"}
        return {"time":res["time"], "signal": signal}
    else:
        return {"status": 400, "reason": "Incomplete data"}
    return {"status": 200}

@app.route("/get/points", methods=['GET'])
def get_points():
    res = request.get_json()
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM device WHERE User=%s", (res["User"]))
        did =  cur.fetchall()[0][0]
        cur.execute("SELECT COUNT(*) FROM spikes WHERE DID=%s", (did))
        spikes = cur.fetchall()[0][0]
        if spikes != 0:
            cur.execute("SELECT num FROM spikes WHERE DID=%s FETCH NEXT 1 ROWS ONLY", (did))
            data = cur.fetchall()[0]
            cur.execute("DELETE FROM spikes WHERE num=%s",(data[0]))
            mysql.connection().commit()
        return {"spikes": spikes, "num": data[0]}
    except:
        return {"spikes": 0, "status": 400, "reason": "MySQL query failed"}

@app.route("/get/graph", methods=['GET'])
def get_data():
    res = request.get_json()
    num = res['num']
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM device WHERE User=%s", (res["User"]))
        did =  cur.fetchall()[0][0]
        cur.execute("SELECT * FROM spikes WHERE DID=%s AND num=%s", (did, num))
        values = cur.fetchall()[0]
        cur.execute("SELECT num,Average FROM data WHERE DID=%s AND Time=%s", (did, values[3]))
        midRow = cur.fetchall()[0]
        cur.execute("SELECT Time, Average FROM data WHERE DID=%s AND num < %s ORDER BY num DESC", (did, values[3]))
        firstRows = cur.fetchmany(4)
        cur.execute("SELECT Time, Average FROM data WHERE DID=%s AND num > %s ORDER BY num ASC",(did, values[3]))
        lastRows = cur.fetchmany(4)
        data = []
        for row in firstRows + midRow + lastRows:
            data.append(row[3])
        return {"data": data, "reason": "Your were Breaking too hard" if values[2]==1 else "You suddenly accelerated", "time": values[1]}
    except:
        return {"data": [], "status": 400, "reason": "MySQL query failed"}

@app.route("/register", methods=['POST'])
def register():
    res = request.get_json()
    user = res['user']
    password = res['password']
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM user WHERE username=%s", (user))
        if len(cur.fetchall()) == 0:
            cur.execute("INSERT INTO user VALUES (%s, %s)", (user, password))
            mysql.connection.connect()
        else:
            return {"status": 500, "reason": "user name already exists"}
    except:
        return {"status": 400, "reason": "database error"}

@app.route("/login", methods=['POST'])
def log_in():
    res = request.get_json()
    user = res['user']
    password = res['password']
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM user WHERE username=%s", (user))
        data = cur.fetchall()
        if len(data) == 1 and data[0]["password"] == password: 
            return {"loggedIn": True}
        else:
            return {"loggedIn": False, "status": 500, "reason": "user name already exists"}
    except:
        return {"loggedIn": False, "status": 400, "reason": "database error"}


if __name__ == '__main__':
    app.run(debug=True)