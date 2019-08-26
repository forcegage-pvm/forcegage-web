import AthleteTransformer from '../transformers/data/athleteTransformer';
import Expander from '../transformers/data/DataExpander';
import StatsProvider from '../providers/data/StatsProvider';
import { Day } from './day';
import { Exercises } from './exercises';

const typesForPBs = ['force', 'fmax', 'power'];
const bestSessionIndicator = 'force';

export class Athlete {
  constructor(name, surname, bodyWeight, id) {
    this.name = name;
    this.surname = surname;
    this.bodyWeight = bodyWeight;
    this.id = id;
    this.loading = true;
    this.loadSessionData.bind(this);
    this.days = [];
  }

  getPeriodData(from, to) {
    var periodData = this.days.filter(
      day => day.date >= from && day.date <= to
    );
    var sessions = [];
    periodData.forEach(day =>
      day.sessions.forEach(session => sessions.push(session))
    );
    var summary = new Exercises(sessions);
    var result = {
      period: {
        from: from,
        to: to
      },
      days: this.days,
      summary: summary
    };
    // console.log("result", result)
    return result;
  }

  async getSessionData() {
    this._transformer = new AthleteTransformer();
    var data = await this._transformer.getData(this.id);
    this._data = data;
    this._expanded = Expander(this._data);
    this._statsProvider = new StatsProvider(this._expanded);

    var stats = this._statsProvider.filterStatsBy({}, true, true, true);
    this.sessions = stats.sessions;
    this.sets = stats.sets;
    this.reps = stats.reps;
    this.stats = stats.stats;
    this.exerciseDays = [];

    var allStats = this._statsProvider.groupSessionsBy({
      date: {
        filter: false,
        group: true
      }
    });
    for (var d in allStats.date) {
      var dateData = allStats.date[d];
      this.days.push(
        new Day(d, dateData, this._statsProvider, this.bodyWeight)
      );
    }

    var days = [...new Set(this.sessions.map(x => x.date))];
    days.forEach(day => {
      var statsForDay = this._statsProvider.groupSessionsBy({
        date: {
          filter: true,
          values: [day],
          compare: '=',
          group: false
        },
        exercise: {
          filter: false,
          group: true
        }
      });
      var item = {
        date: day,
        exercises: []
      };
      for (var e in statsForDay.exercise) {
        var exercise = statsForDay.exercise[e];
        if (exercise.stats.length > 0) {
          var periodBest = {
            date: {}
          };

          typesForPBs.forEach(type => {
            var filteredStats = this._statsProvider.filterStats(
              exercise.stats,
              'Total',
              type,
              'avg'
            );
            var max = filteredStats.Max('value')[0];
            periodBest[type] = max;
            if (type === bestSessionIndicator) {
              var maxStat = filteredStats.find(stat => stat.value == max);
              periodBest.sessionId = maxStat.sessionId;
            }
            var record = filteredStats.find(stat => stat.value == max);
            var session = this.sessions.find(
              s => s.sessionId === record.sessionId
            );
            periodBest.date[type] = session.date;
          });

          var ex = {
            exercise: e,
            sides: [...new Set(exercise.reps.map(x => x.side))],
            sessions: exercise.sessions,
            sets: exercise.sets,
            reps: exercise.reps,
            stats: exercise.stats,
            personalBest: periodBest
          };
          var weights = [];
          var statsForWeight = this._statsProvider.groupSessionsBy({
            date: {
              filter: true,
              values: [day],
              compare: '=',
              group: false
            },
            exercise: {
              filter: true,
              values: [e],
              compare: '=',
              group: false
            },
            weight: {
              filter: false,
              group: true
            }
          });
          for (var w in statsForWeight.weight) {
            var weight = statsForWeight.weight[w];
            var periodBest = {
              date: {}
            };
            typesForPBs.forEach(type => {
              var filteredStats = this._statsProvider.filterStats(
                weight.stats,
                'Total',
                type,
                'avg'
              );
              if (filteredStats.length > 0) {
                var max = filteredStats.Max('value')[0];
                periodBest[type] = max;
                if (type === bestSessionIndicator) {
                  var maxStat = filteredStats.find(stat => stat.value == max);
                  periodBest.sessionId = maxStat.sessionId;
                }
                var record = filteredStats.find(stat => stat.value == max);
                var session = this.sessions.find(
                  s => s.sessionId === record.sessionId
                );
                periodBest.date[type] = session.date;
              }
            });

            weights.push({
              weight: Number(w),
              sides: [...new Set(weight.reps.map(x => x.side))],
              sessions: weight.sessions,
              sets: weight.sets,
              reps: weight.reps,
              stats: weight.stats,
              personalBest: periodBest
            });
          }
          ex.weights = weights;
          item.exercises.push(ex);
        }
      }
      this.exerciseDays.push(item);
    });
    var exerciseList = this._statsProvider.getExercises();
    this.exercises = [];
    exerciseList.forEach(e => {
      var personalBest = { date: {} };
      var stats = this._statsProvider.filterStatsBy(
        {
          exercise: {
            filter: true,
            values: [e],
            compare: '=',
            group: false
          }
        },
        true,
        true,
        true
      );
      if (stats.stats.length !== 0) {
        typesForPBs.forEach(type => {
          var filteredStats = this._statsProvider.filterStats(
            stats.stats,
            'Total',
            type,
            'avg'
          );
          var max = filteredStats.Max('value')[0];
          personalBest[type] = max;
          if (type === bestSessionIndicator) {
            var maxStat = filteredStats.find(stat => stat.value == max);
            personalBest.sessionId = maxStat.sessionId;
          }
          var record = filteredStats.find(stat => stat.value == max);
          if (record !== undefined) {
            var session = this.sessions.find(
              s => s.sessionId === record.sessionId
            );
            personalBest.date[type] = session.date;
          }
        });
        var item = {
          exercise: e,
          sides: [...new Set(stats.reps.map(x => x.side))],
          sessions: stats.sessions,
          sets: stats.sets,
          reps: stats.reps,
          stats: stats.stats,
          personalBest: personalBest
        };
        var weights = [];
        var statsForWeight = this._statsProvider.groupSessionsBy({
          exercise: {
            filter: true,
            values: [e],
            compare: '=',
            group: false
          },
          weight: {
            filter: false,
            group: true
          }
        });
        for (var w in statsForWeight.weight) {
          var weight = statsForWeight.weight[w];
          var periodBest = { date: {} };
          typesForPBs.forEach(type => {
            var filteredStats = this._statsProvider.filterStats(
              weight.stats,
              'Total',
              type,
              'avg'
            );
            if (filteredStats.length > 0) {
              var max = filteredStats.Max('value')[0];
              periodBest[type] = max;
              if (type === bestSessionIndicator) {
                var maxStat = filteredStats.find(stat => stat.value == max);
                periodBest.sessionId = maxStat.sessionId;
              }
              var record = filteredStats.find(stat => stat.value == max);
              var session = this.sessions.find(
                s => s.sessionId === record.sessionId
              );
              periodBest.date[type] = session.date;
            }
          });

          weights.push({
            weight: w,
            sides: [...new Set(weight.reps.map(x => x.side))],
            sessions: weight.sessions,
            sets: weight.sets,
            reps: weight.reps,
            stats: weight.stats,
            personalBest: periodBest
          });
        }
        item.weights = weights;
        this.exercises.push(item);
      }
    });
    return this;
  }

  async loadSessionData() {
    this._transformer = new AthleteTransformer();
    let self = this;

    var promise = new Promise(function(resolve, reject) {
      var athlete = self.getSessionData();
      resolve(athlete);
    });
    await promise;
    return this;
  }

  getDay(day) {
    return this.exerciseDays.find(exerciseDay => exerciseDay.date === day);
  }

  getPersonalBest = (day, exercise, method) => {
    var exerciseDay = this.getDay(day).exercises.find(
      e => e.exercise === exercise
    );
    var personalBest = { date: {} };
    if (exerciseDay.stats.length !== 0) {
      typesForPBs.forEach(type => {
        var filteredStats = this._statsProvider.filterStats(
          exerciseDay.stats,
          'Total',
          type,
          method
        );
        var max = filteredStats.Max('value')[0];
        personalBest[type] = max;
        var record = filteredStats.find(stat => stat.value == max);
        var session = this.sessions.find(s => s.sessionId === record.sessionId);
        personalBest.date[type] = session.date;
      });
      return personalBest;
    }
  };

  getRange(from, to) {
    return this.exerciseDays.filter(
      exerciseDay => exerciseDay.date >= from && exerciseDay.date <= to
    );
  }
}
