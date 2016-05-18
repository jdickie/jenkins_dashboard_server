var RgbBuilder = require('./rgbTxtBuilder.js');
var JenkinsJob = require('./JenkinsJob.js');
var _ = require('lodash');
var StatusCheck = function () {
};

StatusCheck.getBuildStatusJSON = function getBuildStatusJSON(serverName) {
    console.log("Fetching build status for " + serverName);
    return {
        health: 100
    };
};

StatusCheck.rgbBuilder = new RgbBuilder();

StatusCheck.getTestStatusJSON = function getTestStatusJSON(serverName) {

};

StatusCheck.getBuildStatusRGB = function getBuildStatusRGB(serverNames) {
    if (_.isArray(serverNames)) {
        var jobs = _.map(serverNames, function (name) {
            return new JenkinsJob();
        });
        this.rgbBuilder.setColor(jobs);
    }
    return this.rgbBuilder.render();
};

module.exports = StatusCheck;