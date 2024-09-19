import os
import dotenv
from pydantic_settings import BaseSettings


dotenv.load_dotenv()
secret = os.getenv('JWT_SECRET')
host = os.getenv('SERVER_HOST')
port = int(os.getenv('SERVER_PORT'))


class Settings(BaseSettings):
    server_host: str = host
    server_port: int = port
    database_url: str = 'sqlite:///./src/instance/database.sqlite3'
    jwt_secret: str = secret
    jwt_algorithm: str = 'HS256'
    jwt_expiration: int = 3600


settings = Settings(
    _env_file='.env',
    _env_file_encoding='utf-8',
)
