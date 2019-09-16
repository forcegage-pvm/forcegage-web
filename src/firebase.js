import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyChIg_5ZkJyAIs8q6PxwmMC6HzO4AYqbrE',
  authDomain: 'forcegage-gcp.firebaseapp.com',
  databaseURL: 'https://forcegage-gcp.firebaseio.com',
  projectId: 'forcegage-gcp',
  storageBucket: 'forcegage-gcp.appspot.com',
  messagingSenderId: '1007124702329',
  appId: '1:1007124702329:web:1a695e3e0138af8f'
};

firebase.initializeApp(firebaseConfig);

export default firebase;
