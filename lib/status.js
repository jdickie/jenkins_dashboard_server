var StatusCheck = function () {};

StatusCheck.getBuildStatusJSON = function getBuildStatusJSON(serverName) {
    return {
        health: 100
    };
};

StatusCheck.getBuildStatusRGB = function getBuildStatusRGB() {

};

module.exports = StatusCheck;