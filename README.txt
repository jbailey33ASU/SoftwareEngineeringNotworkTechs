# Parking Management System

## Overview
This project is a parking management system built for our software engineering project. The goal is to track vehicle entry and exit by license plate, store parking activity in a database, calculate parking fees, and support discount handling for things like employee parking or temporary events.

At the current stage of development, the database and backend logic are the most complete parts of the project. The frontend structure is in place and organized, but deeper integration between the UI and backend is still in progress.

---

## Current Features

### Database / Backend
- MySQL database schema for parking activity and discounts
- Stored procedures for:
  - recording vehicle entry
  - recording vehicle exit
  - creating discount profiles
  - registering permanent discounts
  - applying one-time discounts
- Python functions for calling stored procedures
- MySQL connection pooling for cleaner database access
- Basic test flow for simulating car entry and exit

### Frontend
- React + Vite + TypeScript project structure
- Routing and page structure for:
  - Dashboard
  - Current Vehicles
  - Recent Activity
  - Plate Lookup
  - Permits
- Bootstrap-based UI layout

---

## Tech Stack
- **Frontend:** React, Vite, TypeScript, Bootstrap, React Router
- **Backend Logic:** Python
- **Database:** MySQL
- **Planned/Discussed Infrastructure:** FastAPI / Supabase

---

## Project Structure

```text
SoftwareEngineeringNotworkTechs-main/
│
├── Parking System Management/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
│
├── Database Structure/
│   ├── App_Logic.py
│   ├── Database_Utilities.py
│   ├── Project Database Outline.sql
│   ├── Parking Database Procedures.sql
│   └── Tasks to implement
│
└── Overall UI Structure