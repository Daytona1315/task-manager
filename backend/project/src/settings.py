from pydantic_settings import BaseSettings
from dotenv import find_dotenv, load_dotenv


load_dotenv(find_dotenv(".env"))


class Settings(BaseSettings):
    server_host: str
    server_port: int
    database_url: str = 'sqlite:///src/instance/database.sqlite3'
    jwt_secret: str
    jwt_algorithm: str = 'HS256'
    jwt_expiration: int = 3600


settings = Settings(
    _env_file='.env',
    _env_file_encoding='utf-8',
)
