var express = require('express');
var StatusCheck = require('./status.js');
var ServerRoutes = express.Router();


ServerRoutes.get('/', function (req, res) {
    res.send("Someday documentation will go here.");
    return;
});

ServerRoutes.get('/:server', function (req, res) {
    res.send("Things you can do with " + req.params.server + ":<br/>" +
        "/" + req.params.server + "/build<br/>" +
        "/" + req.params.server + "/build/rgb<br/>" +
        "/" + req.params.server + "/test");
});

ServerRoutes.get('/:server/build', function (req, res) {
    res.status(200).json(StatusCheck.getBuildStatusJSON());
});

ServerRoutes.get('/:server/build/rgb', function (req, res) {
   res.status(200);
    var rgb = StatusCheck.getBuildStatusRGB();
    res.send(rgb);
});


module.exports = ServerRoutes;