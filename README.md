# Super Parking Manager Pro Prereq List/What they do 
 

## 1: Overview 

React/node.js frontend, python backend, supabase postgresql database

Supabase for the PostgreSQL database. 

 

## 2: Prerequisites 

Python is gonna be used for the backend server. If you are fresh installing it, BE SURE TO HIT THE BOX THAT SAYS “Add Python to PATH” 

For the React frontend server, you will need node.js (nodejs.org) 

Git for contributions and such 

fancy text editor of choice (no, vscode is not an ide, it is a fancy text editor). 

 

## 3: Get the project from Github

The primary folders are "Parking System Management" (frontend) and "parking-manager\backend" (backend) 

 

## 4: Setting everything up 

Your .env file should already be properly setup from Github. From what I read online, this should NEVER EVER BE SHARED EVER, but idrc so go nuts. 


### Frontend

You must have node.js installed to run the front end (https://nodejs.org/en/download)

1: open command prompt and navigate to the frontend folder (InstallPath\Parking System Management)

2: install the dependencies via npm by running `npm install`

3: start the frontend server by running `npm run start`

Use any of the provided addresses to open the website in your browser (Note: the backend server must also be running for the website to be functional)


### Backend
 

1: open git bash (https://git-scm.com/install/) and navigate to the backend folder. “C:\Users\YouDumbass\WhereeverYouPutIt\parking-manager\backend" 

2:  Create vm with `python -m venv venv` (only needed once I think) 

3: You must do this every time you try to run the fastAPI window. `source venv\Scripts\activate`. You should see `(venv)` at the beginning of your terminal line now. 

4: While the VM is active, you’ll need the following dependencies IN THE VM. `pip install -r requirements.txt`

 

FastAPI is the web framework.  

Uvicorn is the server that runs the fastAPI app 

Supabase is the SQL 

Python-dotenv reads the .env credentials so they are secure and unchangeable. 

 

## 5: With the VM active and everything installed, run `uvicorn main:app -–reload`. 
You should see:   

`INFO: Uvicorn running on http://127.0.0.1:8000`

`INFO: Application startup complete.` 

(--reload makes the server auto restart when you change any of the python files, useful for changing code while running it) 

pro tip: open http://localhost:8000/docs in your browser for a list of backend api endpoints
