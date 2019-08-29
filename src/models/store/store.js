import { DataProvider } from '../../providers/data/dataProvider';
import { Athlete } from '../../models/athlete/athlete';
import { State } from './state';
import { Period } from './period';
import { observable, action, decorate } from 'mobx';

var store = (function() {
  var instance;

  function createInstance() {
    var store = new Store();
    return store;
  }

  return {
    getInstance: function() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

export function GetStore() {
  return store.getInstance();
}

class Store {
  constructor(brand) {
    this.athlete = new Athlete();
    this.state = new State();
    this.initStore();
  }

  async initStore() {
    this._provider = new DataProvider();
    this.loadAthlete();
  }

  async loadAthlete() {
    this._provider
      .loadAthlete('Glwok6yOD5CgxJJ8x3aq', this.athlete)
      .then(() => {
        console.log('athlete loaded');
        this.athlete.loadSessionData().then(athlete => {
          console.log('sessions loaded');
          console.log('Athlete:', athlete);
          this.athlete
            .getPeriodData(new Date(2018, 5, 1), new Date(2019, 9, 31))
            .then(() => {
              console.log('result', this.athlete.period);
            });
        });
      });
  }
}

decorate(Store, {
  athlete: observable,
  state: observable,
  loadAthlete: action
});
