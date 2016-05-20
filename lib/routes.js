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

ServerRoutes.get('/dashboardTest', function(req, res) {

    var tableStart = "<table border='1' style='width:100%'>";
    var tableRow = "<tr> <td>1</td> <td>2</td> <td>3</td> <td>4</td> <td>5</td> </tr>";
    var tableEnd = "</table>";
    var cellStartColor = "<td bgcolor='" + "rgb(0,0,0)" + "'>";
    var cellStartPlain = "<td>";
    var tableString = tableStart;
    var cellCt = 1;
    var rgbIndex = 0;
    var rgbString;

    var resString;

    try {
        statusCheck.getBuildStatusRGB(function(err, rgb) {
            if (err) {
                console.log(err);
                res.status(500).send(err.message);
            }
            var rgbArr = rgb.split(",");

            for (var ct = 1; ct <= 5; ct++) {

                var rowString = "<tr>";

                tableString = tableString + "<tr>";

                rgbString = "";
                for (var rgbCt = 1; rgbCt <= 2; rgbCt++) {
                    rgbString = rgbString + rgbArr[rgbIndex++] + ",";
                }

                rgbString = rgbString + rgbArr[rgbIndex++];

                for (var rowCellCt = 1; rowCellCt <= 5; rowCellCt++) {

                    //tableString = tableString + cellStartPlain + cellCt + "<br>" + rgbString + "</td>";
                    var cellString = "<td bgcolor='" + "rgb(" + rgbString + ")" + "'>" + cellCt + "<br>" + rgbString + "</td>";
                    rowString = rowString + cellString;
                    cellCt++;
                }

                rowString = rowString + "</tr>";

                //tableString = tableString + "</tr>";
                tableString = tableString + rowString;


            }
            tableString = tableString + tableEnd;

            resString = tableString + "<br>" + rgb;

            res.send(resString);

        }, allServers);
    } catch (e) {
        console.log(e);
        res.status(500).send(e.message);
    }

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
                if (req.query && req.query.txt) {
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
                } else {
                    console.log(rgb);
                    res.send(rgb);
                }
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