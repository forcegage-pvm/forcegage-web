import React, { Component } from 'react';
import AthleteMenu from './components/athleteMenu';
import AthleteContent from './components/athleteContent';
import { GetStore } from '../../models/store/store';
import './athletePage.css';

export default class AthletePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
    this.setStateFromProps(props);
    this.store = GetStore();
  }

  setStateFromProps = props => {
    this.setState({}, () => {});
  };

  componentWillReceiveProps = props => {
    this.setStateFromProps(props);
  };

  componentDidMount = () => {
    this.setState({
      mounted: true
    });
  };

  render() {
    return (
      <div className="main">
        <div className="main-menu">{AthleteMenu}</div>
        <div className="main-content">{AthleteContent}</div>
      </div>
    );
  }
}
