import React, { Component } from 'react';
import styles from './session.css';
import 'antd/dist/antd.css';
import { List, Avatar, Icon } from 'antd';
import PersonalBests from './PersonalBest';

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

export default class Sessions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      sessions: props.sessions
    };
    this.statsProvider = props.statsProvider;
    // this.setStateFromProps(props.days)
  }

  setStateFromProps = props => {
    this.setState({
      mounted: true,
      sessions: props.sessions
    });
  };

  componentWillReceiveProps = props => {
    this.setStateFromProps(props);
  };

  componentDidMount = () => {
    const filter = {
      timestamp: {
        filter: true,
        values: [new Date(2019, 1, 1), new Date(2019, 12, 1)],
        compare: 'between'
      }
    };
    this.seasonBest = this.statsProvider.personalBestsForPeriod(filter);
  };

  render() {
    const { sessions } = this.state;

    return (
      <div className="sessions-container">
        <div className="sessions-header">Sessions</div>
        <div className="sessions-content">
          <List
            itemLayout="vertical"
            size="default"
            pagination={{
              onChange: page => {
                console.log(page);
              },
              pageSize: 5,
              position: 'top'
            }}
            dataSource={sessions}
            renderItem={session => {
              var range = {
                from: new Date(2019, 1, 1),
                to: new Date(2019, 12, 1)
              };
              return (
                <div className="session">
                  <div className="session-time">{session.timestamp}</div>
                  <div
                    className="session-header"
                    style={{ gridRow: 2, gridColumn: 1 }}
                  >
                    exercise
                  </div>
                  <div
                    className="session-title"
                    style={{ gridRow: 3, gridColumn: 1 }}
                  >
                    {session.exercise}
                  </div>
                  <div
                    className="session-header"
                    style={{ gridRow: 4, gridColumn: 1 }}
                  >
                    weight
                  </div>
                  <div
                    className="session-title"
                    style={{ gridRow: 5, gridColumn: 1 }}
                  >
                    {session.weight}
                  </div>
                  <div className="session-best">
                    <PersonalBests
                      seasonBest={this.seasonBest}
                      statsProvider={this.statsProvider}
                      range={range}
                      showWeights={false}
                      selectedWeights={[session.weight]}
                      exercise={session.exercise}
                    ></PersonalBests>
                  </div>
                </div>
              );
            }}
          />
        </div>
      </div>
    );
  }
}
