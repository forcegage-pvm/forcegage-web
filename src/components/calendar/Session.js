import React, { Component } from 'react';

export default class Session extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      date: props.date
    };
    this.statsProvider = props.statsProvider;
  }

  setStateFromProps = props => {
    this.setState({
      mounted: true,
      sessionId: props.sessionId
    });
  };

  componentWillReceiveProps = props => {
    this.setStateFromProps(props);
  };

  componentDidMount = () => {};

  render() {
    return <div></div>;
  }
}
