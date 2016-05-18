var Health = function () {};
var _ = require('lodash');


Health.GREAT_INT = 100;
Health.OK_INT = 50;
Health.BAD_INT = 0;
Health.OK_STRING = 'OK';
Health.BAD_STRING = 'FAILURE';
Health.GREAT_STRING = 'SUCCESS';

Health.OK_VALUES = ['ABORTED', 'IN PROGRESS'];

Health.current_health = 100;

Health.set = function (value) {
  if (_.isInteger(value)) {
      this.current_health = value;
  } else if (_.isString(value)) {
      switch (value.toUpperCase()) {
          case this.GREAT_STRING:
              this.current_health = Health.GREAT_INT;
              break;
          case this.BAD_STRING:
              this.current_health = Health.BAD_INT;
              break;
      }
      var isOkValue = _.find(this.OK_VALUES, function(okString) {
          return okString == value;
      });
      if (isOkValue) {
          this.current_health = this.OK_INT;
      }
  }
};

Health.getHealthAsString = function () {
    if (this.current_health >= this.GREAT_INT) {
        return this.GREAT_STRING;
    } else if (this.current_health < this.GREAT_INT && this.current_health >= this.OK_INT) {
        return this.OK_STRING;
    } else {
        return this.BAD_STRING;
    }
};

module.exports = Health;