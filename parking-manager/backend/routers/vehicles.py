from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timezone
from database import supabase
from config import get_hourly_rate, calculate_fee

router = APIRouter(prefix="/vehicles", tags=["vehicles"])


# --- Request Bodies ---

class PlateRequest(BaseModel):
    license_plate: str


#Checks if a license plate exists. If it doesn't, it assumes there is no
#Discount ID

def ensure_plate_registered(license_plate: str):
    existing = supabase.table("LicensePlates") \
        .select("licensePlate") \
        .eq("licensePlate", license_plate) \
        .execute()

    if not existing.data:
        supabase.table("LicensePlates").insert({
            "licensePlate": license_plate,
            "discountID": None
        }).execute()


#""" Tries to find the discount for a license plate
#    TO DO: I know I sort of changed up the SQL tables
#    But the idea is that we have one table with preset
#    percentages and reasons, so you can assign a license plate
#    a 'Student' tag or something similar """

def get_discount(license_plate: str) -> tuple[int | None, int]:
    result = supabase.table("LicensePlates") \
        .select("discountID, DiscountProfiles(discountPercent)") \
        .eq("licensePlate", license_plate) \
        .single() \
        .execute()

    data = result.data
    if not data or not data.get("DiscountProfiles"):
        return None, 0

    return data["discountID"], data["DiscountProfiles"]["discountPercent"]


#Checks for an active session for a license plate.

def get_active_session(license_plate: str):
    result = supabase.table("LicensePlateTracker") \
        .select("*") \
        .eq("licensePlate", license_plate) \
        .is_("exitTime", "null") \
        .order("enterTime", desc=True) \
        .limit(1) \
        .execute()

    return result.data[0] if result.data else None


# POST function that can be used in FastAPI
# By giving a string value into the UI, you can add it into supabase.
# This took a while to figure out, but it does actually work now
# Though I'm not quite sure how or why
# If you have any issues with this, let me know I can do some
# Investigation

@router.post("/checkin")
def checkin(body: PlateRequest):
    plate = body.license_plate.upper().strip()

    # Auto-register if plate is unknown
    ensure_plate_registered(plate)

    # failsafe for double active sessions.
    active = get_active_session(plate)
    if active:
        raise HTTPException(
            status_code=400,
            detail=f"{plate} is already checked in (session ID {active['id']})."
        )

    discount_id, _ = get_discount(plate)
    now = datetime.now(timezone.utc)

    # Insert function for Supabase.
    # isoformat keeps the time in a nice legible fashion for the SQL table
    
    session = supabase.table("LicensePlateTracker").insert({
        "licensePlate": plate,
        "discountID": discount_id,
        "discountStart": now.isoformat() if discount_id else None,
        "enterTime": now.isoformat(),
        "exitTime": None,
        "calculatedFee": None
    }).execute()

    # Debug statements below to make sure everything worked.
    return {
        "message": f"{plate} checked in successfully.",
        "session_id": session.data[0]["id"],
        "enter_time": now.isoformat(),
        "discount_applied": discount_id is not None
    }


# The other POST function you can see in FastAPI
# This one doesn't work
# I get errors with the calculate fee, I'll look into it later
# TODO: Fix the fucking code moron -Jason to himself

@router.post("/checkout")
def checkout(body: PlateRequest):
    plate = body.license_plate.upper().strip()

    #Check to make sure its a real license plate
    ensure_plate_registered(plate)

    now = datetime.now(timezone.utc)
    active = get_active_session(plate)

    # If no active session, auto-create and immediately close it
    # I think this is the safest bet
    if not active:
        discount_id, _ = get_discount(plate)
        ghost = supabase.table("LicensePlateTracker").insert({
            "licensePlate": plate,
            "discountID": discount_id,
            "discountStart": None,
            "enterTime": now.isoformat(),
            "exitTime": now.isoformat(),
            "calculatedFee": 0.00
        }).execute()
        
    # Debug Messages for no plate
        return {
            "message": f"No active session found for {plate}. A $0.00 session was logged.",
            "session_id": ghost.data[0]["id"],
            "fee_charged": "0.00"
        }

    # Normal plate checkout assuming they exist
    enter_time = datetime.fromisoformat(active["enterTime"])
    discount_id = active["discountID"]
    discount_percent = 0

    if discount_id:
        _, discount_percent = get_discount(plate)

    hourly_rate = get_hourly_rate()
    fee = calculate_fee(enter_time, now, hourly_rate, discount_percent)

    supabase.table("LicensePlateTracker").update({
        "exitTime": now.isoformat(),
        "discountEnd": now.isoformat() if discount_id else None,
        "calculatedFee": str(fee)
    }).eq("id", active["id"]).execute()

    return {
        "message": f"{plate} checked out successfully.",
        "session_id": active["id"],
        "enter_time": active["enterTime"],
        "exit_time": now.isoformat(),
        "discount_percent": discount_percent,
        "hourly_rate": str(hourly_rate),
        "fee_charged": str(fee)
    }


# Last FastAPI command. Just grabs you a table of "active" vehicles.

@router.get("/active")
def get_active_vehicles():
    result = supabase.table("LicensePlateTracker") \
        .select("id, licensePlate, enterTime, discountID") \
        .is_("exitTime", "null") \
        .order("enterTime", desc=False) \
        .execute()

    return {
        "active_count": len(result.data),
        "vehicles": result.data
    }
