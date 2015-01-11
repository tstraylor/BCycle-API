var fs = require('fs');
var database = __dirname + '/bcycle.db';

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(database);

// this will return all the stations found 
// in the database
exports.findAll = function(req, res) {

    try {

        db.all("SELECT * FROM Stations", function(err, rows) {

            if(err) {
                //console.log('db.all: %j\n%j', err, err.message);
                res.send(500,err);
            }
            else {
                if(rows) {
                    //jconsole.log(JSON.stringify(rows));
                    res.json(rows);
                }
                else
                    res.send(500);
            }
        });
    }
    catch(e) {
        console.log('Exception caught: %j',e);
        res.send(500);
    }
}

// this will return only the stations within
// the specified region
exports.findByRegion = function(req, res) {

    try {

        var sql = "SELECT * FROM Stations WHERE Latitude BETWEEN ? and ? " +
                  "AND Longitude BETWEEN ? and ?";

        var params = [];
        params.push(req.body.StartLat);
        params.push(req.body.EndLat);
        params.push(req.body.StartLong);
        params.push(req.body.EndLong);

        db.all(sql, params, function(err, rows) {

            if(err) {
                //console.log('db.all: %j\n%j', err, err.message);
                res.send(500,err);
            }
            else {
                if(rows) {
                    //jconsole.log(JSON.stringify(rows));
                    res.json(rows);
                }
                else
                    res.send(500);
            }
        });
    }
    catch(e) {
        console.log('Exception caught: %j',e);
        res.send(500);
    }

}

// this will return the specified station
exports.findById = function(req, res) {
    
    try {

        var sql = "SELECT * FROM Stations WHERE id = ?"

        var params = [];
        params.push(req.params.station_id);

        db.all(sql, params, function(err, rows) {

            if(err) {
                //console.log('db.all: %j\n%j', err, err.message);
                res.send(500,err);
            }
            else {
                if(rows) {
                    //jconsole.log(JSON.stringify(rows));
                    res.json(rows);
                }
                else
                    res.send(500);
            }
        });
    }
    catch(e) {
        console.log('Exception caught: %j',e);
        res.send(500);
    }
}

exports.addStation = function(req, res) {

    console.log('addStation called');
}

exports.updateStation = function(req, res) {

    console.log('updateStation called');
}

exports.deleteStation = function(req, res) {

    console.log('updateStation called');
}
