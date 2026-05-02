import bcrypt
from fastapi import APIRouter, HTTPException
from database import supabase
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["api"])

class UserRequest(BaseModel):
    user_id: str
    
class CreateUser(BaseModel):
    user_id: str
    password: str
    
class LoginUser(BaseModel):
    user_id: str
    password: str
    
   


       
@router.post("/getUser")
def get_user(user: UserRequest):
    try: 
        existing = supabase.table("users") \
            .select("user_id") \
            .eq("user_id", user.user_id) \
            .execute()
        
        return existing.data
    except Exception as e:
        print(f"Error: {e}")
        return {"message": "Plate not found"}


@router.post("/login")
def login(user: LoginUser):
    try:
        user = supabase.table("users") \
            .select("user_id") \
            .eq("user_id", user.user_id) \
            .eq("password", user.password) \
            .execute()
        return user.data
    except Exception as e:
        print(f"Error: {e}")
        return {"message": "User not found"}

        
@router.post("/register")
def login(user: CreateUser):
    try:
        user = supabase.from_("users")\
            .insert({"user_id": user.user_id, "password": user.password})\
            .execute()
        return user.data
    except Exception as e:
        print(f"Error: {e}")
        return {"message": "User not found"}

def user_exists(key: str = "user_id", value: str = None):
    user = supabase.from_("users").select("*").eq(key, value).execute()
    return len(user.data) > 0
    
@router.get("/getUsers")
def get_users():
    existing = supabase.from_("users") \
        .select("*") \
        .execute()
    print(existing)
    return existing.data

# Create a new user
@router.post("/user")
def create_user(user: User):
    try:
        # Convert email to lowercase
        user_id = user.user_id.lower()
        # Hash password
        hased_password = bcrypt.hashpw(user.password, bcrypt.gensalt())

        # Check if user already exists
        if user_exists(value=user_email):
            return {"message": "User already exists"}

        # Add user to users table
        user = supabase.from_("users")\
            .insert({"user_id": user_id, "password": hased_password})\
            .execute()

        # Check if user was added
        if user:
            return {"message": "User created successfully"}
        else:
            return {"message": "User creation failed"}
    except Exception as e:
        print("Error: ", e)
        return {"message": "User creation failed"}


# Retrieve a user
@router.get("/user")
def get_user(user: UserRequest):
    try:
        if user_id:
            user = supabase.table("users")\
                .select("user_id")\
                .eq("user_id", user.user_id)\
                .execute()

            if user:
                return user
        else:
            users = supabase.from_("users")\
                .select("user_id")\
                .execute()
            if users:
                return users
    except Exception as e:
        print(f"Error: {e}")
        return {"message": "User not found"}