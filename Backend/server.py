from flask import Flask, request
from flask_cors import CORS
import hashlib
from enum import Enum
import mariadb

# PROJECT ENUMS
class STATUS_CODE(Enum):
    UNDEFINED = 404
    ERROR     = 0
    SUCCESS   = 1
    WARNING   = 2

# MARIA DB
conn = mariadb.connect(
    host="127.0.0.1",
    port=3306,
    user="root",
    password="root",
    database="pokedex_db",
)

# FLASK
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

@app.route("/signup")
def signup():
    username = request.args.get("username")
    password = request.args.get("password")

    if not username or not password:
        return {
            "status": STATUS_CODE.ERROR.value,
            "message": "Username and password are required!"
        }, 400

    HashedPassword = hashlib.sha256(
        username.encode() + password.encode()
    ).hexdigest()

    cursor = conn.cursor()

    final_status = STATUS_CODE.UNDEFINED
    final_msg = "Failed before any SQL was ran."
    final_cookie = ""
    g_user = 0

    try:
        # CHECK LOGIN
        cursor.execute(
            "SELECT * FROM users WHERE username = ? AND password = ?",
            (username, HashedPassword)
        )

        user = cursor.fetchone()

        if user:
            print("USER FOUND: " + user[1])

            final_status = STATUS_CODE.SUCCESS
            final_msg = f"Successfully Logged in as {username}!"
            g_user = user
        else:
            print("USER NOT FOUND, CREATING ACCOUNT!")

            # CHECK IF USERNAME IS TAKEN
            cursor.execute(
                "SELECT * FROM users WHERE username = ?",
                (username,)
            )

            existing_user = cursor.fetchone()

            if existing_user:
                print("USERNAME TAKEN")

                final_status = STATUS_CODE.ERROR
                final_msg = "Username or Password is invalid try again."

            else:
                print("USERNAME IS NOT TAKEN")

                cursor.execute(
                    "INSERT INTO users (username, password) VALUES (?, ?)",
                    (username, HashedPassword)
                )

                conn.commit()

                final_status = STATUS_CODE.SUCCESS
                final_msg = f"Successfully created your account as {username}!"

# Set Security Cookie
        cursor.execute(
            "SELECT * FROM users WHERE username = ? AND password = ?",
            (username, HashedPassword)
        )

        g_user = cursor.fetchone()

        if g_user[3]:
            print("User has Cookie!")
            final_cookie = g_user[3] 
        else:
            print("User does not have cookie!")
            print(g_user[0], g_user[1])
            NewCookie = hashlib.sha256(
               str(g_user[0]).encode() + username.encode() + password.encode()
            ).hexdigest()
            final_cookie = NewCookie

            cursor.execute(
                "UPDATE users SET cookiesession = ? WHERE username = ? AND password = ?",
                (final_cookie, username, HashedPassword)
            )
            
            conn.commit()

    except mariadb.Error as e:
        conn.rollback()
        print("DATABASE ERROR:", e)

        final_status = STATUS_CODE.ERROR
        final_msg = "A database error occurred."

    finally:
        cursor.close()

    final_return = {
        "status": final_status.value,
        "message": final_msg,
        "sigionpex": "DO_NOT_SHARE_WITH_ANYONE_AN_EPIC_GAMES_EMPLOYEE_WOULD_NEVER_ASK_FOR_YOUR_PASSWORD_" + final_cookie,
    }

    return final_return

if __name__ == "__main__":
    app.run(port=5000, debug=True)

# Don't close conn here; app.run() blocks while Flask is running