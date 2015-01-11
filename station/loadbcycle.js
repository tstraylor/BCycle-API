// BCycle Denver station location data
var fs = require('fs');
var file = __dirname + '/bcycle_stations.json';

// geo coder
var geocoder = require('node-geocoder').getGeocoder('google', 'http');

var EventEmitter = require("events").EventEmitter;
var sys = require("sys");

function SyncArray(array){ this.array = array };
require("util").inherits(SyncArray, EventEmitter);

SyncArray.prototype.forEach = function(callback, finishedCallback) { 
    var self = this;

    this.on("nextElement", function(index, callback, finishedCallback) {
        self.next(++index, callback, finishedCallback);
    });

    this.on("finished", function() {
    });

    self.next(0, callback, finishedCallback);
}

SyncArray.prototype.next = function(index, callback, finishedCallback) {
    var self = this;
    var obj = index < self.array.length ? self.array[index] : null;
    if (obj) {
        callback(obj, index, self.array, function() {
            self.emit("nextElement", index, callback, finishedCallback);
        });
    }
    else {
        finishedCallback();
        self.emit("finished");
    }
}

// database
var database = __dirname + '/bcycle.db';
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(database);

var StationCount = 0;

fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
        console.log('Error: ' + err);
        return;
    } 

    data = JSON.parse(data); 
    processData(data);

});

function processData(data)
{
    var sync = new SyncArray(data);
    sync.forEach(function(station, i, data, finishedOne) { 
        console.log('station: %j', station);
        console.log('Name: %s', station.Name);

        var address; 
        if(station.Street != "") {
            address = station.Street + ", "; 
        }

        if(station.City != "") {
            if(address) {
                address = address + station.City + ", "; 
            } 
            else {
                address = station.City + ", ";
            }
        } 
        
        if(station.State != "") {
            if(address) {
                address = address + station.State + ", ";
            }
            else {
                address = station.State + ", ";
            }
        }

        if(address) {
            address = address + station.Zip;
        }
        else {
            address = station.Zip; 
        }
        
        console.log('Loading address: ' + address);
        
        // get geo codes from google maps
        geocoder.geocode(address, function(err, res) {
            if(err) {
                console.log('geocoder error: %j', err);
            }
            else {
                if(res.length) {
                    //console.log(res);
                    // we need to slow down our geocode request to
                    // google maps, if we don't we get an error response
                    setTimeout(function() {
                        addStation(station, res[0].latitude, res[0].longitude, finishedOne);
                    }, 5000);
                }
            }
        });

    }, function() {
        console.log("Finished adding BCycle stations", StationCount);
    });
}

function addStation(station, lat, lon, callback)
{
    var insertStation = "insert into Stations (Name,Street,City,State,Zip,Docks,Latitude,Longitude) " +
                        "values(?,?,?,?,?,?,?,?)";

    var stmt = db.prepare(insertStation);

    stmt.run(station.Name, station.Street, station.City, station.State, 
            station.Zip, station.Docks, lat, lon);

    stmt.finalize();
    StationCount++;
    callback();
}

