import sqlite3
import os

db_path = os.path.abspath("sankat_mochan.db")
print("Database:", db_path)

conn = sqlite3.connect("sankat_mochan.db")
cursor = conn.cursor()

cursor.execute("PRAGMA table_info(users)")
for column in cursor.fetchall():
    print(column)

conn.close()