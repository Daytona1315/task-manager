from typing import Type

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from backend.src.database.engine import create_session
from backend.src.database import tables
from backend.src.database.tables import Task
from backend.src.schemas.task_schema import (
    CreateTask, StatusTask, EditTask,
)


class TaskService:
    def __init__(self, session: Session = Depends(create_session)):
        self.session = session

    def get_tasks(self, user_id: int) -> list[Type[Task]]:
        operation = self.session.query(tables.Task).filter_by(user_id=user_id).all()
        return operation

    def _get_task_by_id(self, task_id: int, user_id: int) -> HTTPException | Type[Task]:
        operation = self.session.query(tables.Task).filter_by(user_id=user_id, id=task_id).first()
        if not operation:
            return HTTPException(404, "Task not found")
        return operation

    def get_task_by_id(self, task_id: int, user_id: int) -> Type[Task]:
        return self._get_task_by_id(task_id, user_id)

    def create_task(self, user_id: int, task_data: CreateTask) -> HTTPException | tables.Task:
        operation = tables.Task(**task_data.model_dump(), user_id=user_id)
        self.session.add(operation)
        self.session.commit()
        if not operation:
            return HTTPException(500)
        return operation

    def change_task_status(self, user_id: int, task_id: int, task_status: StatusTask) -> HTTPException | Type[Task]:
        try:
            task = self._get_task_by_id(user_id, task_id)
            for _ in task_status:
                setattr(task, 'status', task_status)
            self.session.commit()
        except Exception:
            return HTTPException(500)
        return task

    def edit_task(self, task_id: int, user_id: int, task_data: EditTask) -> HTTPException | Type[Task]:
        try:
            task = self._get_task_by_id(task_id, user_id)
            for _ in task_data:
                setattr(task, 'name', task_data.name)
                setattr(task, 'description', task_data.description)
            self.session.commit()
        except Exception:
            return HTTPException(500)
        return task

    def delete_task(self, user_id: int, task_id: int) -> HTTPException:
        try:
            task = self._get_task_by_id(user_id, task_id)
            self.session.delete(task)
            self.session.commit()
            return HTTPException(200, "Successfully deleted")
        except Exception:
            return HTTPException(404, "Task not found")
