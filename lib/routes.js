var express = require('express');
var StatusCheck = require('./status.js');
var JenkinsJob = require('./JenkinsJob.js');
var ServerRoutes = express.Router();
var config = require('config');
var fs = require('fs');
var _ = require('lodash');

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
    var mode = req.params.mode,
        server = req.params.server;
    if (_.isEmpty(mode) || _.isEmpty(server)) {
        res.status(500).send("Need to provid valid mode and server values");
    }

    switch(mode) {
        case 'build':
        case 'test':
            var job = new JenkinsJob(mode, server);
            res.json({
                status : job.getCurrentStatus(),
                url : job.getUrl(),
                health: {
                    percent: job.getJobHealth().getHealthAsInt(),
                    text: job.getJobHealth().getHealthAsString()
                }
            });
            break;
        default:
            res.status(404).send("Unrecognized mode, options are build and test.");
    }
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