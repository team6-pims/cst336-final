-- create the database
drop database if exists CST336_Project;
create database CST336_Project;

-- use the database
use CST336_Project;

-- create the tables
CREATE TABLE Users (
    userID INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    userName VARCHAR(45),
    password VARCHAR(45),
    adminPriv BOOLEAN
);

CREATE TABLE Products (
    itemID INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    itemName VARCHAR(45),
    price FLOAT,
    description1 VARCHAR(45),
    description2 VARCHAR(45)
);

CREATE TABLE GeneralTransactions (
    transID INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    userID INT REFERENCES Users (userID),
    trans_ts DATETIME NOT NULL
);

CREATE TABLE DetailedTransactions (
    transID INT REFERENCES GeneralTransactions (transID),
    itemID INT REFERENCES Products (itemID)
);

-- populate the tables
-- users
insert into Users values
(default, 'ad123', 'pass123', True),
(default, 'buyer', 'stars', False);


