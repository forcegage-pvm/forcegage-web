import { DataProvider } from '../../providers/data/dataProvider';
import { Athlete } from '../../models/athlete/athlete';
import { State } from './state';
import firebase from '../../firebase';
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
    this.state = new State();
    this.exercises = observable([]);
    this.athletes = observable([]);
    this.athlete = new Athlete();
    this.initStore();
  }

  async initStore() {
    this._provider = new DataProvider();
    this.loadAthletes();
    this.loadExercises();
    // this.loadAthlete('Glwok6yOD5CgxJJ8x3aq');
  }

  async loadExercises() {
    this._provider.loadExercises().then(exercises => {
      exercises.forEach(exercise => {
        this.exercises.push(exercise);
      });
      console.log('exercises', exercises);
    });
  }

  async loadAthletes() {
    this._provider.loadAthletes().then(athletes => {
      athletes.sort((x, y) => (x.lastName > y.lastName ? 1 : -1));
      athletes.forEach(athlete => {
        this.athletes.push(athlete);
      });
      console.log('athletes', this.athletes);
      this.state.athletesLoading = false;
    });
  }

  async logOut() {
    this.athlete.clear();
    firebase.auth().signOut();
    this.state.loggedIn = false;
    this.state.activeMenuItem = 'login';
  }

  async loadAthlete(id) {
    this.state.menuSelected = false;
    this.state.athleteLoading = true;
    this.state.menuParent = 'overview';
    this.state.menuSelectedKeys = ['overview'];
    this._provider.loadAthlete(id, this.athlete).then(() => {
      this.athlete.loadSessionData().then(athlete => {
        console.log('Athlete:', athlete);
        this.athlete
          .getPeriodData(new Date(2018, 5, 1), new Date(2019, 9, 31))
          .then(() => {
            console.log('result', this.athlete.period);
            this.state.athleteLoading = false;
          });
      });
    });
  }
}

decorate(Store, {
  athlete: observable,
  athletes: observable,
  exercises: observable,
  state: observable,
  loadAthlete: action,
  loadAthletes: action,
  logOut: action
});
