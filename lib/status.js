var RgbBuilder = require('./rgbTxtBuilder.js');
var _ = require('lodash');
var StatusCheck = function () {
};

StatusCheck.getBuildStatusJSON = function getBuildStatusJSON(serverName) {
    console.log("Fetching build status for " + serverName);
    return {
        health: 100
    };
};

StatusCheck.getTestStatusJSON = function getTestStatusJSON(serverName) {

};

StatusCheck.getBuildStatusRGB = function getBuildStatusRGB(serverNames) {
    if (_.isArray(serverNames)) {
        
    } else {
        return RgbBuilder.render();
    }
};

module.exports = StatusCheck;