import { Day } from './day';
import { Exercises } from './exercises';
import { Session } from './sessions';
import _ from 'lodash';
import { observable, action, decorate, computed, autorun } from 'mobx';
import { GetStore } from '../store/store';

const typesForPBs = ['force', 'fmax', 'power'];
const bestSessionIndicator = 'force';

export class Athlete {
  constructor() {
    this.days = observable([]);
    this.sessions = observable([]);
    this.exercises = observable([]);
    this.exerciseDays = observable([]);
    this._sessionId = 0;
    this._setId = 0;
    this._repId = 0;
    this._statId = 0;
    this._statsProvider = undefined;
    this.loaded = false;
    this.period = {};
    this.firstName = '';
    this.lastName = '';
    this.tests = observable([]);
  }

  get fullName() {
    return this.firstName + ' ' + this.lastName;
  }

  clear = () => {
    this.id = null;
    this.firstName = '';
    this.lastName = '';
    this.bodyWeight = null;
    this.bodyWeights = null;
    this.days = observable([]);
    this.sessions = observable([]);
    this.exercises = observable([]);
    this.exerciseDays = observable([]);
    this.tests = observable([]);
  };

  fromJson(json) {
    this.id = json.id;
    this.firstName = json.firstName;
    this.lastName = json.lastName;
    this.bodyWeight = json.bodyWeight;
    this.bodyWeights = json.bodyWeights;
    this.days = observable([]);
    this.sessions = observable([]);
    this.exercises = observable([]);
    this.exerciseDays = observable([]);
    if (json.tests !== undefined) {
      this.tests = json.tests;
    }
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
      sets: JSON.parse(JSON.stringify(json.sets))
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
    summary.exercises.forEach(e => this.exercises.push(e.exercise));
    this.getTestData();
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

  async getTestData() {
    var sessions = [];
    var exercises = GetStore().exercises;
    this.days.forEach(day =>
      day.sessions.forEach(session => sessions.push(session))
    );
    sessions = _.filter(sessions, { sessionType: 'test' });
    var groupedsessions = _.groupBy(sessions, 'testSession');
    var tests = [];
    Object.keys(groupedsessions).forEach(key => {
      var testSessions = groupedsessions[key];
      var summary = new Exercises(testSessions);
      tests.push({
        test: key.substr(4, 10),
        summary: summary
      });
    });
    tests.forEach(test => {
      var ex = exercises.find(
        exercise => exercise.exercise === test.summary.exercises[0].exercise
      );
      var types = [];
      var fullTest = false;
      test.summary.exercises.forEach(exercise => {
        exercise.types.forEach(t => types.push(t.type));
      });
      var dtypes = [...new Set(types.map(x => x))];
      fullTest = dtypes.length === 3;
      test.complete = fullTest;
      test.class = ex['exercise-class'];
      test['exercise-group'] = ex['exercise-group'];
      test['exercise-subclass'] = ex['exercise-subclass'];
      test['exercise'] = ex['exercise'];
      test['body-part'] = ex['body-part'];
      test['body-parts'] = ex['body-parts'];
      test['movements'] = ex['movements'];
      test.max = [
        { type: 'Isometric', force: NaN },
        { type: 'Constant Contact', force: NaN },
        { type: 'Throw-off', force: NaN }
      ];
      test.group = ex['group'];
    });
    tests.forEach(test => {
      test.summary.exercises.forEach(exercise => {
        exercise.types.forEach(type => {
          var max = test.max.find(t => t.type === type.type);
          max.force = type.summary.best.find(b => b.name === 'force').value;
        });
      });
    });
    tests.sort((a, b) => (new Date(a.test) > new Date(b.test) ? 1 : -1));
    this.tests = tests;
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
