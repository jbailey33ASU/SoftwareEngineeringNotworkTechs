CREATE DATABASE parking_database;

CREATE TABLE DiscountProfiles (
	discountID INT AUTO_INCREMENT PRIMARY KEY, 
    profileName VARCHAR(255) NOT NULL, #ex: Employee, Patient, etc
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
    exception VARCHAR(255) NULL,
    exceptionStart DATETIME NULL,
    exceptionEnd DATETIME NULL,
    enterTime DATETIME NOT NULL,
    exitTime DATETIME NULL,
    calculatedFee DECIMAL(6,2) NULL #Final price paid
);

