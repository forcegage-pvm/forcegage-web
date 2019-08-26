import { PersonalBest } from './personalBest';

export class Exercises {
  constructor(sessions) {
    this.exercises = this.getExerciseData(sessions);
  }

  /**
   *
   * @param {Session} sessions
   */
  getExerciseData(sessions) {
    var result = [];
    // * Get distinct exercises for all sessions
    var exercises = [...new Set(sessions.map(s => s.exercise))];
    exercises.forEach(e => {
      // {e} is the current exercise
      // * filtered sessions based on the current exercise (e)
      var es = sessions.filter(s => s.exercise === e);
      // * get the distinct list of @param weights for this exercise
      var weights = [...new Set(es.map(s => Number(s.weight)))];
      var ex = {
        exercise: e,
        weights: [],
        sides: []
      };
      // # iterates weights and get the summary information
      weights.forEach(w => {
        // {w} is the current weight
        // * filtered sessions based on the current weight (w)
        var fi = es.filter(e => e.weight === w);
        // * for each weight, get the list of distinct sides
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
            side: side,
            // get the average summary
            average: this.getAvgForSide(fi, side),
            // get the best summary
            best: this.getBestForSide(fi, side)
          });
        });
        // * get the summary data for the current {weight}
        ex.weights.push({
          weight: w,
          // # side summary here is for the current {exercise} and {weight}
          sides: sideSummary,
          // # best summary here is for the current {exercise} and {weight} accross both {sides}
          best: this.getBestForWeight(distinctSides, fi),
          // # average summary here is for the current {exercise} and {weight} accross both {sides}
          average: this.getAvgForWeight(distinctSides)
        });
      });
      // get the distinct sides information across all {weights}
      var allSides = es.map(s => s.sides);
      var sides = [];
      allSides.forEach(s => s.forEach(x => sides.push(x)));
      var distinctSides = [...new Set(sides.map(s => s.side))];
      // # iterates {sides} and get the summary information across all {weights}
      distinctSides.forEach(side => {
        ex.sides.push({
          side: side,
          average: this.getSideSummary(es, side, 'average', es),
          best: this.getSideSummary(es, side, 'best', es)
        });
      });
      // we have Left/Right - add summary to exercise
      if (distinctSides.length === 2) {
        ex.average = this.getAvgForExercise(ex);
        ex.best = this.getBestForExercise(ex, es);
      }
      // we should then only have {Both}
      else {
        var both = ex.sides.find(side => side.side === 'Both');
        if (both !== undefined) {
          ex.average = both.average;
          ex.best = both.best;
        }
      }

      result.push(ex);
    });
    return result;
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

  getSideSummary(es, side, type, sessions) {
    var sidesAvg = [];
    var summaryStats = [];
    var stats = {};
    es.forEach(s => {
      var sides = s.sides.filter(s => s.side === side);
      sides.forEach(side => sidesAvg.push(side[type]));
    });
    sidesAvg.forEach((side, index) => {
      if (index === 0) {
        stats = JSON.parse(JSON.stringify(side));
        stats.forEach(st => (st.values = [st.value]));
      } else {
        side.forEach((stat, idx) => {
          var st = stats[idx];
          st.value += stat.value;
          st.values.push(stat.value);
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

  getAvgForExercise(exercise) {
    var stats = [];
    exercise.weights[0].average.forEach(stat => {
      var newStat = JSON.parse(JSON.stringify(stat));
      newStat.value = 0;
      stats.push(newStat);
    });
    exercise.weights.forEach(weight => {
      var sideStats = this.getAvgForWeight(weight.sides);
      sideStats.forEach((stat, index) => {
        var newStat = stats[index];
        newStat.value += stat.value;
      });
    });
    stats.forEach((stat, index) => {
      stat.value = stat.value / exercise.weights.length;
    });
    return stats;
  }

  getBestForExercise(exercise, sessions) {
    var bestStats = [];
    var stats = [];
    exercise.weights[0].best.forEach(stat => {
      var newStat = JSON.parse(JSON.stringify(stat));
      newStat.values = [];
      bestStats.push(newStat);
    });
    exercise.weights.forEach(weight => {
      var sideStats = this.getBestForWeight(weight.sides, sessions);
      sideStats.forEach((stat, index) => {
        var newStat = bestStats[index];
        newStat.values.push(stat.value);
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
}
