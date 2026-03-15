USE parking_database;

#car_enters procedure
DROP PROCEDURE IF EXISTS car_enters;
DELIMITER $$

#car_enters procedure
CREATE procedure car_enters(
	IN p_licensePlate VARCHAR(255),
    IN p_discountID INT,
    IN p_discountStart DATETIME,
    IN p_discountEnd DATETIME,
    IN p_enterTime DATETIME
)

BEGIN
	#Make sure that the plate exists in the LicensePlate table
    INSERT IGNORE INTO LicensePlates
    (licensePlate)
    VALUES
    (p_licensePlate);
	
	INSERT INTO LicensePlateTracker
		(licensePlate, discountID, discountStart, discountEnd, enterTime)
	VALUES
		(p_licensePlate, p_discountID, p_discountStart, p_discountEnd, p_enterTime);
	
END $$
DELIMITER ;


#car_exit procedure
DROP PROCEDURE IF EXISTS car_exits;
DELIMITER $$

CREATE PROCEDURE car_exits(
	IN p_licensePlate VARCHAR(255),
    IN p_baseFee DECIMAL(6,2)
)

BEGIN
	#update record by joining LicensePlateTracker and DiscountProfiles to get percentage
	UPDATE LicensePlateTracker LPT
    LEFT JOIN DiscountProfiles DP ON LPT.discountID = DP.discountID
    SET LPT.exitTime = NOW(),
		#COALESCE returns first non-null value from joined tables (discount % from DiscountProfiles)
        #use # if discount, else use 0 [COALESCE(DP.discountPercent, 0)]
        #baseFee * (1 - (discount [as whole num] / 100))
		LPT.calculatedFee = p_baseFee * (1 - (COALESCE(DP.discountPercent, 0) / 100.0))
    WHERE LPT.licensePlate = p_licensePlate
    AND LPT.exitTime IS NULL;
    
END $$
DELIMITER ;


#create_discount_profile procedure
DROP PROCEDURE IF EXISTS create_discount_profile;
DELIMITER $$

CREATE PROCEDURE create_discount_profile(
	IN p_profileName VARCHAR(255),
    IN p_discountPercent INT
)

BEGIN
	INSERT INTO DiscountProfiles
    (profileName, discountPercent)
	VALUES
    (p_profileName, p_discountPercent);

END $$
DELIMITER ;


#register_plate_discount procedure
DROP PROCEDURE IF EXISTS register_plate_discount;
DELIMITER $$

CREATE PROCEDURE register_plate_discount(
	IN p_licensePlate VARCHAR(255),
    IN p_discountID INT
)

BEGIN
	INSERT INTO LicensePlates
    (licensePlate, discountID)
    VALUES
    (p_licensePlate, p_discountID)
    ON DUPLICATE KEY UPDATE discountID = p_discountID;
    #If plate already has discount, update with new discount
    
END $$
DELIMITER ;


#apply_discount procedure
DROP PROCEDURE IF EXISTS apply_single_discount;
DELIMITER $$

CREATE PROCEDURE apply_single_discount(
	IN p_licensePlate VARCHAR(255),
    IN p_discountID INT
)

BEGIN
	UPDATE LicensePlateTracker
    SET discountID = p_discountID
    WHERE licensePlate = p_licensePlate
    AND exitTime IS NULL;

END $$
DELIMITER ;