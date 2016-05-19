var RgbBuilder = require('./rgbTxtBuilder.js');
var JenkinsJob = require('./JenkinsJob.js');
var Config = require('config');
var async = require('async');
var _ = require('lodash');
var StatusCheck = function () {
};

// private functions
var fetchJobsFromConfig = function (callback, serverName, mode) {
    try {
        var modeKey = mode.toLowerCase() + "_jobs",
            envKey = serverName.toLowerCase();

        var jobNames = Config.get("environments." + envKey + "." + modeKey),
            domain = Config.get("jenkinsServers." + mode.toLowerCase());
        console.log("Loaded up names for these jobs:");
        console.log(jobNames);
        callback(null, {
            domain: domain,
            names: jobNames
        });
    } catch (e) {
        callback(e);
    }
};

StatusCheck.prototype.getBuildStatusJSON = function getBuildStatusJSON(callback, serverName) {
    console.log("Fetching build status for " + serverName);
    try {
        var domain, jobNames;
        fetchJobsFromConfig(function (err, args) {
            if (err) {
                callback(err);
            }
            var status = [];
            async.each(args.names, function (name, eachCallback) {
                var job = new JenkinsJob(function (err, jenkinsJobStatus) {
                    if (err) {
                        eachCallback(err);
                        return;
                    }
                    status.push(jenkinsJobStatus);
                    eachCallback();
                }, args.domain, name);
            }, function (err) {
                // async.each returns here
                if (err) {
                    callback(err);
                }
                callback(null, status);
            });
        }, serverName, 'build');
    } catch (e) {
        callback(e.message);
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