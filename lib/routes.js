var express = require('express');
var StatusCheck = require('./status.js');
var JenkinsJob = require('./JenkinsJob.js');
var ServerRoutes = express.Router();
var config = require('config');
var fs = require('fs');
var _ = require('lodash');
var StatusCheck = require('./status');


var statusCheck = new StatusCheck();
var allServers = config.get('allServers');

ServerRoutes.get('/', function (req, res) {
    res.send("Someday documentation will go here.");
});

ServerRoutes.get('/:mode/rgb', function (req, res) {
    console.log('fetching all server statuses...');
    try {
        statusCheck.getBuildStatusRGB(function (err, rgb) {
            if (err) {
                console.log(err);
                res.status(500).send(err.message);
            }
            try {
                var file = fs.writeFile('/tmp/rgb.txt', rgb, function (err) {
                    if (err) {
                        res.error(err.message);
                    }
                    res.sendFile('/tmp/rgb.txt', {
                        maxAge: 10,
                        lastModified: Date.now(),
                        headers: {
                            'Content-disposition': 'attachment; filename=rgb.txt',
                            'Content-type': 'text/plain'
                        }
                    }, function () {
                        console.log("file sent");
                    });
                });

            } catch (e) {
                res.send(e.message);
            }
        }, allServers);
    } catch (e) {
        console.log(e);
        res.status(500).send(e.message);
    }
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
    try {
        var statusReturned = function (err, status) {
            if (err) {
                console.log(err);
                res.status(500).send(err.message);
            }
            res.status(200).json(status);
        };

        switch (mode) {
            case 'build':
                statusCheck.getBuildStatusJSON(statusReturned, server);
                break;
            case 'test':
                statusCheck.getTestStatusJSON(statusReturned, server);
                break;
            default:
                res.status(404).send("Unrecognized mode, options are build and test.");
        }
    } catch (e) {
        console.log(e);
        res.status(500).send(e.message);
    }
});

module.exports = ServerRoutes;