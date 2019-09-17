import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import { observer } from 'mobx-react';
import { GetStore } from '../../../models/store/store';
import { Timeline, Icon as IconAnt } from 'antd';
import { Header, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import ExerciseData from './exerciseForDay';

const AthleteTests = observer(
  class AthleteTests extends Component {
    constructor(props) {
      super(props);
      this.state = {
        mounted: false,
        currentTest: ''
      };
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

    onClick = (e, value) => {
      e.preventDefault();
    };

    selectTest = e => {
      console.log(e);
      this.setState({
        currentTest: e
      });
    };

    render() {
      const { currentTest } = this.state;
      var test = this.athlete.tests.find(t => t.test === currentTest);
      return (
        <div>
          {currentTest !== '' && (
            <div>
              <ExerciseData isTest={true} test={test}></ExerciseData>
            </div>
          )}
          {currentTest === '' && (
            <div>
              <Header as="h3">
                <Icon name="child" color="green" />
                <Header.Content>Tests</Header.Content>
              </Header>
              <Timeline mode="alternate" style={{ width: '450px' }}>
                {this.athlete.tests.map(test => {
                  if (test.complete === false) {
                    return (
                      <Timeline.Item
                        onClick={() => this.selectTest(test.test)}
                        position="right"
                      >
                        <a href="" onClick={this.onClick}>
                          <span>
                            <span style={{ fontWeight: '600' }}>
                              {test.test}
                            </span>
                            <span style={{ fontWeight: '200' }}>
                              {' ' + test.class + ' (' + test.group + ')'}
                            </span>
                          </span>
                        </a>
                      </Timeline.Item>
                    );
                  } else {
                    return (
                      <Timeline.Item
                        onClick={() => this.selectTest(test.test)}
                        dot={<Icon name="heart" style={{ fontSize: '16px' }} />}
                        color="red"
                      >
                        <a href="" onClick={this.onClick}>
                          <span>
                            <span style={{ fontWeight: '600' }}>
                              {test.test}
                            </span>
                            <span style={{ fontWeight: '200' }}>
                              {' ' + test.class + ' (' + test.group + ')'}
                            </span>
                          </span>
                        </a>
                      </Timeline.Item>
                    );
                  }
                })}
              </Timeline>
            </div>
          )}
        </div>
      );
    }
  }
);

export default AthleteTests;
