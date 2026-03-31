from fastapi import APIRouter, HTTPException
from database.database import get_users, save_users
from models.user.userModel import User

router = APIRouter()


@router.get("/")
def get_all_users():
    users = get_users()
    return [
        {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
        for user in users
    ]


@router.post("/register")
def register_user(user: User):
    users = get_users()

    for existing_user in users:
        if existing_user["email"].lower() == user.email.lower():
            raise HTTPException(status_code=400, detail="Email already exists")

    new_id = 1 if not users else max(u["id"] for u in users) + 1

    new_user = user.dict()
    new_user["id"] = new_id

    users.append(new_user)
    save_users(users)

    return {
        "message": "User registered successfully",
        "user": {
            "id": new_user["id"],
            "name": new_user["name"],
            "email": new_user["email"],
            "role": new_user["role"]
        }
    }


@router.post("/login")
def login_user(login_data: dict):
    email = login_data.get("email", "").strip().lower()
    password = login_data.get("password", "").strip()

    users = get_users()

    for user in users:
        if user["email"].lower() == email and user["password"] == password:
            return {
                "message": "Login successful",
                "user": {
                    "id": user["id"],
                    "name": user["name"],
                    "email": user["email"],
                    "role": user["role"]
                }
            }

    raise HTTPException(status_code=401, detail="Invalid email or password")


@router.delete("/{user_id}")
def delete_user(user_id: int):
    users = get_users()
    filtered_users = [user for user in users if user["id"] != user_id]

    if len(filtered_users) == len(users):
        raise HTTPException(status_code=404, detail="User not found")

    save_users(filtered_users)
    return {"message": "User deleted successfully"}