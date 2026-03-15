import datetime
import mysql.connector
from mysql.connector import pooling

#defined functions use try and finally in case any code crashes during the try. Finally allows the .close() to run
#and return the connections to the pool to prevent leaks and not run out of connections.

#Create pool once the application starts
db_pool = pooling.MySQLConnectionPool(
    pool_name = "garage_pool",
    pool_size = 10, #Keeps 10 connections open and ready
    pool_reset_session = True,
    host = "localhost",
    user = "genuser",
    password = "password",
    database = "parking_database"
)


#Connect to MySQL Workbench
def get_db_connection():
    return db_pool.get_connection()

#Define Car class
class Car:
    def __init__(self, license_plate):
        self.license_plate = license_plate
        self.enter_time = datetime.datetime.now()
        self.exit_time = None
        self.discountID = None
        self.discount_start = None
        self.discount_end = None
        self.discount_percent = 0


#Database Functions
def car_enters(car_obj):
    mydb = get_db_connection()
    mycursor = mydb.cursor()

    try:
    #Arguments MUST match the order from the 'car_enters' procedure
        proc_args = [
            car_obj.license_plate,
            car_obj.discountID,
            car_obj.discount_start,
            car_obj.discount_end,
            car_obj.enter_time
        ]

        #call stored procedure car_enters(license plate, discountID, discountStart, discountEnd, enterTime)
        mycursor.callproc('car_enters', proc_args)

        mydb.commit()
        print(f"Recorded entry for vehicle with license plate: {car_obj.license_plate}")

    finally:
        mycursor.close()
        mydb.close() #returns the connection back to the pool
    

def car_exits(license_plate, final_fee = 0.00):
    mydb = get_db_connection()
    mycursor = mydb.cursor()

    try:
        #call stored procedure car_exits(license plate, fee)
        mycursor.callproc('car_exits', [license_plate, final_fee])

        mydb.commit()
        print(f"Recorded exit for vehicle with license plate: {license_plate}")

    finally:
        mycursor.close()
        mydb.close() #return connection to pool





if __name__ == "__main__":


    ### TESTING ###
    #1. Setup discount profile
    #2. Test normal vehicle entry
    #3. Test entry with no discount
    #4. Test exit
    #5. Print results
    
    #1.
    test_db = get_db_connection()
    test_cursor = test_db.cursor()

    try:
        test_cursor.callproc('create_discount_profile', ["Employee", 50])
        test_db.commit()
    except Exception as e:
        print(f"NOTE: Profile might already exist: {e}")

    finally:
        test_cursor.close()
        test_db.close()

    #2.
    car1 = Car("ZYX9876")
    car1.discountID = 1
    car_enters(car1)

    #3.
    car2 = Car("SDF8732")
    car_enters(car2)

    #4
    print("\n--- PROCESSING EXITS ---")
    car_exits("ZYX9876", 20.00)#should have discount ($10)
    car_exits("SDF8732", 20.00)#should have NO discount ($20)

    #5
    print("\n\n--- FINAL DATABASE STATE ---")
    verify_db = get_db_connection()
    verify_cursor = verify_db.cursor()

    verify_cursor.execute("SELECT LicensePlate, enterTime, exitTime, calculatedFee FROM LicensePlateTracker")
    rows = verify_cursor.fetchall()

    for row in rows:
        print(f"Plate: {row[0]} | In: {row[1]} | Out: {row[2]} | Paid: {row[3]}")

    verify_cursor.close()
    verify_db.close()
