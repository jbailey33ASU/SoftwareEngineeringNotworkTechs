#!/bin/bash
python3 -m venv venv
venv/Scripts/activate
pip install -r requirements.txt
uvicorn main:app --reload