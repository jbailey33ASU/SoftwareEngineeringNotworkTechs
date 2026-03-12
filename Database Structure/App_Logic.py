from Database_Utilities import get_db_connection
#from mysql.connector import pooling

#implement pooling into functions
#Pooling helps keep connections to the database open so that
#there is no need to open and close so many instances

#Create pool once the application starts
"""
db_pool = pooling.MySQLConnectionPool(
    pool_name = "garage_pool",
    pool_size = 10, #Keeps 10 connections open and ready
    pool_reset_session = True,
    host = "localhost",
    user = "genuser",
    password = "password",
    database = "parking_database"
)
"""


def create_discount_profile(profile_name, discount_percent):
    #Add category (ex, Employee, Patient, etc.) to DiscountProfiles table
    mydb = get_db_connection()
    mycursor = mydb.cursor()

    sql = "INSERT INTO DiscountProfiles (profileName, discountPercent) VALUES (%s, %s)"
    mycursor.execute(sql, (profile_name, discount_percent))

    mydb.commit()
    mycursor.close()
    mydb.close()
    print(f"Created discount profile: '{profile_name}' at {discount_percent}% off.")

def apply_exception(license_plate, exception_name):
    mydb = get_db_connection()
    mycursor = mydb.cursor()

    #Example logic to update active parking session with an exception
    sql = "UPDATE LicensePlateTracker SET exception = %s WHERE licensePlate = %s AND exitTime IS NULL"
    mycursor.execute(sql, (exception_name, license_plate))

    mydb.commit()
    mycursor.close()
    mydb.close()
    print(f"Applied exception '{exception_name}' to plate {license_plate}")

def register_plate_for_discount(license_plate, discount_id):
    #Link specific plate to discount ID in LicensePlates table
    mydb = get_db_connection()
    mycursor = mydb.cursor()

    sql = "INSERT INTO LicensePlates (licensePlate, discountID) VALUES (%s, %s)"
    mycursor.execute(sql, (license_plate, discount_id))

    mydb.commit()
    mycursor.close()
    mydb.close()
    print(f"Registered license plate {license_plate} for discount ID {discount_id}.")
