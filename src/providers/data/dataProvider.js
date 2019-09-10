import firebase from 'firebase';
import Expander from '../../transformers/data/DataExpander';
import StatsProvider from '../../providers/data/StatsProvider';
import { Athlete } from '../../models/athlete/athlete';

var Firebase = (function() {
  var instance;

  function createInstance() {
    var fb = firebase.initializeApp({
      apiKey: 'AIzaSyChIg_5ZkJyAIs8q6PxwmMC6HzO4AYqbrE',
      authDomain: 'forcegage-gcp.firebaseapp.com',
      databaseURL: 'https://forcegage-gcp.firebaseio.com',
      projectId: 'forcegage-gcp',
      storageBucket: 'forcegage-gcp.appspot.com',
      messagingSenderId: '1007124702329',
      appId: '1:1007124702329:web:1a695e3e0138af8f'
    });
    return fb;
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

export class DataProvider {
  constructor() {
    this._firebaseApp = Firebase.getInstance();
    this._db = this._firebaseApp.firestore();
  }

  async loadExercises() {
    var snapshots = await this._db.collection('exercises').get();
    var exercises = [];
    snapshots.docs.forEach(doc => {
      var exercise = doc.data();
      exercises.push(exercise);
    });
    return exercises;
  }

  async loadAthletes() {
    var snapshots = await this._db.collection('athletes').get();
    var athletes = [];
    snapshots.docs.forEach(doc => {
      var athlete = new Athlete();
      var data = doc.data();
      data.id = doc['id'];
      athlete.fromJson(data);
      athletes.push(athlete);
    });
    return athletes;
  }

  async loadAthlete(atheledId, athlete) {
    var snapshot = await this._db
      .collection('athletes')
      .doc(atheledId)
      .get();
    var data = snapshot.data();
    data.id = snapshot['id'];
    athlete.fromJson(data);
    var snapshots = await this._db
      .collection('athletes')
      .doc(atheledId)
      .collection('sessions')
      .get();
    snapshots.docs.forEach(doc => {
      var data = doc.data();
      athlete.addSessionFromJson(data);
    });
    if (athlete['sessions'] !== undefined) {
      this._expanded = Expander(athlete);
      this._statsProvider = new StatsProvider(this._expanded);
      athlete._statsProvider = this._statsProvider;
    }
  }
}
