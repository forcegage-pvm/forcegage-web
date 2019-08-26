Object.defineProperty(Array.prototype, 'Max', {
  value: function Max() {
    var result = [];
    this.forEach((value, index) => {
      if (arguments.length > 0) {
        for (var i = 0; i < arguments.length; i++) {
          if (result.length < i + 1) {
            result.push(-Infinity);
          }
          var arg = arguments[i];
          var paths = arg.split('.');
          if (paths.length == 1) {
            try {
              if (value[paths[0]] !== undefined) {
                result[i] = Math.max(value[paths[0]], result[i]);
              }
            } catch (error) {}
          }
          if (paths.length == 2) {
            try {
              if (value[paths[0]][paths[1]] !== undefined) {
                result[i] = Math.max(value[paths[0]][paths[1]], result[i]);
              }
            } catch (error) {}
            if (value[paths[0]][paths[1]] !== undefined) {
              result[i] = Math.max(value[paths[0]][paths[1]], result[i]);
            }
          }
          if (paths.length == 3) {
            try {
              if (value[paths[0]][paths[1]][paths[2]] !== undefined) {
                result[i] = Math.max(
                  value[paths[0]][paths[1]][paths[2]],
                  result[i]
                );
              }
            } catch (error) {}
          }
        }
      } else {
        if (result.length === 0) {
          result.push(-Infinity);
        }
        result[0] = Math.max(value, result[0]);
      }
    });

    return result;
  },
  writable: true,
  configurable: true
});

Object.defineProperty(Array.prototype, 'Avg', {
  value: function Avg() {
    var result = [];
    this.forEach((value, index) => {
      if (arguments.length > 0) {
        for (var i = 0; i < arguments.length; i++) {
          if (result.length < i + 1) {
            result.push(0);
          }
          var arg = arguments[i];
          var paths = arg.split('.');
          if (paths.length == 1) {
            try {
              if (value[paths[0]] !== undefined) {
                result[i] += value[paths[0]];
              }
            } catch (error) {}
          }
          if (paths.length == 2) {
            try {
              if (value[paths[0]][paths[1]] !== undefined) {
                result[i] += value[paths[0]][paths[1]];
              }
            } catch (error) {}
            if (value[paths[0]][paths[1]] !== undefined) {
              result[i] += value[paths[0]][paths[1]];
            }
          }
          if (paths.length == 3) {
            try {
              if (value[paths[0]][paths[1]][paths[2]] !== undefined) {
                result[i] += value[paths[0]][paths[1]][paths[2]];
              }
            } catch (error) {}
          }
        }
      } else {
        if (result.length === 0) {
          result.push(0);
        }
        result[0] += value;
      }
    });
    var avg = [];
    result.forEach(r => avg.push(r / this.length));
    return avg;
  },
  writable: true,
  configurable: true
});

Object.defineProperty(Array.prototype, 'Min', {
  value: function Min() {
    var result = [];
    this.forEach((value, index) => {
      if (arguments.length > 0) {
        for (var i = 0; i < arguments.length; i++) {
          if (result.length < i + 1) {
            result.push(Infinity);
          }
          var arg = arguments[i];
          var paths = arg.split('.');
          if (paths.length == 1) {
            try {
              if (value[paths[0]] !== undefined) {
                result[i] = Math.min(value[paths[0]], result[i]);
              }
            } catch (error) {}
          }
          if (paths.length == 2) {
            try {
              if (value[paths[0]][paths[1]] !== undefined) {
                result[i] = Math.min(value[paths[0]][paths[1]], result[i]);
              }
            } catch (error) {}
            if (value[paths[0]][paths[1]] !== undefined) {
              result[i] = Math.min(value[paths[0]][paths[1]], result[i]);
            }
          }
          if (paths.length == 3) {
            try {
              if (value[paths[0]][paths[1]][paths[2]] !== undefined) {
                result[i] = Math.min(
                  value[paths[0]][paths[1]][paths[2]],
                  result[i]
                );
              }
            } catch (error) {}
          }
        }
      } else {
        if (result.length === 0) {
          result.push(Infinity);
        }
        result[0] = Math.min(value, result[0]);
      }
    });
    return result;
  },
  writable: true,
  configurable: true
});

Date.prototype.getWeekNumber = function() {
  var d = new Date(
    Date.UTC(this.getFullYear(), this.getMonth(), this.getDate())
  );
  var dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
};
