from dotenv import load_dotenv
load_dotenv()
#Loads .env settings. This is how you get the API keys and stuff.

from fastapi import FastAPI

#Imports the vehicles code.
from routers.vehicles import router as vehicles_router


#Creating FastAPI app, getting the route files. This is what uvicorn sees when
#You run the main:app command.
app = FastAPI(title="Parking Garage Manager")
app.include_router(vehicles_router)

#FastAPI Function to make sure the server/connection is all setup.
@app.get("/ping")
def ping():
    return {"status": "ok"}
