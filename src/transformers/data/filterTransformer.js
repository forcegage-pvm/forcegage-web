export function countData(data, filteredData, filters) {
  var person = data.person;
  var dates = [];
  filteredData.years.forEach((day, index) => {
    day.count = 0;
  });
  filters.years.forEach((year, index) => {
    filters.days.forEach((day, dayIndex) => {
      var date = new Date(day);
      dates.push(date.toISOString().slice(0, 10));
    });
  });
  filteredData.weights.forEach((weight, index) => {
    weight.count = 0;
  });
  filteredData.days.forEach((day, index) => {
    day.count = 0;
  });
  filteredData.exercises.forEach((exercise, index) => {
    exercise.count = 0;
  });
  filteredData.sides.forEach((side, index) => {
    side.count = 0;
  });
  for (var sessionId in person.sessions) {
    var session = person.sessions[sessionId];
    var sessionDate = new Date(session.timestamp);
    var year = sessionDate.getFullYear();
    var cdate = sessionDate.toISOString().slice(0, 10);
    if (dates.indexOf(cdate) < 0) {
      continue;
    }
    if (filters.years.indexOf(year) < 0) {
      continue;
    }
    if (filters.exercises.indexOf(session.exercise) < 0) {
      continue;
    }
    if (filters.weights.indexOf(session.weight) < 0) {
      continue;
    }
    if (filters.exercises.indexOf(session.exercise) < 0) {
      continue;
    }

    for (var setIndex in session.exerciseSets) {
      var set = session.exerciseSets[setIndex];
      if (filters.sides.indexOf(set.side) < 0) {
        continue;
      }
      var weight = filteredData.weights.find(function(element) {
        return element.weight === session.weight;
      });
      weight.count += 1;
      var day = filteredData.days.find(function(element) {
        return element.date === cdate;
      });
      if (day !== undefined) {
        day.count += 1;
      }
      var year = filteredData.years.find(function(element) {
        return element.year === sessionDate.getFullYear();
      });
      if (year !== undefined) {
        year.count += 1;
      }
      var exercise = filteredData.exercises.find(function(element) {
        return element.exercise === session.exercise;
      });
      exercise.count += 1;

      var side = filteredData.sides.find(function(element) {
        return element.side === set.side;
      });
      if (side !== undefined) {
        side.count += 1;
      }
      for (var repIndex in set.exerciseReps) {
        var rep = set.exerciseReps[repIndex];
        for (var statIndex in rep.statistics) {
          var stat = rep.statistics[statIndex];
        }
      }
    }
  }
  return filteredData;
}

export function filterData(data, filters) {
  var person = data.person;
  var result = [];
  var dates = [];
  var groupWeights = [];
  var groupDates = [];
  filters.years.forEach((year, index) => {
    filters.days.forEach((day, dayIndex) => {
      var date = new Date(day);
      dates.push(date.toISOString().slice(0, 10));
    });
  });
  for (var sessionId in person.sessions) {
    var session = person.sessions[sessionId];
    var sessionDate = new Date(session.timestamp);
    var year = sessionDate.getFullYear();
    var cdate = sessionDate.toISOString().slice(0, 10);
    if (dates.indexOf(cdate) < 0) {
      continue;
    }
    if (filters.years.indexOf(year) < 0) {
      continue;
    }
    if (filters.weights.indexOf(session.weight) < 0) {
      continue;
    }
    if (filters.exercises.indexOf(session.exercise) < 0) {
      continue;
    }
    for (var setIndex in session.exerciseSets) {
      var set = session.exerciseSets[setIndex];
      if (filters.sides.indexOf(set.side) < 0) {
        continue;
      }
      if (groupWeights.indexOf(session.weight) < 0) {
        groupWeights.push(session.weight);
      }
      if (groupDates.indexOf(cdate) < 0) {
        groupDates.push(cdate);
      }

      for (var repIndex in set.exerciseReps) {
        var rep = set.exerciseReps[repIndex];
        for (var statIndex in rep.statistics) {
          var stat = rep.statistics[statIndex];
          var payload = {
            weight: session.weight,
            exercise: session.exercise,
            day: sessionDate.getDate() + 1,
            month: sessionDate.getMonth() + 1,
            year: sessionDate.getFullYear(),
            date: sessionDate.toISOString().slice(0, 10),
            side: rep.side,
            class: stat.class,
            aggregation: stat.aggregation,
            timestamp: session.timestamp,
            type: stat.type,
            value: Number(stat.value),
            values: [Number(stat.value)],
            dayOfYear: getDayOfTheYear(sessionDate)
          };
          result.push(payload);
        }
      }
    }
  }
  if (groupWeights.length === 1 && groupDates.length === 1) {
    return result;
  }
  if (groupWeights.length === 1) {
    var group = [];
    result.map((record, index) => {
      var curStat = group.find(function(stat) {
        return (
          stat.year === record.year &&
          stat.dayOfYear === record.dayOfYear &&
          stat.exercise === record.exercise &&
          stat.class === record.class &&
          stat.aggregation === record.aggregation &&
          stat.type === record.type &&
          stat.side === record.side
        );
      });
      if (curStat == undefined) {
        var payload = record;
        payload.count = 1;
        group.push(payload);
      } else {
        curStat.values.push(Number(record.value));
      }
    });
    // normal average
    // group.forEach((record) => {
    //     var sum = 0;
    //     record.values.forEach((value) => {
    //         sum += value
    //     })
    //     record.value = Number(sum / record.values.length)
    // })
    //olympic average
    group.forEach(record => {
      var sum = 0;
      record.values.sort((a, b) => (a > b ? 1 : -1));
      var start = Math.round(record.values.length * 0.2501);
      var end = Math.round(record.values.length * (1 - 0.2501));
      var subset = record.values.slice(start, end);
      if (subset.length >= 1) {
        subset.forEach(value => {
          sum += value;
        });
        record.value = Number(sum / subset.length);
      } else {
        record.values.forEach(value => {
          sum += value;
        });
        record.value = Number(sum / record.values.length);
      }
    });
    group.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
    return group;
  }
  if (
    groupDates.length === 1 ||
    (groupDates.length > 1 && groupWeights.length > 1)
  ) {
    //only one date. group by weight
    var group = [];
    result.map((record, index) => {
      var curStat = group.find(function(stat) {
        return (
          stat.weight === record.weight &&
          stat.exercise === record.exercise &&
          stat.class === record.class &&
          stat.aggregation === record.aggregation &&
          stat.type === record.type &&
          stat.side === record.side
        );
      });
      if (curStat == undefined) {
        var payload = record;
        payload.count = 1;
        group.push(payload);
      } else {
        curStat.value += Number(record.value);
        curStat.count += 1;
      }
    });
    group.forEach(record => {
      record.value = Number(record.value / record.count);
    });
    group.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
    return group;
  }
  result.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
  return result;
}

function getDayOfTheYear(date) {
  var start = new Date(date.getFullYear(), 0, 0);
  var diff =
    date -
    start +
    (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  return day;
}
