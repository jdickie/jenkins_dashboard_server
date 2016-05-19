var RgbBuilder = require('./rgbTxtBuilder.js');
var JenkinsJob = require('./JenkinsJob.js');
var Config = require('config');
var async = require('async');
var urlencode = require('urlencode');
var request = require('request');
var Health = require('./health');
var _ = require('lodash');
var StatusCheck = function () {
};

// private functions
var fetchJobsFromConfig = function (callback, serverName, mode) {
    try {
        var modeKey = mode.toLowerCase() + "_jobs",
            envKey = serverName.toLowerCase();

        var jobs = Config.get("environments." + envKey + "." + modeKey),
            domain = Config.get("jenkinsServers." + mode.toLowerCase()),
            jobNames = [];
        _.each(jobs, function(job) {
            var name = "";
            if (job.folder) {
                name += job.folder + "/job/";
            }
            name += urlencode(job.name);
            jobNames.push(name);
        });
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

var fetchJobStatus = function(callback, name, domain) {
    var url = "http://" + domain + "/job/" +
        name + "/api/json";
    request({
        url : url,
        method : "GET",
        json : true
    }, function(err, response, body) {
        if (err) {
            console.log(err);
            callback(err);
        }

        callback(null, body);
    });
};

var fetchBuildStatus = function(callback, status) {

    request({
        url :  status.builds[0].url + "/api/json",
        method : "GET",
        json : true
    }, function(err, response, body) {
        if (err) {
            callback(err);
            return;
        }

        callback(null, {
            result : body.result
        });
    });
};

StatusCheck.prototype.getBuildStatusJSON = function getBuildStatusJSON(callback, serverName) {
    console.log("Fetching build status for " + serverName);
    try {
        var domain, jobNames, self = this;
        fetchJobsFromConfig(function (err, args) {
            if (err) {
                callback(err);
            }
            var statuses = [];

            async.each(args.names, function (name, eachCallback) {
                fetchJobStatus(function(err, status) {
                    if (err) {
                        eachCallback(err);
                    }
                    var url = status.url,
                        health = {
                            percent : status.healthReport[0].score,
                            text : status.healthReport[0].description
                        };
                    fetchBuildStatus(function(err, buildStatus) {
                        statuses.push({
                            url : url,
                            health : health,
                            currentBuildHealth : buildStatus.result
                        });
                        eachCallback();

                    }, status);
                }, name, args.domain);
            }, function (err) {
                // async.each returns here
                if (err) {
                    callback(err);
                }
                callback(null, statuses);
            });
        }, serverName, 'build');
    } catch (e) {
        callback(e.message);
    }
};

StatusCheck.prototype.rgbBuilder = new RgbBuilder();

StatusCheck.prototype.getTestStatusJSON = function getTestStatusJSON(callback, serverName) {
    console.log("Fetching build status for " + serverName);
    try {
        var domain, jobNames, self = this;
        fetchJobsFromConfig(function (err, args) {
            if (err) {
                callback(err);
            }
            var statuses = [];

            async.each(args.names, function (name, eachCallback) {
                fetchJobStatus(function(err, status) {
                    if (err) {
                        eachCallback(err);
                    }
                    console.log(status);
                    var url = status.url,
                        health = {
                            percent : status.healthReport ? status.healthReport[0].score : 0,
                            text : status.healthReport ? status.healthReport[0].description : "No health report found for this build"
                        };
                    fetchBuildStatus(function(err, buildStatus) {
                        statuses.push({
                            url : url,
                            health : health,
                            currentBuildHealth : buildStatus.result
                        });
                        eachCallback();

                    }, status);
                }, name, args.domain);
            }, function (err) {
                // async.each returns here
                if (err) {
                    callback(err);
                }
                callback(null, statuses);
            });
        }, serverName, 'test');
    } catch (e) {
        callback(e.message);
    }
};

StatusCheck.prototype.getBuildStatusRGB = function getBuildStatusRGB(callback, serverNames) {
    try {
        var self = this;
        if (_.isArray(serverNames)) {
            var reports = [],
                jobNames = [],
                domain = Config.get("jenkinsServers.build");
            async.each(serverNames, function(serverName, eachCallback) {
                console.log('checking ' + serverName);
                fetchJobsFromConfig(function (err, args) {
                    if (err) {
                        eachCallback(err);
                    }
                    console.log('got back ', args);
                    jobNames = _.concat(jobNames, args.names);
                    eachCallback();
                }, serverName, 'build');

            }, function(err) {
                if (err) {
                    callback(err);
                }
                console.log('fetched names : ', jobNames);
                async.each(jobNames,  function(jobName, innerCallback) {
                    fetchJobStatus(function(err, status) {
                        if (err) {
                            innerCallback(err);
                        }
                        console.log(status);
                        if (status.healthReport) {
                            var health = new Health();
                            health.set(status.healthReport[0].score);
                            reports.push(health);
                        }
                        innerCallback();
                    }, jobName, domain);
                }, function(err) {
                    if (err) {
                        callback(err);
                    }
                    console.log('reports', reports);
                    self.rgbBuilder.setColor(reports);
                    callback(null, self.rgbBuilder.render());
                });
            });
        }

    } catch (e) {
        callback(e);
    }

};

module.exports = StatusCheck;