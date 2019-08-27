import { Day } from './day';
import { Exercises } from './exercises';
import { save } from 'save-file';
import { observable } from 'mobx';

const typesForPBs = ['force', 'fmax', 'power'];
const bestSessionIndicator = 'force';

export class Athlete {
  @observable firstName = 'json.firstName';

  constructor() {
    this.days = [];
    this.sessions = [];
    this._sessionId = 0;
    this._setId = 0;
    this._repId = 0;
    this._statId = 0;
    this._statsProvider = undefined;
    this.days = [];
  }

  fromJson(json) {
    this.id = json.id;
    this.firstName = json.firstName;
    this.lastName = json.lastName;
    this.bodyWeight = json.bodyWeight;
    this.bodyWeights = json.bodyWeights;
  }

  addSessionFromJson(json) {
    var session = {
      sessionId: this._sessionId,
      bodyWeight: json.bodyWeight,
      exercise: json.exercise,
      notes: json.notes,
      sessionType: json['session-type'],
      testSession: json['test-session'],
      side: json.side,
      timestamp: json.timestamp,
      weight: json.weight,
      sets: json.sets
    };
    session.sets.forEach(set => {
      set['setId'] = this._setId;
      this._setId++;
      set.reps.forEach(rep => {
        rep['repId'] = this._repId;
        this._repId++;
      });
    });
    this._sessionId++;
    this.sessions.push(session);
  }

  async getPeriodData(from, to) {
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
      exerciseDays: this.days,
      summary: summary
    };
    console.log('result', result);
    // this.normalizeData(result)
    return result;
  }

  async normalizeData(data) {
    var result = [];
    var header = 'from, to, exercise, weight, side, type, name, value';
    result.push(header);
    data.summary.exercises.forEach(ex => {
      ex.weights.forEach(w => {
        w.sides.forEach(s => {
          s.average.forEach(a => {
            var record = `${data.period.from
              .toISOString()
              .slice(0, 10)}, ${data.period.to.toISOString().slice(0, 10)}, ${
              ex.exercise
            }, ${w.weight}, ${s.side}, average, ${a.name}, ${a.value}`;
            result.push(record);
          });
          s.best.forEach(a => {
            var record = `${data.period.from
              .toISOString()
              .slice(0, 10)}, ${data.period.to.toISOString().slice(0, 10)}, ${
              ex.exercise
            }, ${w.weight}, ${s.side}, best, ${a.name}, ${a.value}`;
            result.push(record);
          });
        });
      });
    });
    var output = '';
    result.forEach(r => {
      if (output === '') {
        output = r + +'\r\n';
      } else {
        output = output + r + '\r\n';
      }
    });

    await save(output, 'data.json');
  }

  async loadSessionData() {
    let self = this;

    var promise = new Promise(function(resolve, reject) {
      var athlete = self.getSessionData();
      resolve(athlete);
    });
    await promise;
    return this;
  }

  async getSessionData() {
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

  getRange(from, to) {
    return this.exerciseDays.filter(
      exerciseDay => exerciseDay.date >= from && exerciseDay.date <= to
    );
  }

  getDay(day) {
    return this.exerciseDays.find(exerciseDay => exerciseDay.date === day);
  }
}
