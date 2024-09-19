from typing import Type

from fastapi import Depends
from sqlalchemy.orm import Session
from starlette.responses import JSONResponse
from starlette.status import (
    HTTP_404_NOT_FOUND, HTTP_500_INTERNAL_SERVER_ERROR,
)

from ..database.engine import create_session
from ..database import tables
from ..database.tables import Task
from ..schemas.task_schema import (
    CreateTask, StatusTask, EditTask,
)


class TaskService:
    def __init__(self, session: Session = Depends(create_session)):
        self.session = session

    def get_tasks(self, user_id: int) -> JSONResponse | list[Type[Task]]:
        operation = self.session.query(tables.Task).filter_by(user_id=user_id).all()
        if not operation:
            return JSONResponse(status_code=HTTP_404_NOT_FOUND,
                                content={
                                    "success": False,
                                    "error": {
                                        "message": "No tasks found",
                                        "status_code": "HTTP_404_NOT_FOUND"
                                    }
                                })
        return operation

    def _get_task_by_id(self, task_id: int, user_id: int) -> JSONResponse | Type[Task]:
        operation = self.session.query(tables.Task).filter_by(user_id=user_id, id=task_id).first()
        if not operation:
            return JSONResponse(status_code=HTTP_404_NOT_FOUND,
                                content={
                                    "success": False,
                                    "error": {
                                        "message": "Nothing found",
                                        "status_code": "HTTP_404_NOT_FOUND",
                                        "received_values": f"taskId, userId: {task_id, user_id}"
                                    }
                                })
        return operation

    def get_task_by_id(self, task_id: int, user_id: int) -> JSONResponse | Type[Task]:
        return self._get_task_by_id(task_id, user_id)

    def create_task(self, user_id: int, task_data: CreateTask) -> tables.Task | JSONResponse:
        operation = tables.Task(**task_data.model_dump(), user_id=user_id)
        self.session.add(operation)
        self.session.commit()
        if not operation:
            return JSONResponse(status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                                content={
                                    "error": {
                                        "message": "Something went wrong",
                                        "status_code": "HTTP_500_INTERNAL_SERVER_ERROR",
                                        "received_values": f"userId: {user_id},"
                                                           f"taskData: {task_data}"
                                    }
                                })
        return operation

    def change_task(self, user_id: int, task_id: int, task_status: StatusTask) -> JSONResponse | Type[Task]:
        try:
            task = self._get_task_by_id(user_id, task_id)
            for _ in task_status:
                setattr(task, 'status', task_status)
            self.session.commit()
        except Exception:
            return JSONResponse(status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                                content={
                                    "error": {
                                        "message": "Something went wrong",
                                        "status_code": "HTTP_500_INTERNAL_SERVER_ERROR",
                                        "received_values": f"userId: {user_id},"
                                                           f"taskId: {task_id},"
                                                           f"taskStatus: {task_status}"

                                    }
                                })
        return task

    def edit_task(self, task_id: int, user_id: int, task_data: EditTask) -> JSONResponse | Type[Task]:
        try:
            task = self._get_task_by_id(task_id, user_id)
            for _ in task_data:
                setattr(task, 'name', task_data.name)
                setattr(task, 'description', task_data.description)
            self.session.commit()
        except Exception:
            return JSONResponse(status_code=HTTP_500_INTERNAL_SERVER_ERROR,
                                content={
                                    "error": {
                                        "message": "Something went wrong",
                                        "status_code": "HTTP_500_INTERNAL_SERVER_ERROR",
                                        "received_values": f"userId: {user_id},"
                                                           f"taskId: {task_id},"
                                                           f"taskData: {task_data}"

                                    }
                                })
        return task

    def delete_task(self, user_id: int, task_id: int):
        task = self._get_task_by_id(user_id, task_id)
        self.session.delete(task)
        self.session.commit()
