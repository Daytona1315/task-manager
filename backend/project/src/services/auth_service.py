from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.hash import bcrypt
from pydantic import ValidationError
from starlette import status
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from starlette.responses import JSONResponse
from starlette.status import (
    HTTP_409_CONFLICT,
    HTTP_404_NOT_FOUND,
    HTTP_401_UNAUTHORIZED, HTTP_422_UNPROCESSABLE_ENTITY,
)
from ..database import tables
from ..database.engine import create_session
from ..database.tables import User
from ..schemas.auth_schema import User, Token, UserCreate
from ..settings import settings


oauth2_schema = OAuth2PasswordBearer(tokenUrl='auth/sign-in')


exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail='Could not validate credentials',
    headers={
        'WWW-Authenticate': 'Bearer'
    }
)


def get_current_user(token: str = Depends(oauth2_schema)) -> User:
    return AuthService.validate_token(token)


class AuthService:
    @classmethod
    def verify_password(cls, raw_password: str, hash_password: str) -> bool:
        return bcrypt.verify(raw_password, hash_password)

    @classmethod
    def hash_password(cls, password: str) -> str:
        return bcrypt.hash(password)

    @classmethod
    def validate_token(cls, token: str) -> User:
        try:
            payload = jwt.decode(
                token,
                settings.jwt_secret,
                algorithms=[settings.jwt_algorithm],
            )
        except JWTError:
            raise exception from None

        user_data = payload.get('user')

        try:
            user = User.model_validate(user_data)
        except ValidationError:
            raise exception from None

        return user

    @classmethod
    def create_token(cls, user: User, ) -> Token | dict:
        user_data = User.model_validate(user)

        now = datetime.utcnow()
        payload = {
            'iat': now,
            'nbf': now,
            'exp': now + timedelta(settings.jwt_expiration),
            'sub': str(user_data.id),
            'user': user_data.model_dump(),
        }
        token = jwt.encode(
            payload,
            settings.jwt_secret,
            algorithm=settings.jwt_algorithm,
        )
        return Token(access_token=token)

    def __init__(self, session: Session = Depends(create_session)):
        self.session = session

    def register_new_user(self, user_data: UserCreate) -> Token | JSONResponse:
        user = (
            self.session
            .query(tables.User)
            .filter(tables.User.username == user_data.username)
            .first()
        )
        if not user:
            user = tables.User(
                email=user_data.email,
                username=user_data.username,
                hashed_password=self.hash_password(user_data.password)
            )
            self.session.add(user)
            self.session.commit()
            return self.create_token(user)
        else:
            return JSONResponse(status_code=HTTP_409_CONFLICT,
                                content={
                                    "error": {
                                        "message": "E-mail already exist",
                                        "status_code": "HTTP_409_CONFLICT"
                                    }
                                })

    def authenticate_user(self, username: str, password: str) -> Token | JSONResponse:
        user = (
            self.session
            .query(tables.User)
            .filter(tables.User.username == username)
            .first()
        )

        if not user:
            return JSONResponse(status_code=HTTP_404_NOT_FOUND,
                                content={
                                    "error": {
                                        "message": "User not found",
                                        "status_code": "HTTP_404_NOT_FOUND"
                                    }
                                })

        if not self.verify_password(password, user.hashed_password):
            return JSONResponse(status_code=HTTP_401_UNAUTHORIZED,
                                content={
                                    "error": {
                                        "message": "Password is incorrect",
                                        "status_code": "HTTP_401_UNAUTHORIZED"
                                    }
                                })
        return self.create_token(user)
