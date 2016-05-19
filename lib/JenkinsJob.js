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
 * @param mode string
 * @param server string
 * @constructor
 */
var JenkinsJob = function(mode, server) {
    this.mode = mode;
    this.server = server;
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
JenkinsJob.prototype.getJobHealth = function getJobHealth() {
    var health = new Health();
    health.set(_.random(100));
    return health;
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