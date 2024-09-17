from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from ..schemas.auth_schema import (
    UserCreate,
    Token, User,
    UserLogin,
)
from ..services.auth_service import AuthService, get_current_user

router = APIRouter(
    prefix='/auth',
    tags=['auth'],
)


@router.post('/sign-up', response_model=Token)
def sign_up(user_data: UserCreate,
            service: AuthService = Depends()
            ):
    return service.register_new_user(user_data)


@router.post('/sign-in', response_model=Token)
def sign_in(form_data: UserLogin,
            service: AuthService = Depends()
            ):
    return service.authenticate_user(
        form_data.username,
        form_data.password,
    )


@router.get('/user', response_model=User)
def get_user(user: User = Depends(get_current_user)):
    return user
