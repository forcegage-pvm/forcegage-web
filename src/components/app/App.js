import React from 'react';
import './App.css';
import ForceMenu from './ForceMenu';
import { GetStore } from '../../models/store/store';

export default class App extends React.Component {
  store = GetStore();

  render() {
    return (
      <div className="App">
        <ForceMenu></ForceMenu>
      </div>
    );
  }
}
