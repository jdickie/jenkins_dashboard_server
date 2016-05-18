const fs = require ('fs');
var Health = require('./health.js');

var RgbBuilder = function () {};
RgbBuilder.output = "255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,255,0,255,255,0,255,255,0,255,0,0,255,0,0,255,255,0,0,255,255,255,255,0,255,0,0,255,0,0,255,255,0,255,255,0,255,255,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0,255,0,0";
RgbBuilder.buckets = [];

/*
@param int health
 */
RgbBuilder.setLine = function (health, index) {

};

RgbBuilder.interpretHealth = function(health) {
  var healthIndex = health.getHealth();
  if (healthIndex >= health.GREAT) {
    return [51, 255, 51];
  }
  if (healthIndex < health.GREAT && healthIndex > health.OK) {

  }
};

RgbBuilder.render = function () {
  return this.output;
};

module.exports = RgbBuilder;