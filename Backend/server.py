from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)

CORS(app, origins=["http://localhost:3000"])

@app.route("/test")
def test():
    username = request.args.get("username")
    password = request.args.get("password")

    print(username)  # blud
    print(password)  # dude

    return {
        "username": username,
        "password": password
    }

if __name__ == "__main__":
    app.run(port=5000, debug=True)
