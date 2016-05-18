var Health = function () {};
var _ = require('lodash');


Health.GREAT = 100;
Health.OK = 50;
Health.BAD = 0;
Health.current_health = 100;

Health.set = function (value) {
  if (_.isInteger(value)) {
      this.current_health = value;
  } else if (_.isString(value)) {
      switch (value.toUpperCase()) {
          case 'GREAT':
              this.current_health = Health.GREAT;
              break;
          case 'OK':
              this.current_health = Health.OK;
              break;
          case 'BAD':
              this.current_health = Health.BAD;
              break;
      }
  }
};

Health.getHealth = function () {
    if (this.current_health >= this.GREAT) {
        return 'GREAT';
    } else if (this.current_health < this.GREAT && this.current_health >= this.OK) {
        return 'OK';
    } else {
        return 'BAD';
    }
};

module.exports = Health;