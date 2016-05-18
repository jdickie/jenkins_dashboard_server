var Health = function () {};
var _ = require('lodash');


Health.GREAT = 100;
Health.OK = 50;
Health.BAD = 0;
Health.current_health = 100;

Health.set = function (value) {
  if (_.isInteger(value)) {
      this.current_health = value;
  }
};

Health.getHealth = function () {
    return this.current_health;
};

module.exports = Health;