import { PersonalBest } from './personalBest';

export class Set {
  constructor(sessionsId, data) {
    this.sessionId = sessionsId;
    this.data = data;

    this.getSetData();
  }

  getSetData() {
    var session = this.data.sessions.find(s => (s.sessionId = this.sessionId));
    this.exercise = session.exercise;
    this.weight = session.weight;
    this.sets = this.data.sets.filter(s => s.sessionId === this.sessionId);
    this.sides = [];
  }
}
