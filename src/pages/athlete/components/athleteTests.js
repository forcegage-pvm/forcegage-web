import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import { observer } from 'mobx-react';
import { GetStore } from '../../../models/store/store';
import { Timeline, Icon as IconAnt } from 'antd';
import { Header, Icon } from 'semantic-ui-react';
import _ from 'lodash';
import ExerciseData from './exerciseForDay';
import AthleteTestList from './athleteTestList';
import { ReactComponent as Exercise } from '../../../assets/dumbbell.svg';

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
      this.setState({
        currentTest: e
      });
    };

    render() {
      const { currentTest } = this.state;
      var test = this.athlete.tests.find(t => t.test === currentTest);
      return (
        <div>
          <div className="header-exercise">
            <div className="header-test-content">
              <div className="header-test-image-content">
                <Exercise className="header-test-image-content"></Exercise>
              </div>
              <div className="header-exercise-test">
                <div className="header-exercise-test-description">
                  {test === undefined
                    ? 'Tests'
                    : test.class + ' (' + test.group + ')'}
                </div>
                <div className="header-exercise-test-date">
                  {test === undefined ? 'Complete/Neuro-muscular' : test.test}
                </div>
              </div>
              {currentTest !== '' && (
                <div className="header-exercise-test-back">
                  <Icon
                    name="chevron left"
                    size="big"
                    onClick={() => {
                      this.setState({ currentTest: '' });
                    }}
                  ></Icon>
                </div>
              )}
            </div>
            <div className="header-exercise-day"></div>
          </div>
          {currentTest !== '' && (
            <div>
              <ExerciseData isTest={true} test={test}></ExerciseData>
            </div>
          )}
          {currentTest === '' && (
            <div>
              <AthleteTestList onSelectTest={this.selectTest}></AthleteTestList>
              {/* <Timeline mode="alternate" style={{ width: '450px' }}>
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
              </Timeline> */}
            </div>
          )}
        </div>

        // <div>
        //   {currentTest !== '' && (
        //     <div>
        //       <ExerciseData isTest={true} test={test}></ExerciseData>
        //     </div>
        //   )}
        //   {currentTest === '' && (
        //     <div>
        //       <Header as="h3">
        //         <Icon name="child" color="green" />
        //         <Header.Content>Tests</Header.Content>
        //       </Header>
        //       <Timeline mode="alternate" style={{ width: '450px' }}>
        //         {this.athlete.tests.map(test => {
        //           if (test.complete === false) {
        //             return (
        //               <Timeline.Item
        //                 onClick={() => this.selectTest(test.test)}
        //                 position="right"
        //               >
        //                 <a href="" onClick={this.onClick}>
        //                   <span>
        //                     <span style={{ fontWeight: '600' }}>
        //                       {test.test}
        //                     </span>
        //                     <span style={{ fontWeight: '200' }}>
        //                       {' ' + test.class + ' (' + test.group + ')'}
        //                     </span>
        //                   </span>
        //                 </a>
        //               </Timeline.Item>
        //             );
        //           } else {
        //             return (
        //               <Timeline.Item
        //                 onClick={() => this.selectTest(test.test)}
        //                 dot={<Icon name="heart" style={{ fontSize: '16px' }} />}
        //                 color="red"
        //               >
        //                 <a href="" onClick={this.onClick}>
        //                   <span>
        //                     <span style={{ fontWeight: '600' }}>
        //                       {test.test}
        //                     </span>
        //                     <span style={{ fontWeight: '200' }}>
        //                       {' ' + test.class + ' (' + test.group + ')'}
        //                     </span>
        //                   </span>
        //                 </a>
        //               </Timeline.Item>
        //             );
        //           }
        //         })}
        //       </Timeline>
        //     </div>
        //   )}
        // </div>
      );
    }
  }
);

export default AthleteTests;
