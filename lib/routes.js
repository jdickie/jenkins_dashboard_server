var express = require('express');
var StatusCheck = require('./status.js');
var ServerRoutes = express.Router();


ServerRoutes.get('/', function (req, res) {
    res.render('doc');
});

ServerRoutes.get('/:server', function (req, res) {
    res.send("Things you can do with " + req.params.server + ":");
    res.send("/" + req.params.server + "/build");
    res.send("/" + req.params.server + "/test");
    res.send("/" + req.params.server + "/build/rgb");
});

ServerRoutes.get('/:server/build', function (req, res) {
    res.status(200).json(StatusCheck.getBuildStatusJSON());
});

ServerRoutes.get('/:server/build/rgb', function (req, res) {
   res.status(200);
    var rgb = StatusCheck.getBuildStatusRGB();
});




module.exports = ServerRoutes;