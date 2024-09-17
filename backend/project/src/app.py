from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers.task_router import router as task_router
from .routers.auth_router import router as auth_router


tags_metadata = [
    {
        'name': 'auth',
        'description': 'Methods for registration and authorization.'
    },
    {
        'name': 'tasks',
        'description': 'Methods for managing tasks.'
    },
]


app = FastAPI(
    title='Task Manager',
    description='by Daytona1315',
    version='1.0',
    openapi_tags=tags_metadata,
)
app.include_router(task_router)
app.include_router(auth_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
