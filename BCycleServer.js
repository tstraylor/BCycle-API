
var fs = require('fs');
var stationApi = __dirname + '/station/station.js';
var Station = require(stationApi);

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var router = express.Router(); 

router.use(function(req, res, next) {
    // make sure we go to the next routes and don't stop here
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'hey, it worked.' });   
});

// get all the bcycle stations
router.route('/stations').get(Station.findAll);

// get the bcycle station with that id
router.route('/stations/:station_id').get(Station.findById);

// get the bcycle station within a region
router.route('/stationInRegion').post(Station.findByRegion);

app.use('/api', router);
app.listen(8080);
console.log('BCycle Stations API on 8080');
