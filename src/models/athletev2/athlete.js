export class Athlete {
  constructor() {
    this.days = [];
    this.sessions = [];
    this._sessionId = 0;
    this._setId = 0;
    this._repId = 0;
    this._statId = 0;
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
    // console.log("athlete", this)
  }
}
