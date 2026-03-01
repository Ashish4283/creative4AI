import os
import jwt
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv

load_dotenv()

class DBMiddleware:
    def __init__(self):
        self.db_host = os.getenv("DB_HOST", "127.0.0.1")
        self.db_user = os.getenv("DB_USER", "u879603724_creative4ai_us")
        self.db_password = os.getenv("DB_PASSWORD")
        self.db_name = os.getenv("DB_NAME", "u879603724_creative4ai")
        self.jwt_secret = os.getenv("JWT_SECRET")
        
        if not self.db_password:
            raise ValueError("DB_PASSWORD not found in environment variables")
        
        # Create SQLAlchemy engine for connection pooling
        # Using mysql-connector-python driver
        self.db_url = f"mysql+mysqlconnector://{self.db_user}:{self.db_password}@{self.db_host}/{self.db_name}"
        self.engine = create_engine(self.db_url, pool_size=10, pool_recycle=3600)

    def execute_query(self, query_str, params=None):
        """
        Executes a query and returns the result proxy.
        Using a context manager to ensure connections are returned to the pool.
        """
        try:
            with self.engine.connect() as connection:
                # Convert string query to SQLAlchemy text object
                stmt = text(query_str)
                result = connection.execute(stmt, params or {})
                return result
        except SQLAlchemyError as e:
            print(f"Database Error: {e}")
            raise e

    def verify_token(self, token):
        """
        Verifies a JWT token.
        """
        try:
            payload = jwt.decode(token, self.jwt_secret, algorithms=["HS256"])
            return payload
        except jwt.ExpiredSignatureError:
            return {"error": "Token expired"}
        except jwt.InvalidTokenError:
            return {"error": "Invalid token"}

    def buffer_write(self, table, data):
        """
        Writes data to the database. 
        (Currently direct write, can be upgraded to batching later)
        """
        try:
            columns = ', '.join(data.keys())
            # Create parameter placeholders like :user_id, :result_data
            placeholders = ', '.join([f":{key}" for key in data.keys()])
            
            query = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"
            
            with self.engine.begin() as connection:
                connection.execute(text(query), data)
                
        except Exception as e:
            print(f"Buffer Write Error: {e}")

db_middleware = DBMiddleware()