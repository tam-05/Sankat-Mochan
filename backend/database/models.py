from sqlalchemy import Column, Integer, String
from .database import Base
from sqlalchemy import DateTime
from sqlalchemy.sql import func


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(String, unique=True, index=True, nullable=False)

    password = Column(String, nullable=False)

    last_active = Column(
    DateTime(timezone=True),
    server_default=func.now(),
    nullable=False
)