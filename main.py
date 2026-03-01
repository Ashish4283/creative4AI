import os
import mysql.connector
from mysql.connector import errorcode
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow React frontend to communicate with this backend

# Database Configuration (Matches your Hostinger setup)
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME = os.getenv("DB_NAME", "creative4ai")

def get_db_connection():
    """Establishes a connection to the remote MySQL database."""
    try:
        connection = mysql.connector.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            connect_timeout=10  # Timeout for remote connections
        )
        return connection
    except mysql.connector.Error as err:
        print(f"Database Connection Error: {err}")
        return None

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "message": "Python Backend is running"}), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"error": "Missing email or password"}), 400

    email = data['email']
    password = data['password']

    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Cannot connect to database. Check DB_HOST and firewall settings."}), 500

    try:
        cursor = conn.cursor(dictionary=True)
        # Query to find user by email
        # Note: In production, ensure you compare hashed passwords (e.g., bcrypt)
        query = "SELECT id, email, role, name, status FROM users WHERE email = %s"
        cursor.execute(query, (email,))
        user = cursor.fetchone()

        # Simple password check (Update this if your PHP backend uses hashing like bcrypt)
        if user and user.get('password') == password: 
             # If using hashing, use: if user and bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            return jsonify({"message": "Login successful", "user": user}), 200
        elif user:
             # Fallback for plain text comparison if hash check wasn't used above
             return jsonify({"error": "Invalid credentials"}), 401
        else:
            return jsonify({"error": "User not found"}), 404
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == '__main__':
    print(f"Starting Python Backend on port 5000...")
    app.run(debug=True, port=5000)