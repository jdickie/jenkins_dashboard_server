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
 * @param JenkinsJob[] jobs
 */
RgbBuilder.prototype.setColor = function setColor(jobs) {
    var self = this;
    // reset
    self.buckets = [];
    if (_.isArray(jobs)) {
        // How many groups of colors we're setting for each server
        var sets = Math.floor(self.MAX_BUCKETS / jobs.length);
        console.log('sets ' + sets);
        _.forEach(jobs, function (job) {
            for (i = 0; i < sets; i++) {
                console.log('health is: ' + job.getJobHealth());
                console.log('self interpret health' + self.interpretHealth(job.getJobHealth()));
                this.buckets = _.union(self.buckets, self.interpretHealth(job.getJobHealth()));
            }
        });
    } else {

    }
};

/*
 @param Health health
 */
RgbBuilder.prototype.interpretHealth = function (health) {
    var color = [];
    console.log('health as string: ' + health.getHealthAsString());
    switch (health.getHealthAsString()) {
        case Health.GREAT_STRING:
            color = [0, 255, 0];
            break;
        case Health.OK_STRING:
            color = [255, 255, 0];
            break;
        case Health.BAD_STRING:
            color = [255, 0, 0];
            break;
    }
    return color;
};

/*
@return string
 */
RgbBuilder.prototype.render = function () {
    console.log(this.buckets);
    return _.join(this.buckets, ',');
};

module.exports = RgbBuilder;