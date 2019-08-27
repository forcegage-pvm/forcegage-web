import firebase from 'firebase';
import { Athlete } from '../../models/athlete/athlete';
import Expander from '../../transformers/data/DataExpander';
import StatsProvider from '../../providers/data/StatsProvider';

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
    this.athlete = undefined;

    this._firebaseApp = Firebase.getInstance();

    this._db = this._firebaseApp.firestore();
    this.athlete = new Athlete();
  }

  async loadAthlete(atheledId) {
    var snapshot = await this._db
      .collection('athletes')
      .doc('Glwok6yOD5CgxJJ8x3aq')
      .get();
    var data = snapshot.data();
    data.id = snapshot['id'];
    this.athlete.fromJson(data);
    var snapshots = await this._db
      .collection('athletes')
      .doc('Glwok6yOD5CgxJJ8x3aq')
      .collection('sessions')
      .get();
    snapshots.docs.forEach(doc => {
      this.athlete.addSessionFromJson(doc.data());
    });
    if (this.athlete['sessions'] !== undefined) {
      this._expanded = Expander(this.athlete);
      this._statsProvider = new StatsProvider(this._expanded);
      this.athlete._statsProvider = this._statsProvider;
      return this.athlete;
    }
  }
}
