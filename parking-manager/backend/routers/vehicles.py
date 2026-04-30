from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timezone
from database import supabase
from config import get_hourly_rate, calculate_fee

router = APIRouter(prefix="/vehicles", tags=["vehicles"])


# --- Request Bodies ---

class PlateRequest(BaseModel):
    license_plate: str

class DiscountProfileRequest(BaseModel):
    profile_name: str
    discount_percent: int

class ApplyDiscountRequest(BaseModel):
    license_plate: str
    profile_name: str
    

#Gets total plate count in database
@router.get("/total")
def get_plate_count():
    existing = supabase.table("LicensePlates") \
        .select("licensePlate") \
        .execute()
    return len(existing.data)
    
@router.get("/activeTotal")
def get_plate_count():
    existing = supabase.table("LicensePlateTracker") \
        .select("licensePlate") \
        .is_("exitTime", "null") \
        .execute()
    return len(existing.data)

@router.get("/plates")
def get_all_plates():
    existing = supabase.table("LicensePlateTracker") \
        .select("*") \
        .execute()
    return existing.data
    
@router.get("/activePlates")
def get_all_plates():
    existing = supabase.table("LicensePlateTracker") \
        .select("*") \
        .is_("exitTime", "null") \
        .execute()
    return existing.data
    

@router.get("/recentEntries")
def get_all_plates():
    existing = supabase.table("LicensePlateTracker") \
        .select("*") \
        .order("enterTime", desc=True) \
        .execute()
    return existing.data
    
@router.get("/recentExits")
def get_all_plates():
    existing = supabase.table("LicensePlateTracker") \
        .select("*") \
        .not_.is_("exitTime", "null") \
        .order("exitTime", desc=True) \
        .execute()
    return existing.data
    

    
    
@router.get("/discountedPlates")
def get_discounted_plates():
    existing = supabase.table("LicensePlateTracker") \
        .select("*,DiscountProfiles!inner(*)") \
        .not_.is_("discountID", "null") \
        .execute()
    return existing.data 
       
@router.get("/plate")
def get_plate(license_plate: PlateRequest):
    try: 
        existing = supabase.table("LicensePlateTracker") \
            .select(license_plate.license_plate) \
            .execute()
        
        return existing.data
    except Exception as e:
        print(f"Error: {e}")
        return {"message": "Plate not found"}


    
@router.get("/rates")
def get_hourly_rate():
    existing = supabase.table("ParkingConfig") \
        .select("*") \
        .execute()
    return existing.data


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
# This one now works! 
# The supabase was getting the time without a timezone, but the imported exit time was trying to use a timezone
# Changed some lines in the config to strip the timezone of each one.

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


    #D ebugging
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

# POST function to create discount profiles
# Input is a string which will be used for a short description, and a discount percent (As a whole number)
# Example, "Student", 50: would be a 50% discount with the name Student


@router.post("/discounts/create")
def create_discount_profile(body: DiscountProfileRequest):
    
    # Validate discount percent is between 0 and 100
    if not (0 <= body.discount_percent <= 100):
        raise HTTPException(
            status_code=400,
            detail="discount_percent must be between 0 and 100."
        )

    # Check if a profile with this name already exists
    existing = supabase.table("DiscountProfiles") \
        .select("discountID") \
        .eq("profileName", body.profile_name) \
        .execute()

    if existing.data:
        raise HTTPException(
            status_code=400,
            detail=f"A discount profile named '{body.profile_name}' already exists."
        )

    result = supabase.table("DiscountProfiles").insert({
        "profileName": body.profile_name,
        "discountPercent": body.discount_percent
    }).execute()

    created = result.data[0]

    return {
        "message": f"Discount profile '{created['profileName']}' created successfully.",
        "discountID": created["discountID"],
        "profileName": created["profileName"],
        "discountPercent": created["discountPercent"]
    }

# POST Function for assigning a discount to a license plate
# Currently, it requires an exact string match to the discount name
# This was done so when we work on the frontend, we can make a dropdown of the discount Names
# Instead of the IDs

@router.post("/discounts/apply")
def apply_discount(body: ApplyDiscountRequest):
    plate = body.license_plate.upper().strip()

    # Auto-register plate if it doesn't exist
    ensure_plate_registered(plate)

    # Verify the discount profile actually exists
    discount = supabase.table("DiscountProfiles") \
    .select("discountID, profileName, discountPercent") \
    .eq("profileName", body.profile_name) \
    .execute()

    if not discount.data:
        raise HTTPException(
            status_code=404,
            detail=f"No discount profile named '{body.profile_name}' found."
        )   

    profile = discount.data[0]
    
    # Apply the discount to the license plate
    supabase.table("LicensePlates") \
    .update({"discountID": profile["discountID"]}) \
    .eq("licensePlate", plate) \
    .execute()

    

    return {
        "message": f"Discount '{profile['profileName']}' applied to {plate} successfully.",
        "licensePlate": plate,
        "discountID": profile["discountID"],
        "profileName": profile["profileName"],
        "discountPercent": profile["discountPercent"]
    }