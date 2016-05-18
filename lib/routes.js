var express = require('express');
var StatusCheck = require('./status.js');
var ServerRoutes = express.Router();
var config = require('config');
var fs = require('fs');

var allServers = config.get('allServers');

ServerRoutes.get('/', function (req, res) {
    res.send("Someday documentation will go here.");
});

ServerRoutes.get('/:mode/rgb', function (req, res) {
    console.log('fetching all server statuses...');
    var rgb = StatusCheck.getBuildStatusRGB(allServers);
    // write results to a tmp file
    var file = fs.writeFile('/tmp/rgb.txt', rgb, function(err){
        if (err){
            res.error(err.message);
        }
        res.sendFile('/tmp/rgb.txt', {
            maxAge : 10,
            lastModified : Date.now(),
            headers : {
                'Content-disposition' : 'attachment; filename=rgb.txt',
                'Content-type' : 'text/plain'
            }
        }, function() {
            console.log("file sent");
        });
    });
});

ServerRoutes.get('/:server', function (req, res) {
    res.send("Things you can do with " + req.params.server + ":<br/>" +
        "/" + req.params.server + "/build<br/>" +
        "/" + req.params.server + "/build/rgb<br/>" +
        "/" + req.params.server + "/test");
});

ServerRoutes.get('/:mode/:server/', function (req, res) {
    res.status(200).json(StatusCheck.getBuildStatusJSON());
});

ServerRoutes.get('/:server/build/rgb', function (req, res) {
   res.status(200);
    var rgb = StatusCheck.getBuildStatusRGB();

    // write results to a tmp file
    var file = fs.writeFile('/tmp/rgb.txt', rgb, function(err){
        if (err){
            res.error(err.message);
        }

    });
    res.setHeader('Content-Length', file.length);
    res.write(file, 'binary');
    res.end();
});


module.exports = ServerRoutes;