# # # only a test file will delete later

# # from app.utils import hash_password, verify_password

# # password = "Hello123!"

# # hashed = hash_password(password)

# # print(hashed)

# # print(verify_password(password, hashed))
# # print(verify_password("wrongpassword", hashed))


# from app.core import SessionLocal
# from app.schemas import UserCreate
# from app.services import register_user

# db = SessionLocal()

# user = UserCreate(
#     username="john",
#     email="john@example.com",
#     password="Password123!"
# )

# try:
#     created_user = register_user(db, user)
#     print(created_user)
# except Exception as e:
#     print(e)

# db.close()

from app.utils import create_access_token, decode_access_token

token = create_access_token({"sub": "1"})

print("Token:")
print(token)

print()

payload = decode_access_token(token)

print("Payload:")
print(payload)