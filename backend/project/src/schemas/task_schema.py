from pydantic import BaseModel
from datetime import datetime
from enum import Enum


class StatusTask(str, Enum):
    active: str = 'active'
    inactive: str = 'inactive'


class CreateTask(BaseModel):
    name: str = 'Unnamed task'
    description: str = 'No description'
    created_at: datetime


class BaseTask(CreateTask):
    id: int
    status: StatusTask = 'active'

    class ConfigTask:
        from_attributes: True


class EditTask(BaseModel):
    name: str
    description: str


class ChangeStatusTask(BaseModel):
    status: StatusTask
