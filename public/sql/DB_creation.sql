-- create the database
drop database if exists CST336_Project;
create database CST336_Project;

-- use the database
use CST336_Project;

-- create the tables
CREATE TABLE users (
    userID INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    userName VARCHAR(45),
    password VARCHAR(72),
    adminPriv BOOLEAN
);

CREATE TABLE products (
    itemID INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    itemName VARCHAR(45),
    price BIGINT,
    description1 VARCHAR(500),
    description2 VARCHAR(250)
);

CREATE TABLE generaltransactions (
    transID INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    userID INT REFERENCES Users (userID),
    trans_ts DATETIME NOT NULL,
    price_total BIGINT(25) NOT NULL
);

CREATE TABLE detailedtransactions (
    transID INT REFERENCES GeneralTransactions (transID),
    itemID INT REFERENCES Products (itemID),
    itemquantity INT REFERENCES UserCart (itemquantity)
);

CREATE TABLE usercart
(
    userID       INT(11) NOT NULL,
    itemID       INT(11) NOT NULL,
    itemquantity INT(11) NOT NULL
);
-- populate the tables
-- users
insert into users values
(default, 'admin', '$2b$04$Wappq2OLsTdMcZEUmUjrFeXQCbfgQITrb/vMDG2R02oR3joYer0su', True),
(default, 'buyer', '$2b$04$9eDgKZebf2bMQaz1BVBSSuVmFFYGS4TAArmJ9viDOsTGUhj3BGq92', False),
(default, 'buyer2', '$2b$04$9eDgKZebf2bMQaz1BVBSSuVmFFYGS4TAArmJ9viDOsTGUhj3BGq92', False),
(default, 'buyer3', '$2b$04$9eDgKZebf2bMQaz1BVBSSuVmFFYGS4TAArmJ9viDOsTGUhj3BGq92', False);

