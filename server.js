var express = require('express');
var ServerRoutes = require('./lib/routes.js');
var app = express();
var cors = require('cors');
const PORT = 3000;

app.use(cors());
app.use('/', ServerRoutes);

app.listen(PORT, function() {
    console.log("listening on port " + PORT);
});