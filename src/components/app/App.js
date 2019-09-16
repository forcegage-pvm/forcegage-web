import React from 'react';
import './App.css';
import ForceMenu from './ForceMenu';
import { GetStore } from '../../models/store/store';
import firebase from '../../firebase';

export default class App extends React.Component {
  state = {
    authenticated: false
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(authenticated => {
      GetStore().state.loggedIn = authenticated;
      authenticated
        ? this.setState(() => ({
            authenticated: true
          }))
        : this.setState(() => ({
            authenticated: false
          }));
    });
  }

  render() {
    return (
      <div className="App">
        <ForceMenu authenticated={this.state.authenticated}></ForceMenu>
      </div>
    );
  }
}
