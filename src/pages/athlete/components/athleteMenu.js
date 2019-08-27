import React, { Component } from 'react';
import '../athletePage.css';

export default class AthleteMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
    this.setStateFromProps(props);
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
    return <div></div>;
  }
}
