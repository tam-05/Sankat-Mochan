from database.database import SessionLocal
from database.models import User

db = SessionLocal()

users = db.query(User).all()

for user in users:
    print(user.name)
    print(user.email)
    print(user.last_active)