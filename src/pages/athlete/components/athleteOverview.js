import React, { Component } from 'react';
import { Spin, Button } from 'antd';
import { observer } from 'mobx-react';
import { GetStore } from '../../../models/store/store';
import { Segment, Statistic } from 'semantic-ui-react';
import _ from 'lodash';

const AthleteOverview = observer(
  class AthleteOverview extends Component {
    constructor(props) {
      super(props);
      this.state = {
        mounted: false
      };
      this.setStateFromProps(props);
      this.athlete = GetStore().athlete;
      this.storeState = GetStore().state;
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
      var lastSession = _.last(this.athlete.sessions);

      return (
        <div>
          <Spin
            page
            style={{ width: 'calc(55vw)', margin: '5px' }}
            spinning={this.storeState.athleteLoading}
            size="large"
          >
            <Segment
              inverted
              style={{ width: 'calc(60vw)', marginLeft: '5px' }}
            >
              <Statistic.Group inverted widths="three" size="tiny" color="red">
                <Statistic>
                  <Statistic.Label>Last Session</Statistic.Label>
                  <Statistic.Value>
                    {lastSession === undefined
                      ? this.storeState.athleteLoading
                        ? 'loading...'
                        : 'no data'
                      : lastSession.date}
                  </Statistic.Value>
                </Statistic>
                <Statistic>
                  <Statistic.Label>Last Exercise</Statistic.Label>
                  <Statistic.Value>
                    {lastSession === undefined
                      ? this.storeState.athleteLoading
                        ? 'loading...'
                        : 'no data'
                      : lastSession.exercise}
                  </Statistic.Value>
                  <div style={{ textAlign: 'center' }}>
                    <Button
                      style={{
                        marginTop: 16,
                        width: '140px',
                        textAlign: 'center'
                      }}
                      type="primary"
                      onClick={() => {
                        this.storeState.menuParent = 'exercises';
                        this.storeState.menuChild = `exercise:${lastSession.exercise}`;
                        this.storeState.menuSelectedKeys = [
                          `exercise:${lastSession.exercise}`
                        ];
                        this.storeState.menuSelected = true;
                        // render = true
                      }}
                    >
                      View
                    </Button>
                  </div>
                </Statistic>
                <Statistic>
                  <Statistic.Label>Sessions</Statistic.Label>
                  <Statistic.Value>
                    {lastSession === undefined
                      ? this.storeState.athleteLoading
                        ? 'loading...'
                        : 'no data'
                      : this.athlete.sessions.length}
                  </Statistic.Value>
                </Statistic>
              </Statistic.Group>
            </Segment>
          </Spin>
        </div>
      );
    }
  }
);

export default AthleteOverview;
