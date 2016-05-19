var RgbBuilder = require('./rgbTxtBuilder.js');
var JenkinsJob = require('./JenkinsJob.js');
var urlencode = require('urlencode');
var Config = require('config');
var _ = require('lodash');
var StatusCheck = function () {
};

// private functions
var fetchJobNamesFromConfig = function (callback, serverName, mode) {
    try {
        var modeKey = mode.toLowerCase() + "_jobs",
            envKey = serverName.toLowerCase();

        var jobNames = Config.get("environments." + envKey + "." + modeKey);
        console.log("Loaded up names for these jobs:");
        console.log(jobNames);
        callback(null, {
            names : jobNames
        });
    } catch (e) {
        callback(e);
    }
},
    fetchDomainFromConfig = function(callback, mode){
        try {
            callback(null, {
                domain : Config.get("jenkinsServers." + mode.toLowerCase())
            });
        } catch (e) {
            callback(e);
        }
    };

StatusCheck.prototype.getBuildStatusJSON = function getBuildStatusJSON(callback, serverName) {
    console.log("Fetching build status for " + serverName);
    try {
        var domain, jobNames;
        

        callback(null, {
            status: job.getCurrentStatus(),
            url: job.getUrl(),
            health: {
                percent: job.getJobHealth().getHealthAsInt(),
                text: job.getJobHealth().getHealthAsString()
            }
        });
    } catch (e) {
        callback(e);
    }
};

StatusCheck.prototype.rgbBuilder = new RgbBuilder();

StatusCheck.prototype.getTestStatusJSON = function getTestStatusJSON(callback, serverName) {
    console.log("Fetch test status for " + serverName);
    try {
        var job = JenkinsJob('test', serverName);
        callback(null, {
            status: job.getCurrentStatus(),
            url: job.getUrl(),
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