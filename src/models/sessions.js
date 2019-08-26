import { PersonalBest } from './personalBest';
import { Stats } from './stats';
import { Exercises } from './exercises';

export class Session {
  constructor(sessionId, data, bodyWeight, statsProvider) {
    var session = data.sessions.find(s => s.sessionId === sessionId);
    Object.keys(session).forEach(key => {
      this[key] = session[key];
    });
    this.getSetData(sessionId, data, bodyWeight, statsProvider);
    this.summary = new Exercises([this]);
  }

  getSetData(sessionId, data, bodyWeight, statsProvider) {
    var reps = data.reps.filter(s => s.sessionId === sessionId);
    this.sets = data.sets.filter(s => s.sessionId === sessionId);
    this.sets.forEach(set => {
      set.reps = data.reps.filter(s => s.sessionId === sessionId);
      set.stats = data.stats.filter(s => s.sessionId === sessionId);
    });
    this.sides = [];
    var sides = [...new Set(reps.map(x => x.side))];
    sides.forEach(side => {
      var repIds = data.reps
        .filter(r => r.sessionId === sessionId && r.side === side)
        .map(m => m.repId);
      var stats = data.stats.filter(rep => {
        return repIds.includes(rep.repId);
      });
      this.sides.push({
        side: side,
        average: new Stats(stats, bodyWeight, 'avg', statsProvider).avg,
        best: new Stats(stats, bodyWeight, 'best', statsProvider).max
      });
    });
  }
}
