from supabase import create_client
from dotenv import load_dotenv
import os

#loads the database lmao. 
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)
