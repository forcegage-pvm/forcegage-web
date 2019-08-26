import { Exercises } from './exercises';
import { Session } from './sessions';

export class Day {
  constructor(date, data, statsProvider, bodyWeight) {
    this.date = new Date(date);
    this.AM = { sessions: [] };
    this.PM = { sessions: [] };

    this.getSetData(data, bodyWeight, statsProvider);

    // console.log("Day", this)
  }

  getSetData(data, bodyWeight, statsProvider) {
    data.sessions.forEach(session => {
      if (session.timeOfDay === 'AM') {
        this.AM.sessions.push(
          new Session(session.sessionId, data, bodyWeight, statsProvider)
        );
      } else {
        this.PM.sessions.push(
          new Session(session.sessionId, data, bodyWeight, statsProvider)
        );
      }
    });
    //get all the sessions for the day for the summary for the day
    this.sessions = [];
    this.AM.sessions.forEach(session => this.sessions.push(session));
    this.PM.sessions.forEach(session => this.sessions.push(session));
    this.summary = new Exercises(this.sessions);
    //get all the AM sessions for the AM summary
    var amSessions = [];
    this.AM.sessions.forEach(session => amSessions.push(session));
    this.AM.summary = new Exercises(amSessions);
    //get all the PM sessions for the PM summary
    var pmSessions = [];
    this.PM.sessions.forEach(session => pmSessions.push(session));
    this.PM.summary = new Exercises(pmSessions);
  }
}
