const fs = require('fs');
var _ = require('lodash');
var Health = require('./health.js');

var RgbBuilder = function () {
};
RgbBuilder.output = "255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,255,0,255,255,0,255,255,0,255,0,0,255,0,0,255,255,0,0,255,255,255,255,0,255,0,0,255,0,0,255,255,0,255,255,0,255,255,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0";
RgbBuilder.prototype.MAX_BUCKETS = 25;
RgbBuilder.prototype.buckets = [];

/**
 *
 * @param Health[] reports
 */
RgbBuilder.prototype.setColor = function setColor(reports) {
    var self = this;
    // reset
    self.buckets = [];
    if (_.isArray(reports)) {
        // How many groups of colors we're setting for each server
        var sets = Math.floor(self.MAX_BUCKETS / reports.length);
        _.forEach(reports, function (report) {
            for (i = 0; i < sets; i++) {
                self.buckets = _.concat(self.buckets, self.interpretHealth(report));
            }
        });
    } else {
        self.buckets = RgbBuilder.output.split(',');
    }
};

/*
 @param Health health
 */
RgbBuilder.prototype.interpretHealth = function (health) {
    var color = [];
    switch (health.getHealthAsString()) {
        case health.GREAT_STRING:
            color = [0, 255, 0];
            break;
        case health.OK_STRING:
            color = [255, 255, 0];
            break;
        case health.BAD_STRING:
            color = [255, 0, 0];
            break;
    }
    return color;
};

/*
@return string
 */
RgbBuilder.prototype.render = function () {
    return _.join(this.buckets, ',');
};

module.exports = RgbBuilder;