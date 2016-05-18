const fs = require('fs');
var Health = require('./health.js');

var RgbBuilder = function () {
};
RgbBuilder.output = "255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,255,0,255,255,0,255,255,0,255,0,0,255,0,0,255,255,0,0,255,255,255,255,0,255,0,0,255,0,0,255,255,0,255,255,0,255,255,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0";
// Max: 25
RgbBuild.MAX_BUCKETS = 25;
RgbBuilder.buckets = [];

RgbBuilder.setColor = function setColor(servers) {
    if (_.isArray(servers)) {

    } else {
        var i = 0;
        while (i < RgbBuilder.MAX_BUCKETS) {
            i++;
            this.setLine(servers.getHealth())
        }
    }
};

/*
 @param int health
 */
RgbBuilder.setLine = function (health, index) {
    var healthObj = new Health();
    healthObj.set(value);
    var healthValue = this.interpretHealth(healthObj);

};

/*
 @param Health health
 */
RgbBuilder.interpretHealth = function (health) {
    var color = [];
    switch (health.getHealthAsString()) {
        case 'GREAT':
            color = [0, 255, 0];
            break;
        case 'OK':
            color = [255, 255, 0];
            break;
        case 'BAD':
            color = [255, 0, 0];
            break;


    }
    return color;
};

RgbBuilder.render = function () {
    return this.output;
};

module.exports = RgbBuilder;