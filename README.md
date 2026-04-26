# Super Parking Manager Pro Prereq List/What they do 

 

Hey y’all, I have done lots of research (and copying what some guy on youtube did), to get the barebones setup for the project in a way that actually matters. I’ll try to put all the relevant information in this doc.  

 

## 1: Overview 

The smart guy at youtube.com setup the project this way, and it is what I did as well. It will be using React for the frontend. This is my weakest part so if anyone wants it, go nuts. 
	FastAPI for the backend. Easy to setup python server on your machine. It’s a little annoying to setup but it works well from my experience. Even my shitty laptop can use it just fine. 

Supabase for the SQL database. It uses PostgreSQL (Which I have learned has some small differences in formatting so be warned). I can invite all of yall to that as you need it. It’s also got a python library for ease of use which is very nice. 

 

## 2: Prerequisites 

Python is gonna be used for like everything here. Get it nerds. If you are fresh installing it, BE SURE TO HIT THE BOX THAT SAYS “Add Python to PATH” 

For React, you will need node.js. Campbell was already talking about this but go ahead and install it too. (nodejs.org) 

Git for contributions and such 

I’ve been using VS code, idk how different other coding apps are but in theory all of the steps should be the same. 

 

## 3: Get the project from Github stoopid 

If you can’t figure this one out I think we have to put you down 

The primary folder is “parking-manager” 

 

## 4: Setting everything up 

Your .env file should already be properly setup from Github. From what I read online, this should NEVER EVER BE SHARED EVER, but idrc so go nuts. 

 

Next, use a VM to run everything on. This one I’m not quite sure why I’m doing, but the funny youtube man told me to, and it works. 

 

1: open command prompt and navigate to the backend folder. “C:\Users\YouDumbass\WhereeverYouPutIt\parking-manager\backend" 

2:  Create vm with `python -m venv venv` (only needed once I think) 

3: You must do this every time you try to run the fastAPI window. `venv\Scripts\activate`. You should see `(venv)` at the beginning of your terminal line now. 

4: While the VM is active, you’ll need the following dependencies IN THE VM. `pip install fastapi uvicorn supabase python-dotenv`

 

FastAPI is the web framework. Does a few other cool things too but I’m not smart enough for all of that 

Uvicorn is the server that runs the fastAPI app 

Supabase is the SQL  

Python-dotenv reads the .env credentials so they are secure and unchangeable. (This isn’t needed since idc about security for this project, but it can’t hurt and I already set it up.) 

 

## 5: With the VM active and everything installed, run “uvicorn main:app –reload". 
You should see:   

`INFO: Uvicorn running on http://127.0.0.1:8000`

`INFO: Application startup complete.` 

If you don’t, skill issue. The error messages I got when I was trying to set it up were very descriptive and helpful so just do some research or yell at me. 

(--reload makes the server auto restart when you change any of the python files, useful for changing code while running it) 

6: open http://localhost:8000/docs in your browser. If it worked, woo, if not, lmao. 