import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'crime_investigation_secret_key')
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'postgresql://postgres:postgres@localhost:5432/crime_investigation_db'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_ORIGIN = os.getenv('CORS_ORIGIN', 'http://127.0.0.1:5173')