-- products
INSERT INTO products VALUES
-- Stars
(default, 'Black hole', 15000000000, 'A stellar void of destruction, a black hole is invisible to the eye unless it is feeding on a nearby star. Perfect for those who want to recreate the system from "Interstellar"', 'black, hole'),
(default, 'Hyper-giants', 10000000000, 'The largest of the largest stars in existence. They are typically blue, yellow, or red in appearance and are the brightest of all stars. However, they are unstable in the fact that they constantly lose mass via stellar winds. Due to this fact, hypergiants have extremely short stellar lives with the minimum being in the range of a couple thousand years.', 'hyper, giant, star'),
(default, 'Super-giants', 10000000000, 'The boundary between super and hypergiants is basically nonexistent. Stars in this range are on a continuum with supergiants being on the lower end of this continuum. Much of the  features of a hypergiant are present in supergiants and as such, can be just as unstable. Supergiants are less  luminous and massive than hypergiants as they have lost more of their fuel to stellar winds.', 'super, giant, star'),
(default, 'Giants', 6000000000, 'Giant stars are a stellar evolutionary product from main sequence stars.  The mass of the main sequence star will determine the size of the resulting giant star once the main star burns all of its hydrogen. Sometimes, a giant star will not result from a main sequence star due to insufficient mass.', 'giant, star'),
(default, 'Red Giant', 6000000000, 'Reds have moderate mass, relatively long stable lives, relatively cool surface temperatures, and moderate luminosity. The most common of red giants, you certainly cannot go wrong with this star!', 'red, giant, star'),
(default, 'Yellow Giant', 5800000000, 'Defined with intermediate surface temperature, yellows have a shorter lifespan compared to reds due to the fact that they have more mass.', 'yellow, giant, star'),
(default, 'Blue and White Giants', 5500000000, 'The hottest of the giants and the most unstable in terms of mass, size, and luminosity. These turbulent giants have the shortest lifespan.', 'blue, white, giant, star'),
(default, 'Main sequence stars', 5000000000, 'These stars have a huge variation in all aspects of a star. They can range from red to blue in hue. The more massive the star, the bluer it is and the shorter its lifespan.','regular, main, star'),
(default, 'White dwarf', 6200000000, 'A star with the mass of a main sequence star compacted into a planet the size of the Earth. Incredibly dense and gravity-strong for its size, this star is fairly dim.', 'dwarf, white, star'),
-- Planets
(default, 'Planetars', 4200000000, 'These planets are larger than ‘giant’ planets. They are essentially failed brown dwarf stars. Absolutely massive even in comparison to the biggest gas giant and just out of reach of stellar ignition.', 'huge, giant, planet'),
(default, '"Giant" planets', 4000000000, 'These planets have a thick atmosphere composed of hydrogen and helium. Typically, these planets do not have a defined core and are more of a gradient due to increasing pressure as you delve deeper into the atmosphere. The mass of giant planets are related by the mass of Jupiter. One Jupiter mass is roughly 320,000 masses of the Earth. There are some subtypes to choose from.', 'giant, planet'),
(default, 'Gas giants', 4000000000, 'These planets have a mass in the range of 1-13 Jupiter masses. They are composed of 80% hydrogen and helium with about +/- 10% of variation. These types of planets do not have a solid, defined core. There are an untold amount of variation in atmosphere composition and thus, almost infinite combination of atmosphere colors, conditions, and weather patterns.', 'gas, giant, planet'),
(default, 'Ice giants', 4000000000, 'While having similar atmosphere compositions to gas giants, the key distinction of ice planets is that they have solid cores. These cores are mainly composed of ‘ice’ which consists of water, methane, and ammonia. Because of this composition, there are enough gaseous methane and ammonia to give these planets a blue or aquamarine color tint.', 'ice, giant, planet'),
(default, 'Massive solid giants', 4000000000, 'By mass, these planets are composed of rocky minerals. Since they are under this category, they also have a gaseous, light element atmosphere, typically composed of hydrogen.', 'solid, giant, planet'),
(default, 'Gas dwarfs', 2500000000, 'Sometimes referred to as ‘mini-Neptune’ or ‘sub-Neptune’, if you could take what a gas giant is and shrink it down to the size of a planet roughly 10 to 15 Earth masses, this is what you’ll get. These planets have a thick atmosphere and have a solid core composed of the same molecules and elements as Massive Solid Giants.', 'dwarf, gas, planet'),
(default, 'Super Earths', 2000000000, 'As the same states, this planet has roughly 2-5 times the mass of earth. Key differences are a mineral/element rich core, water present on the surface, and a thin atmosphere with varied gases.', 'super, earth, planet'),
(default, 'Mesoplanets', 1500000000, 'Coined by Isaac Asimov, a mesoplanet is in the size range of Mercury down to the asteroid-planetoid Ceres. Small, rocky worlds with an extremely thin atmosphere, if present. ', 'rocky, small, planet'),
-- extraneous items
(default, 'Asteroid belt', 800000000, 'Glam your system with an asteroid belt to be placed at your desire. A great accessory item for any system as asteroids are mineral rich and highly usable for any space faring society', 'asteroid, rock, belt'),
(default, 'Asteroid', 50000, 'Any system has rogue asteroids and your system is not complete with a couple million of these little guys orbiting about.', 'asteroid, rogue'),
(default, 'Comet', 80000, 'The key difference between an asteroid and a comet is the presence of water-ice and other frozen compounds that sublimate when it gets close to a heat source. A beautiful addition to any system.', 'comet');
-- last two tables left blank for now

INSERT INTO usercart VALUES
(2,5,12),
(2,1,1),
(2,2,15),
(2,3,14),
(2,4,2);

INSERT INTO detailedtransactions VALUES
(1,10,2),
(1,1,1),
(1,14,3),
(2,2,2),
(2,13,5),
(2,15,2),
(3,16,8),
(4,16,10);

INSERT INTO generaltransactions VALUES
(default,2,CURRENT_TIMESTAMP, 24000000000),
(default,2,CURRENT_TIMESTAMP, 42000000000),
(default,2,CURRENT_TIMESTAMP, 35500000000),
(default,2,CURRENT_TIMESTAMP, 6400000000),
(default,2,CURRENT_TIMESTAMP, 8000000000)

