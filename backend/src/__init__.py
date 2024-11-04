import uvicorn
from backend.src.settings import settings


uvicorn.run(
    'backend.src.app:app',
    host=settings.server_host,
    port=settings.server_port,
)
