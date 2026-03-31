from Database_Utilities import get_db_connection

#Pooling is imported from Database_Utilities.py file

def create_discount_profile(profile_name, discount_percent):
    #Add category (ex, Employee, Patient, etc.) to DiscountProfiles table
    mydb = get_db_connection()
    mycursor = mydb.cursor()

    try:
        #Call stored procedure create_discount_profile(name, percent)
        mycursor.callproc('create_discount_profile', [profile_name, discount_percent])

        mydb.commit()
        print(f"Created discount profile: '{profile_name}' at {discount_percent}% off.")
        
    finally:
        mycursor.close()
        mydb.close()
    

def apply_single_discount(license_plate, discount_id):
    #USE FOR TEMPORARY DISCOUNTS
    #ONLY APPLIES DISCOUNT FOR CURRENT VISIT
    mydb = get_db_connection()
    mycursor = mydb.cursor()

    try:
        #Call stored procedure apply_discount(license plate, discountID) to update session
        mycursor.callproc('apply_single_discount', [license_plate, discount_id])

        #Fetch specific profile name to print
        sql = "SELECT profileName FROM DiscountProfiles WHERE discountID = %s"
        mycursor.execute(sql, (discount_id,))
        result = mycursor.fetchone()

        mydb.commit()
        if result:
            print(f"Applied one time discount '{result[0]}' to plate {license_plate}.")
        else:
            print(f"Applied one time discount - discount ID {discount_id} to plate {license_plate} : (Profile name not found).")

    finally:
        mycursor.close()
        mydb.close()

    

def register_plate_discount(license_plate, discount_id):
    #Link specific plate to discount ID in LicensePlates table
    #USE FOR PERMANENT DISCOUNTS
    #APPLIES DISCOUNT FOR ALL VISITS
    mydb = get_db_connection()
    mycursor = mydb.cursor()

    try:
        #Call stored procedure register_plate_discount(license plate, discount ID)
        mycursor.callproc('register_plate_discount', [license_plate, discount_id])

        mydb.commit()
        print(f"Registered license plate {license_plate} for discount ID {discount_id}.")

    finally:
        mycursor.close()
        mydb.close()
