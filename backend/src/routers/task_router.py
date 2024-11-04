from typing import List

from fastapi import (
    APIRouter, Depends,
)

from backend.src.schemas.task_schema import (
    StatusTask, BaseTask, CreateTask, EditTask,
)
from backend.src.schemas.auth_schema import User
from backend.src.services.task_service import TaskService
from backend.src.services.auth_service import get_current_user


router = APIRouter(
    prefix='/tasks',
    tags=['tasks'],
)


@router.get('/', response_model=List[BaseTask])
def get_tasks(
        user: User = Depends(get_current_user),
        service: TaskService = Depends(),
):
    return service.get_tasks(user.id)


@router.get('/{task_id}', response_model=BaseTask)
def get_task_by_id(
        task_id: int,
        user: User = Depends(get_current_user),
        service: TaskService = Depends()
):
    return service.get_task_by_id(task_id, user.id)


@router.post('/', response_model=BaseTask)
def create_task(
        task_data: CreateTask,
        user: User = Depends(get_current_user),
        service: TaskService = Depends()
):
    return service.create_task(user.id, task_data)


@router.put('/{task_id}', response_model=BaseTask)
def change_status(
        task_id: int,
        task_status: StatusTask,
        user: User = Depends(get_current_user),
        service: TaskService = Depends(),
):
    return service.change_task_status(task_id, user.id, task_status=task_status)


@router.put('/edit/{task_id}/', response_model=EditTask)
def edit_task(
        task_id: int,
        task_data: EditTask,
        user: User = Depends(get_current_user),
        service: TaskService = Depends(),
):
    return service.edit_task(task_id, user.id, task_data)


@router.delete('/{task_id}')
def delete_task(
        task_id: int,
        user: User = Depends(get_current_user),
        service: TaskService = Depends(),
):
    return service.delete_task(task_id, user.id)
