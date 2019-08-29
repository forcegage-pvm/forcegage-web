import { observable, action, decorate, computed } from 'mobx';

export class Period {
  period = { from: '', to: 'to' };
  exerciseDays = [];
  summary = {};

  constructor() {
    this.loaded = false;
  }
}

decorate(Period, {
  // period: observable,
  // exerciseDays: observable,
  // summary: observable,
  loaded: observable
});
