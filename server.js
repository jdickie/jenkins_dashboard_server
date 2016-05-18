var express = require('express');
var ServerRoutes = require('./lib/routes.js');
var app = express();
const PORT = 3000;

app.use('/', ServerRoutes);

app.listen(PORT, function() {
    console.log("listening on port " + PORT);
});