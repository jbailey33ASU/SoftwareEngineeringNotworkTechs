from decimal import Decimal
from database import supabase

# Static Grace Period Timer

# TODO
# Make this a value in an SQL table for easy editing
# By the frontend later on
GRACE_PERIOD_MINUTES = 15

# I made the hourly rate be a value in the table
# I think this is the easiest way to make it changeable on the frontend
# If the end user wants to update the values
def get_hourly_rate() -> Decimal:
    result = supabase.table("ParkingConfig") \
        .select("configValue") \
        .eq("configKey", "hourly_rate") \
        .single() \
        .execute()
    return Decimal(result.data["configValue"])

# This function sucks ass
# It doesn't work
# lmao

# I'll fix it later -Jason
def calculate_fee(
    enter_time,
    exit_time,
    hourly_rate: Decimal,
    discount_percent: int = 0
) -> Decimal:
    total_minutes = (exit_time - enter_time).total_seconds() / 60

    # Grace period. Currently just a static value at the top.
    # Also plan on eventually making an SQL table for all of the config stuff
    if total_minutes <= GRACE_PERIOD_MINUTES:
        return Decimal("0.00")

    billable_minutes = total_minutes - GRACE_PERIOD_MINUTES
    # Ceiling division
    billable_hours = -(-int(billable_minutes) // 60) 

    gross_fee = Decimal(billable_hours) * hourly_rate

    if discount_percent > 0:
        multiplier = Decimal(1) - Decimal(discount_percent) / Decimal(100)
        return (gross_fee * multiplier).quantize(Decimal("0.01"))

    return gross_fee.quantize(Decimal("0.01"))
