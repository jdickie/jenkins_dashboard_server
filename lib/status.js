var RgbBuilder = require('./rgbTxtBuilder.js');
var JenkinsJob = require('./JenkinsJob.js');
var _ = require('lodash');
var StatusCheck = function () {
};

StatusCheck.prototype.getBuildStatusJSON = function getBuildStatusJSON(callback, serverName) {
    console.log("Fetching build status for " + serverName);
    try {
        var job = new JenkinsJob('build', serverName);
        callback(null, {
            status : job.getCurrentStatus(),
            url : job.getUrl(),
            health: {
                percent: job.getJobHealth().getHealthAsInt(),
                text: job.getJobHealth().getHealthAsString()
            }
        });
    } catch(e) {
        callback(e);
    }
};

StatusCheck.prototype.rgbBuilder = new RgbBuilder();

StatusCheck.prototype.getTestStatusJSON = function getTestStatusJSON(callback, serverName) {
    console.log("Fetch test status for " + serverName);
    try {
        var job = JenkinsJob('test', serverName);
        callback(null, {
            status : job.getCurrentStatus(),
            url : job.getUrl(),
            health: {
                percent: job.getJobHealth().getHealthAsInt(),
                text: job.getJobHealth().getHealthAsString()
            }
        });
    } catch (e) {
        callback(e);
    }
};

StatusCheck.prototype.getBuildStatusRGB = function getBuildStatusRGB(callback, serverNames) {
    try {
        if (_.isArray(serverNames)) {
            var jobs = _.map(serverNames, function (name) {
                return new JenkinsJob();
            });
            this.rgbBuilder.setColor(jobs);
        }
        callback(null, this.rgbBuilder.render());
    } catch (e) {
        callback(e);
    }

};

module.exports = StatusCheck;