DROP TABLE IF EXISTS Stations;
CREATE TABLE Stations (
    id integer PRIMARY KEY autoincrement NOT NULL,
    Name text,
    Street text,
    City text,
    State text,
    Zip text,
    Docks real,
    Latitude real,
    Longitude real,
    Created DATETIME DEFAULT CURRENT_TIMESTAMP, 
    Updated DATETIME DEFAULT CURRENT_TIMESTAMP 
    );
