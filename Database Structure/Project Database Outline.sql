CREATE DATABASE parking_database;

CREATE TABLE DiscountProfiles (
	discountID INT AUTO_INCREMENT PRIMARY KEY, 
    profileName VARCHAR(255) NOT NULL UNIQUE, #ex: Employee, Patient, etc
    discountPercent INT NOT NULL #what % off of parking price (50, 75, 100)
);

CREATE TABLE LicensePlates (
	licensePlate VARCHAR(255) PRIMARY KEY,
    discountID INT,
    FOREIGN KEY (discountID) REFERENCES DiscountProfiles(discountID)
);

CREATE TABLE LicensePlateTracker (
	id INT AUTO_INCREMENT PRIMARY KEY,
    licensePlate VARCHAR(255) NOT NULL,
    
    discountID INT NULL,
    discountStart DATETIME NULL,
    discountEnd DATETIME NULL,
    
    enterTime DATETIME NOT NULL,
    exitTime DATETIME NULL,
    calculatedFee DECIMAL(6,2) NULL, #Final price paid
    
    FOREIGN KEY (licensePlate) REFERENCES LicensePlates(licensePlate),
    FOREIGN KEY (discountID) REFERENCES DiscountProfiles(discountID)
);

#Create indexes for faster queries
#affected queries include searching for license plates, entry times, exit times,
#and vehicle lookup for cars in the garage currently
CREATE INDEX idx_license_plate ON LicensePlateTracker(licensePlate);

CREATE INDEX idx_enter_time ON LicensePlateTracker(enterTime);

CREATE INDEX idx_exit_time ON LicensePlateTracker(exitTime);

CREATE INDEX idx_active_lookup ON LicensePlateTracker(licensePlate, exitTime);
