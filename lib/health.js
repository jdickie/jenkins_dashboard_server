var Health = function () {};
var _ = require('lodash');


Health.prototype.GREAT_INT = 100;
Health.prototype.OK_INT = 50;
Health.prototype.BAD_INT = 0;
Health.prototype.OK_STRING = 'OK';
Health.prototype.BAD_STRING = 'FAILURE';
Health.prototype.GREAT_STRING = 'SUCCESS';

Health.prototype.OK_VALUES = ['ABORTED', 'IN PROGRESS'];

Health.prototype.current_health = 100;

Health.prototype.set = function (value) {
    var self = this;
  if (_.isInteger(value)) {
      console.log('setting health as: ' + value);
      self.current_health = value;
  } else if (_.isString(value)) {
      switch (value.toUpperCase()) {
          case self.GREAT_STRING:
              self.current_health = Health.GREAT_INT;
              break;
          case self.BAD_STRING:
              self.current_health = Health.BAD_INT;
              break;
      }
      var isOkValue = _.find(self.OK_VALUES, function(okString) {
          return okString == value;
      });
      if (isOkValue) {
          self.current_health = self.OK_INT;
      }
  }
};

Health.prototype.getHealthAsInt = function () {
    return this.current_health;
};

Health.prototype.getHealthAsString = function () {
    var self = this;
    if (self.current_health >= self.GREAT_INT) {
        return self.GREAT_STRING;
    } else if (self.current_health < self.GREAT_INT && self.current_health >= self.OK_INT) {
        return self.OK_STRING;
    } else {
        return self.BAD_STRING;
    }
};

module.exports = Health;