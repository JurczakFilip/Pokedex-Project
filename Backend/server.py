from flask import Flask, request
from flask_cors import CORS
import hashlib
from enum import Enum
import mariadb
from datetime import datetime, timedelta

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
    final_redirect = "None"
    end_time = None
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
            final_redirect = "/"
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
                final_redirect = "/"

# Set Security Cookie
        cursor.execute(
            "SELECT id FROM users WHERE username = ? AND password = ?",
            (username, HashedPassword)
        )
        g_user = cursor.fetchone()

        if g_user is None:
            print("User not found!")
        else:
            user_id = g_user[0]

            print("Finding Existing Cookies")
            print("USERID SEARCHED FOR:", user_id)

            cursor.execute(
                """
                SELECT sessionid, create_time, end_time, cookie
                FROM sessioncookies
                WHERE user_id = ?
                """,
                (user_id,)
            )

            sessioncookie_data = cursor.fetchone()

            if sessioncookie_data is not None:
                print("Session Cookie Data found!")

                # The cookie is the fourth selected column (index 3)
                final_cookie = sessioncookie_data[3]
                end_time = sessioncookie_data[2]

            else:
                print("Creating new session cookies...")

                create_time = datetime.now()
                end_time = create_time + timedelta(days=30)

                # Generate a random session token
                import secrets
                NewCookie = secrets.token_urlsafe(32)

                cursor.execute(
                    """
                    INSERT INTO sessioncookies
                        (user_id, create_time, end_time, cookie)
                    VALUES (?, ?, ?, ?)
                    """,
                    (user_id, create_time, end_time, NewCookie)
                )

                conn.commit()

                final_cookie = NewCookie
                print("Session cookie created successfully!")
        """
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
        """
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
        "sigionpex": final_cookie,
        "end_time": end_time.isoformat() if end_time else None,
        "Redirect": final_redirect
    }

    return final_return

@app.route("/verifycookie")
def verifycookie():
    cookie = request.args.get("sigionpex")
    print("Cookie:", cookie)

if __name__ == "__main__":
    # Check if database has tables required to run
    try:
        print("[glock] Establishing a connection to database...")
        cursor = conn.cursor()
        
        if cursor:
            print("[glock] Connection established!")

            # Check if required tables exist
            # User Table Check
            cursor.execute("""
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_schema = 'pokedex_db'
                AND table_name = 'users'
            ) AS table_exists;
            """)
            users_result = cursor.fetchone()

            if users_result[0]:
                print("[glock] Users table Found!")
            else:
                print("[glock] Failed to locate Users table...")
                print("[glock] Creating users table...")
                cursor.execute("""
                CREATE TABLE users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(20) NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
                """)
                conn.commit()

            # sessioncookie Table Check
            cursor.execute("""
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.tables
                WHERE table_schema = 'pokedex_db'
                AND table_name = 'sessioncookies'
            ) AS table_exists;
            """)
            sessioncookies_result = cursor.fetchone()
            if sessioncookies_result[0]:
                print("[glock] Sessioncookies table Found!")
            else:
                print("[glock] Failed to locate Sessioncookies table...")
                print("[glock] Creating Sessioncookies table...")
                cursor.execute("""
                    CREATE TABLE sessioncookies (
                        sessionid INT AUTO_INCREMENT PRIMARY KEY,
                        user_id INT NOT NULL,
                        create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        end_time TIMESTAMP NULL DEFAULT NULL,
                        cookie VARCHAR(256),

                        CONSTRAINT fk_sessioncookies_user
                            FOREIGN KEY (user_id)
                            REFERENCES users(id)
                    );
                """)
                conn.commit()
        else:
            print("[glock] Failed to connect to database...")
    except mariadb.Error as e:
        print("[glock] Failed to verify database: ", e)
        conn.rollback()
    finally:
        cursor.close()

    app.run(port=5000, debug=True)

