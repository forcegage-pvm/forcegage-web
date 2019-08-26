import firebase from 'firebase';
import { Athlete } from '../../models/athletev2/athlete';
import Expander from '../../transformers/data/DataExpander';
import StatsProvider from '../../providers/data/StatsProvider';

export class DataProvider {
  constructor() {
    this.athlete = undefined;

    this._firebaseApp = firebase.initializeApp({
      apiKey: 'AIzaSyChIg_5ZkJyAIs8q6PxwmMC6HzO4AYqbrE',
      authDomain: 'forcegage-gcp.firebaseapp.com',
      databaseURL: 'https://forcegage-gcp.firebaseio.com',
      projectId: 'forcegage-gcp',
      storageBucket: 'forcegage-gcp.appspot.com',
      messagingSenderId: '1007124702329',
      appId: '1:1007124702329:web:1a695e3e0138af8f'
    });

    this._db = this._firebaseApp.firestore();
    this.athlete = new Athlete();
  }

  loadAthlete(atheledId) {
    this._db
      .collection('athletes')
      .doc('Glwok6yOD5CgxJJ8x3aq')
      .get()
      .then(snapshot => {
        // console.log(snapshot)
        var data = snapshot.data();
        this.athlete.fromJson(data);
        // console.log("data", data)
      });

    this._db
      .collection('athletes')
      .doc('Glwok6yOD5CgxJJ8x3aq')
      .collection('sessions')
      .get()
      .then(snapshots => {
        // console.log(snapshots)
        snapshots.docs.forEach(doc => {
          // console.log("doc", doc.data())
          this.athlete.addSessionFromJson(doc.data());
        });
        this._expanded = Expander(this.athlete);
        this._statsProvider = new StatsProvider(this._expanded);
      });
  }
}
