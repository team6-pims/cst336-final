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
    price VARCHAR(20),
    description1 VARCHAR(500),
    description2 VARCHAR(250)
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
(default, 'admin', 'pass123', True),
(default, 'buyer', 'stars', False);

-- products
INSERT INTO Products VALUES
-- Stars
(default, 'Hyper-giants', '10,000,000,000', 'The largest of the largest stars in existence. They are typically blue,
yellow, or red in appearance and are the brightest of all stars. However, they are unstable in the fact that they 
constantly lose mass via stellar winds. Due to this fact, hypergiants have extremely short stellar lives with the 
minimum being in the range of a couple thousand years.', 'hyper, giant, star'),
(default, 'Super-giants', '8,000,000,000', 'The boundary between super and hypergiants is basically nonexistent.
 Stars in this range are on a continuum with supergiants being on the lower end of this continuum. Much of the 
 features of a hypergiant are present in supergiants and as such, can be just as unstable. Supergiants are less 
 luminous and massive than hypergiants as they have lost more of their fuel to stellar winds.', 'super, giant, star'),
(default, 'Giants', '6,000,000,000', 'Giant stars are a stellar evolutionary product from main sequence stars. 
 The mass of the main sequence star will determine the size of the resulting giant star once the main star burns all
 of its hydrogen. Sometimes, a giant star will not result from a main sequence star due to insufficient mass.',
  'giant, star'),
(default, 'Red Giant', '6,000,000,000', 'Reds have moderate mass, relatively long stable lives, relatively cool 
surface temperatures, and moderate luminosity. The most common of red giants, you certainly cannot go wrong with 
this star!', 'red, giant, star'),
(default, 'Yellow Giant', '5,800,000,000', 'Defined with intermediate surface temperature, yellows have a shorter 
lifespan compared to reds due to the fact that they have more mass.', 'yellow, giant, star'),
(default, 'Blue and White Giants', '5,500,000,000', 'The hottest of the giants and the most unstable in terms of 
mass, size, and luminosity. These turbulent giants have the shortest lifespan.', 'blue, white, giant, star'),
(default, 'Main sequence stars', '5,000,000,000', 'These stars have a huge variation in all aspects of a star. 
They can range from red to blue in hue. The more massive the star, the bluer it is and the shorter its lifespan.',
'regular, main, star'),
-- dwarfs
-- Planets
(default, 'Planetars', '4,200,000,000', 'These planets are larger than ‘giant’ planets. They are essentially failed 
brown dwarf stars. Absolutely massive even in comparison to the biggest gas giant and just out of reach of stellar 
ignition.', 'huge, giant, planet')
-- last two tables left blank for now
