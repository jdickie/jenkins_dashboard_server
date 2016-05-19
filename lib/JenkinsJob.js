var _ = require('lodash');
var config = require('config');
var request = require('request');
var Health = require('./health.js');
var urlencode = require('urlencode');

// @TODO: make sure these match up with what is returned by Jenkins API
const SUCCESS_STATUS = 'SUCCESS';
const FAILURE_STATUS = 'FAILURE';
const ABORTED_STATUS = 'ABORTED';
const IN_PROGRESS_STATUS = 'IN PROGRESS';
const STATUS = [SUCCESS_STATUS, ABORTED_STATUS, FAILURE_STATUS, IN_PROGRESS_STATUS];

/**
 *
 * @constructor
 * @param callback
 * @param domain
 * @param name
 */
var JenkinsJob = function (callback, domain, name) {
    var self = this;

    self.domain = domain;
    self.name = name;
    self.fetchJsonStatus(function(err, json) {
        if (err) {
            callback(err);
        }

        self.buildLocalStatus(callback, json);
    }, self);
};



JenkinsJob.prototype.name = "";
JenkinsJob.prototype.domain = "";
JenkinsJob.prototype.status = {};

JenkinsJob.prototype.fetchJsonStatus = function fetchJson(callback) {
    try {
        var self = this;
        var url = "http://" + self.domain + "/job/" +
            urlencode(self.name) + "/api/json";

        console.log("fetching results from ", url);
        request({
            url : url,
            method: "GET",
            json: true
        }, function (err, response, body) {
            if (err) {
                console.log(err);
                callback(err);
            }
            callback(null, body);
        });
    } catch (e) {
        callback(e);
    }
};

/**
 * This builds the actual object that gets passed back
 * to StatusCheck
 */
JenkinsJob.prototype.buildLocalStatus = function(callback, status) {

    try {
        var self = this;
        console.log("getting local build status for: " + self.name);
        self.status.url = status.url;
        self.getCurrentBuildResult(function(err, result) {
            if (err) {
                callback(err);
            }
            self.status.currentBuildStatus = result;

            self.getJobHealth(function(err, health) {
                if (err) {
                    callback(err);
                }
                self.status.health = {
                    percent : health.score,
                    text : health.description
                };
                callback(null, self.status);
            }, status);
        });
    } catch (e) {
        callback(e);
    }
};

/*
 Returns the builds for this job
 @returns array
 */
JenkinsJob.prototype.getBuilds = function getBuilds() {
    return this.status.builds;
};

/**
 *
 Returns the health which is some kind of calculation of how this
 job has been performing over time.
 @returns {Health}
 */
JenkinsJob.prototype.getJobHealth = function getJobHealth(callback, status) {
    var self = this;
    try {
        if (status && status.healthReport) {
            callback(null, status.healthReport[0]);
        } else {
            callback(new Error("No health found"));
        }

    } catch (e) {
        console.log(e);
        callback(e);
    }
};



/**
 * Returns a string representing the URL for this
 * job.
 *
 * @returns {string}
 */
JenkinsJob.prototype.getUrl = function getUrl() {
    var self = this;
    return self.server + '/' + self.mode;
};

/*
 Return the current status - see above for constants.
 @TODO: returning random for now; will be replaced by actual JSON returned value
 @returns string
 */
JenkinsJob.prototype.getCurrentBuildResult = function getCurrentStatus(callback) {
    request({
        url :  "http://" + this.domain + "/job/" +
        urlencode(this.name) + "/lastBuild/api/json",
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

module.exports = JenkinsJob;