const fs = require('fs');
var _ = require('lodash');
var Health = require('./health.js');

var RgbBuilder = function () {
};
RgbBuilder.output = "255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,255,0,255,255,0,255,255,0,255,0,0,255,0,0,255,255,0,0,255,255,255,255,0,255,0,0,255,0,0,255,255,0,255,255,0,255,255,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0";
RgbBuilder.MAX_BUCKETS = 25;
RgbBuilder.buckets = [];

RgbBuilder.setColor = function setColor(job) {
    // reset
    this.buckets = [];
    if (_.isArray(servers)) {
        // How many groups of colors we're setting for each server
        var sets = Math.floor(this.MAX_BUCKETS / servers.length);
        _.forEach(servers, function (server) {
            for (i = 0; i < sets; i++) {
                this.buckets = _.union(this.buckets, this.interpretHealth(server.getHealth()));
            }
        });
    } else {
        var i = 0;
        while (i < RgbBuilder.MAX_BUCKETS) {
            i++;
            this.setLine(servers.getHealth());
        }
    }
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

/*
@return string
 */
RgbBuilder.render = function () {
    return _.join(this.buckets, ',');
};

module.exports = RgbBuilder;