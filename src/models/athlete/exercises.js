export class Exercises {
  constructor(sessions) {
    this.exercises = this.getExerciseData(sessions);
  }

  getExerciseData(sessions) {
    var result = [];

    // * Get distinct exercises for all sessions
    var exercises = [...new Set(sessions.map(s => s.exercise))];
    exercises.forEach(e => {
      // {e} is the current exercise
      // * filtered sessions based on the current exercise (e)
      var es = sessions.filter(s => s.exercise === e);
      // * Get exercise/test session grouping
      var sessionTypes = [...new Set(es.map(s => s.sessionType))];
      var types = [];
      sessionTypes.map(t =>
        types.push({
          type: t,
          weights: [],
          sides: []
        })
      );
      // * get the distinct list of @param weights for this exercise
      var weights = [...new Set(es.map(s => Number(s.weight)))];
      var exerciseData = {
        exercise: e,
        sessionTypes: types,
        summary: {
          weights: [],
          sides: []
        }
      };

      // # iterates weights and get the summary information
      weights.forEach(w => {
        // {w} is the current weight
        // * filtered sessions based on the current weight (w)
        var fi = es.filter(e => e.weight === w);
        // * for each weight, get the list of distinct sides
        var summary = this.getWeightSummary(fi, w);
        exerciseData.summary.weights.push(summary);
      });
      // get the distinct sides information across all {weights}
      var distinctSides = this.getSidesSummary(es, exerciseData.summary.sides);
      // we have Left/Right - add summary to exercise
      if (distinctSides.length === 2) {
        exerciseData.summary.average = this.getAvgForExercise(
          exerciseData.summary.weights
        );
        exerciseData.summary.best = this.getBestForExercise(
          exerciseData.summary.weights,
          es
        );
        // we should then only have {Both}
      } else {
        var both = exerciseData.summary.sides.find(
          side => side.side === 'Both'
        );
        if (both !== undefined) {
          exerciseData.summary.average = both.average;
          exerciseData.summary.best = both.best;
        }
      }
      exerciseData.sessionTypes.forEach(t => {
        // {e} is the current exercise
        // * filtered sessions based on the current exercise (e)
        var est = sessions.filter(
          s => s.exercise === e && s.sessionType === t.type
        );
        // * get the distinct list of @param weights for this exercise
        var typeWeights = [...new Set(est.map(s => Number(s.weight)))];
        // # iterates weights and get the summary information
        typeWeights.forEach(w => {
          // {w} is the current weight
          // * filtered sessions based on the current weight (w)
          var fi = est.filter(e => e.weight === w);
          // * for each weight, get the list of distinct sides
          var summary = this.getWeightSummary(fi, w);
          t.weights.push(summary);
        });
        // get the distinct sides information across all {weights}
        var distinctSides = this.getSidesSummary(est, t.sides);
        // we have Left/Right - add summary to exercise
        if (distinctSides.length === 2) {
          t.average = this.getAvgForExercise(t.weights);
          t.best = this.getBestForExercise(t.weights, est);
          // we should then only have {Both}
        } else {
          var both = t.sides.find(side => side.side === 'Both');
          if (both !== undefined) {
            t.average = both.average;
            t.best = both.best;
          }
        }
      });
      result.push(exerciseData);
    });
    this.sortData(result);
    this.getDeviation(result);
    return result;
  }

  getWeightSummary(fi, w) {
    var allSides = fi.map(s => s.sides);
    var sides = [];
    allSides.forEach(s => s.forEach(x => sides.push(x)));
    var distinctSides = [...new Set(sides.map(s => s))];
    // onlySides is a simple list of only the side name (Left/Right/etc)
    var onlySides = [...new Set(sides.map(s => s.side))];
    var sideSummary = [];
    // * iterate the sides and get the summary data
    // * this will be for the current {exercise} and {weight}
    onlySides.forEach(side => {
      sideSummary.push({
        side: JSON.parse(JSON.stringify(side)),
        // get the average summary
        average: this.getAvgForSide(fi, side),
        // get the best summary
        best: this.getBestForSide(fi, side)
      });
    });
    // * get the summary data for the current {weight}
    return {
      weight: w,
      // # side summary here is for the current {exercise} and {weight}
      sides: sideSummary,
      // # best summary here is for the current {exercise} and {weight} accross both {sides}
      best: this.getBestForWeight(distinctSides, fi),
      // # average summary here is for the current {exercise} and {weight} accross both {sides}
      average: this.getAvgForWeight(distinctSides)
    };
  }

  sortData(data) {
    data.forEach(e => {
      e.summary.weights.sort((x, y) => (x.weight > y.weight ? 1 : -1));
      e.summary.weights.forEach(w =>
        w.sides.sort((x, y) => (x.side > y.side ? 1 : -1))
      );
      e.summary.sides.sort((x, y) => (x.side > y.side ? 1 : -1));
    });
  }

  getDeviation(data) {
    data.forEach(e => {
      for (var i = 0; i < e.summary.weights.length - 1; i++) {
        var weight = e.summary.weights[i];
        var nextWeight = e.summary.weights[i + 1];
        weight.average.forEach(s => {
          var nextStat = nextWeight.average.find(a => a.name === s.name);
          var def = 1 - s.value / nextStat.value;
          nextStat['deviation'] = def;
          nextStat['deviation/kg'] =
            (nextStat.value - s.value) / nextWeight.weight;
        });
        weight.best.forEach(s => {
          var nextStat = nextWeight.best.find(a => a.name === s.name);
          var def = 1 - s.value / nextStat.value;
          nextStat['deviation'] = def;
          nextStat['deviation/kg'] =
            (nextStat.value - s.value) / nextWeight.weight;
        });
        this.getSideDeviation(weight.sides);
      }
      this.getSideDeviation(e.summary.sides);
    });
  }

  getSideDeviation(sides) {
    for (var i = 0; i < sides.length - 1; i++) {
      var side = sides[i];
      var nextSide = sides[i + 1];
      side.average.forEach(s => {
        var nextStat = nextSide.average.find(a => a.name === s.name);
        var def = 1 - s.value / nextStat.value;
        nextStat['deviation'] = def;
      });
      side.best.forEach(s => {
        var nextStat = nextSide.best.find(a => a.name === s.name);
        var def = 1 - s.value / nextStat.value;
        nextStat['deviation'] = def;
      });
    }
  }

  getAvgForSide(sessions, sd) {
    var stats = [];
    var sideCount = 0;
    sessions.forEach(session => {
      var side = session.sides.find(s => s.side === sd);
      if (side !== undefined) {
        sideCount++;
        if (stats.length === 0) {
          side.average.forEach(stat => stats.push(stat));
        } else {
          side.average.forEach((stat, idx) => {
            var st = stats[idx];
            st.value += stat.value;
          });
        }
      }
    });
    stats.forEach(stat => {
      stat.value = stat.value / sideCount;
    });
    return stats;
  }

  getBestForSide(sessions, sd) {
    var stats = [];
    var summaryStats = [];
    sessions.forEach(session => {
      var side = session.sides.find(s => s.side === sd);
      if (side !== undefined) {
        if (stats.length === 0) {
          side.best.forEach(stat => stats.push(stat));
          stats.forEach(st => (st.values = [st.value]));
        } else {
          side.best.forEach((stat, idx) => {
            var st = stats[idx];
            st.values.push(stat.value);
          });
        }
      }
    });
    stats.forEach(stat => {
      var value = 0;
      if (stat.best === 'highest') {
        value = stat.values.Max()[0];
      }
      if (stat.best === 'lowest') {
        stat.values.sort((x, y) => (x > y ? 1 : -1));
        stat.values = stat.values.filter(v => v !== 0);
        value = stat.values.Min()[0];
      }
      summaryStats.push({
        value: value,
        name: stat.name,
        unit: stat.unit,
        best: stat.best
      });
    });
    this.getBestMetaData(summaryStats, sessions);
    // TODO try to find the metadata for the best value
    return summaryStats;
  }

  getBestMetaData(best, sessions) {
    best.forEach(s => {
      sessions.forEach(session => {
        session.sets.forEach(set => {
          var max = set.stats.find(stat => stat.value === s.value);
          if (max !== undefined) {
            s.meta = {
              weight: session.weight,
              timeOfDay: session.timeOfDay,
              date: session.date,
              sessionId: session.sessionId,
              side: set.side,
              setId: set.setId,
              statId: max.statId,
              timestamp: set.timestamp,
              exercise: session.exercise
            };
          }
          s.value = s.value;
        });
      });
    });
  }

  getSideSummary(es, sideName, type, sessions) {
    var sidesAvg = [];
    var summaryStats = [];
    var stats = {};
    es.forEach(s => {
      var sides = s.sides.filter(s => s.side === sideName);
      sides.forEach(side => sidesAvg.push(side[type]));
    });
    sidesAvg.forEach((side, index) => {
      if (index === 0) {
        stats = JSON.parse(JSON.stringify(side));
        stats.forEach(st => (st.values = [st.value]));
      } else {
        side.forEach((stat, idx) => {
          var name = stat['name'];
          var st = stats.find(sx => sx['name'] === name);
          if (st !== undefined) {
            st.value += stat.value;
            st.values.push(stat.value);
          }
        });
      }
    });
    if (type === 'average') {
      if (stats.length > 0) {
        stats.forEach(stat => {
          stat.value = stat.value / sidesAvg.length;
          delete stat.values;
        });
        summaryStats = stats;
      }
    }
    if (type === 'best') {
      stats.forEach(stat => {
        var value = 0;
        if (stat.best === 'highest') {
          value = stat.values.Max()[0];
        }
        if (stat.best === 'lowest') {
          stat.values.sort((x, y) => (x > y ? 1 : -1));
          stat.values = stat.values.filter(v => v !== 0);
          value = stat.values.Min()[0];
        }
        summaryStats.push({
          value: value,
          name: stat.name,
          unit: stat.unit,
          best: stat.best
        });
      });
      this.getBestMetaData(summaryStats, sessions);
    }
    return summaryStats;
  }

  getAvgForExercise(weights) {
    var stats = [];
    weights[0].average.forEach(stat => {
      var newStat = JSON.parse(JSON.stringify(stat));
      newStat.value = 0;
      stats.push(newStat);
    });
    weights.forEach(weight => {
      var sideStats = this.getAvgForWeight(weight.sides);
      sideStats.forEach((stat, index) => {
        var name = stat['name'];
        var newStat = stats.find(sx => sx['name'] === name);
        if (newStat !== undefined) {
          newStat.value += stat.value;
        }
      });
    });
    stats.forEach((stat, index) => {
      stat.value = stat.value / weights.length;
    });
    return stats;
  }

  getBestForExercise(weights, sessions) {
    var bestStats = [];
    var stats = [];
    weights[0].best.forEach(stat => {
      var newStat = JSON.parse(JSON.stringify(stat));
      newStat.values = [];
      bestStats.push(newStat);
    });
    weights.forEach(weight => {
      var sideStats = this.getBestForWeight(weight.sides, sessions);
      sideStats.forEach((stat, index) => {
        var name = stat['name'];
        var newStat = bestStats.find(sx => sx['name'] === name);
        if (newStat !== undefined) {
          newStat.values.push(stat.value);
        }
      });
    });
    bestStats.forEach(stat => {
      var value = 0;
      if (stat.best === 'highest') {
        value = stat.values.Max()[0];
      }
      if (stat.best === 'lowest') {
        stat.values.sort((x, y) => (x > y ? 1 : -1));
        stat.values = stat.values.filter(v => v !== 0);
        value = stat.values.Min()[0];
      }
      stats.push({
        value: value,
        name: stat.name,
        unit: stat.unit,
        best: stat.best
      });
    });
    this.getBestMetaData(stats, sessions);
    return stats;
  }

  getAvgForWeight(sides) {
    var stats = [];
    sides[0].average.forEach(stat => {
      var newStat = JSON.parse(JSON.stringify(stat));
      newStat.value = 0;
      stats.push(newStat);
    });

    sides.forEach(side => {
      side.average.forEach((stat, index) => {
        var newStat = stats[index];
        newStat.value += stat.value;
      });
    });
    stats.forEach((stat, index) => {
      stat.value = stat.value / sides.length;
    });
    return stats;
  }

  getBestForWeight(sides, sessions) {
    var bestStats = [];
    var stats = [];
    sides[0].best.forEach(stat => {
      var newStat = JSON.parse(JSON.stringify(stat));
      newStat.values = [];
      bestStats.push(newStat);
    });
    sides.forEach(side => {
      side.best.forEach((stat, index) => {
        var newStat = bestStats[index];
        newStat.values.push(stat.value);
      });
    });
    bestStats.forEach((stat, index) => {
      var value = 0;
      if (stat.best === 'highest') {
        value = stat.values.Max()[0];
      }
      if (stat.best === 'lowest') {
        stat.values.sort((x, y) => (x > y ? 1 : -1));
        stat.values = stat.values.filter(v => v !== 0);
        value = stat.values.Min()[0];
      }
      stats.push({
        value: value,
        name: stat.name,
        unit: stat.unit,
        best: stat.best
      });
    });
    this.getBestMetaData(stats, sessions);
    return stats;
  }

  getSidesSummary(filter, exerciseSides) {
    var allSides = filter.map(s => s.sides);
    var sides = [];
    allSides.forEach(s => s.forEach(x => sides.push(x)));
    var distinctSides = [...new Set(sides.map(s => s.side))];
    // # iterates {sides} and get the summary information across all {weights}
    distinctSides.forEach(side => {
      exerciseSides.push({
        side: JSON.parse(JSON.stringify(side)),
        average: this.getSideSummary(filter, side, 'average', filter),
        best: this.getSideSummary(filter, side, 'best', filter)
      });
    });
    return distinctSides;
  }
}
