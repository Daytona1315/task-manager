from sqlalchemy import create_engine
from sqlalchemy.orm.session import sessionmaker

from ..settings import settings

engine = create_engine(
    settings.database_url,
    connect_args={'check_same_thread': False}
)


Session = sessionmaker(
    engine,
    autoflush=False,
    autocommit=False,
)


def create_session() -> Session:
    session = Session()
    try:
        yield session
    finally:
        session.close()
