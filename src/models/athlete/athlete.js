import { Day } from './day';
import { Exercises } from './exercises';
import { save } from 'save-file';
import { observable, action, decorate, computed } from 'mobx';

const typesForPBs = ['force', 'fmax', 'power'];
const bestSessionIndicator = 'force';

export class Athlete {
  constructor() {
    this.days = [];
    this.sessions = [];
    this.exercises = [];
    this._sessionId = 0;
    this._setId = 0;
    this._repId = 0;
    this._statId = 0;
    this._statsProvider = undefined;
    this.days = [];
    this.exerciseDays = [];
    this.loaded = false;
    this.period = {};
    this.firstName = '';
    this.lastName = '';
  }

  get fullName() {
    return this.firstName + ' ' + this.lastName;
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
    this.period.period = {
      from: from,
      to: to
    };
    this.period.exerciseDays = this.days;
    this.period.summary = summary;
    this.loaded = true;
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

decorate(Athlete, {
  firstName: observable,
  lastName: observable,
  fullName: computed,
  bodyWeight: observable,
  exercises: observable,
  loaded: observable,
  // period: observable,
  exerciseDays: observable,
  loadSessionData: action,
  getPeriodData: action,
  fromJson: action,
  addSessionFromJson: action
});
