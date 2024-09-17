from pydantic_settings import BaseSettings
from dotenv import find_dotenv, load_dotenv


load_dotenv(find_dotenv(".env"))


class Settings(BaseSettings):
    server_host: str = '0.0.0.0'
    server_port: int = 5000
    database_url: str = 'sqlite:///src/instance/database.sqlite3'
    jwt_secret: str = 'SS6pDsI6PkaHDyezUqSWuDGyg4MH8kT_tieBCG7hOWk'
    jwt_algorithm: str = 'HS256'
    jwt_expiration: int = 3600


settings = Settings(
    _env_file='.env',
    _env_file_encoding='utf-8',
)
