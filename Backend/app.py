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

# Error handler
class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code

@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response


def get_token_auth_header():
    """Obtains the Access Token from the Authorization Header
    """
    auth = request.headers.get("Authorization", None)
    if not auth:
        raise AuthError({"code": "authorization_header_missing",
                        "description":
                            "Authorization header is expected"}, 401)

    parts = auth.split()

    if parts[0].lower() != "bearer":
        raise AuthError({"code": "invalid_header",
                        "description":
                            "Authorization header must start with"
                            " Bearer"}, 401)
    elif len(parts) == 1:
        raise AuthError({"code": "invalid_header",
                        "description": "Token not found"}, 401)
    elif len(parts) > 2:
        raise AuthError({"code": "invalid_header",
                        "description":
                            "Authorization header must be"
                            " Bearer token"}, 401)

    token = parts[1]
    return token


def requires_auth(f):
    """Determines if the Access Token is valid
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = get_token_auth_header()
        jsonurl = urlopen("https://"+AUTH0_DOMAIN+"/.well-known/jwks.json")
        jwks = json.loads(jsonurl.read())
        unverified_header = jwt.get_unverified_header(token)
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"]
                }
        if rsa_key:
            try:
                payload = jwt.decode(
                    token,
                    rsa_key,
                    algorithms=ALGORITHMS,
                    audience=API_AUDIENCE,
                    issuer="https://"+AUTH0_DOMAIN+"/"
                )
            except jwt.ExpiredSignatureError:
                raise AuthError({"code": "token_expired",
                                "description": "token is expired"}, 401)
            except jwt.JWTClaimsError:
                raise AuthError({"code": "invalid_claims",
                                "description":
                                    "incorrect claims,"
                                    "please check the audience and issuer"}, 401)
            except Exception:
                raise AuthError({"code": "invalid_header",
                                "description":
                                    "Unable to parse authentication"
                                    " token."}, 401)

            _request_ctx_stack.top.current_user = payload
            return f(*args, **kwargs)
        raise AuthError({"code": "invalid_header",
                        "description": "Unable to find appropriate key"}, 401)
    return decorated


def requires_scope(required_scope):
    """Determines if the required scope is present in the Access Token
    Args:
        required_scope (str): The scope required to access the resource
    """
    token = get_token_auth_header()
    unverified_claims = jwt.get_unverified_claims(token)
    if unverified_claims.get("scope"):
            token_scopes = unverified_claims["scope"].split()
            for token_scope in token_scopes:
                if token_scope == required_scope:
                    return True
    return False

@app.route("/")
def status():
    return {'status': 'OK'}, 200

@app.route("/api/public")
@cross_origin(headers=["Content-Type", "Authorization"])
def public():
    response = "Hello from a public endpoint! You don't need to be authenticated to see this."
    return jsonify(message=response)

# This needs authentication
@app.route("/api/private")
@cross_origin(headers=["Content-Type", "Authorization"])
@requires_auth
def private():
    response = "Hello from a private endpoint! You need to be authenticated to see this."
    return jsonify(message=response)

# This needs authorization
@app.route("/api/private-scoped")
@cross_origin(headers=["Content-Type", "Authorization"])
@requires_auth
def private_scoped():
    if requires_scope("read:messages"):
        response = "Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this."
        return jsonify(message=response)
    raise AuthError({
        "code": "Unauthorized",
        "description": "You don't have access to this resource"
    }, 403)

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
        ans = cur.fetchall()[0]
        spikes = 0 if len(ans) == 0 else ans[0][0]
        return {"spikes": spikes}
    except:
        return {"status": 400, "reason": "MySQL query failed"}

@app.route("/get/graph", methods=['GET'])
def get_data():
    res = request.get_json()
    num = res['id']
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM device WHERE User=%s", (res["User"]))
        did =  cur.fetchall()[0][0]
        cur.execute("SELECT * FROM spikes WHERE DID=%s ORDER BY num ASC OFFSET %s ROWS FETCH NEXT 1 ROWS ONLY", (did, num))
        values = cur.fetchall()[0]
        cur.execute("SELECT num,Average FROM data WHERE DID=%s AND Time=%s")
        midRow = cur.fetchall()[0]
        cur.execute("SELECT Time, Average FROM data WHERE DID=%s AND num < %s ORDER BY num DESC ")
        firstRows = cur.fetchmany(4)
        cur.execute("SELECT Time, Average FROM data WHERE DID=%s AND num > %s ORDER BY num ASC ")
        lastRows = cur.fetchmany(4)
        data = []
        for row in firstRows + midRow + lastRows:
            data.append(row[3])
        return {"data": data, "reason": "Your were Breaking too hard" if values[2]==1 else "You suddenly accelerated", "time": values[1]}
    except:
        return {"status": 400, "reason": "MySQL query failed"}

if __name__ == '__main__':
    app.run(debug=True)