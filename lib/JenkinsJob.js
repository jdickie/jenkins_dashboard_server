var _ = require('lodash');
var config = require('config');
var request = require('request');
var Health = require('./health.js');

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
    this.domain = domain;
    this.name = name;
    var self = this;
    this.fetchJsonStatus(function (err, json) {
        if (err) {
            callback(err);
        }

        self.status = json;
        console.log('self.status : ', self.status);
        callback(null, self);
    });
};

JenkinsJob.prototype.name = "";
JenkinsJob.prototype.domain = "";
JenkinsJob.prototype.status = {};

JenkinsJob.prototype.fetchJsonStatus = function fetchJson(callback) {
    try {
        var url = "http://" + this.domain + "/job" +
            urlencode(this.name) + "/api/json";
        console.log("fetching results from ", url);
        request({
            method: "GET",
            json: true
        }, function (err, response, body) {
            console.log("got back: " + response.statusCode);
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

/*
 Returns the builds for this job
 @returns array
 */
JenkinsJob.prototype.getBuilds = function getBuilds() {
    return [];
};

/**
 *
 Returns the health which is some kind of calculation of how this
 job has been performing over time.
 @returns {Health}
 */
JenkinsJob.prototype.getJobHealth = function getJobHealth(callback) {
    var self = this;
    try {
        if (self.status && self.status.healthReport) {
            var health = new Health();
            health.set(self.status.healthReport[0].score);
            callback(null, health);
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
JenkinsJob.prototype.getCurrentStatus = function getCurrentStatus() {
    return _.sample(STATUS);
};

module.exports = JenkinsJob;