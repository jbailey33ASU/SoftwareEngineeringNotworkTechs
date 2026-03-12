import datetime
import mysql.connector
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



#Connect to MySQL Workbench
def get_db_connection():
    return mysql.connector.connect(
        host = "localhost",
        user = "genuser",
        password = "password",
        database = "parking_database"
    )

#Define Car class
class Car:
    def __init__(self, license_plate):
        self.license_plate = license_plate
        self.enter_time = datetime.datetime.now()
        self.exit_time = None
        self.exception = None
        self.exception_start = None
        self.exception_end = None
        self.exception_percent = 0


#Database Functions
def car_enters(car_obj):
    mydb = get_db_connection()
    mycursor = mydb.cursor()

    sql_insert = """
        INSERT INTO LicensePlateTracker
        (licensePlate, exception, exceptionStart, exceptionEnd, enterTime)
        VALUES (%s, %s, %s, %s, %s)
    """

    data = (
        car_obj.license_plate,
        car_obj.exception,
        car_obj.exception_start,
        car_obj.exception_end,
        car_obj.enter_time
    )

    mycursor.execute(sql_insert, data)
    mydb.commit()
    mycursor.close()
    mydb.close()
    print(f"Recorded entry for vehicle with license plate: {car_obj.license_plate}")


def car_exits(license_plate, final_fee = 0.00):
    mydb = get_db_connection()
    mycursor = mydb.cursor()

    exit_time = datetime.datetime.now()
    #update exitTime and calculatedFee
    sql_update = """
        UPDATE LicensePlateTracker
        SET exitTime = %s, calculatedFee = %s
        WHERE licensePlate = %s AND exitTime IS NULL
    """
    mycursor.execute(sql_update, (exit_time, final_fee, license_plate))

    mydb.commit()
    mycursor.close()
    mydb.close()
    print(f"Recorded exit for vehicle with license plate: {license_plate}")





if __name__ == "__main__":


    ### TESTING ###

    #car arrives
    temp_car = Car("ABC1234")
    car_enters(temp_car)

    #car leaves
    car_exits("ABC1234")

    #Fetch & print data
    test_db = get_db_connection()
    test_cursor = test_db.cursor()

    test_cursor.execute("SELECT * FROM LicensePlateTracker")
    data = test_cursor.fetchall()

    print("--- DATABASE CONTENTS ---")
    for row in data:
        print(row)

    #close connection to database
    test_cursor.close()
    test_db.close()

