import React, { Component } from 'react';
import '../athletePage.css';
import { Spin, Result, Button, Statistic, Row, Col, Tabs } from 'antd';
import { observer } from 'mobx-react';
import { GetStore } from '../../../models/store/store';
import ExerciseForDay from './exerciseForDay';
import _ from 'lodash';

const { TabPane } = Tabs;

const AthleteContent = observer(
  class AthleteContent extends Component {
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

    formatDate = date => {
      let monthNumber = new Date(date).getMonth() + 1;
      let monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
      ];
      let monthName = monthNames[monthNumber];
      return (
        <div className="content-date-tab">
          <div className="content-date-year">
            {Number(new Date(date).getFullYear())}
          </div>
          <div className="content-date-month">{monthName}</div>
          <div className="content-date-day">{new Date(date).getDate()}</div>
        </div>
      );
    };

    render() {
      console.log('render');
      var render = false;
      if (
        !this.storeState.athleteLoading &&
        this.storeState.menuParent === 'exercises'
      ) {
        var exDays = [];
        var paths = this.storeState.menuChild.split(':');
        var exercise = this.athlete.period.summary.exercises.find(
          e => e.exercise === paths[1]
        );
        this.athlete.period.exerciseDays.forEach(ed => {
          ed.summary.exercises.forEach(ede => {
            if (ede.exercise === exercise.exercise) {
              exDays.push({
                date: ed.date,
                exercise: ede
              });
            }
          });
        });
        render = this.storeState.menuSelected;
      }
      var lastSession = _.last(this.athlete.sessions);

      return (
        <div>
          {this.storeState.menuParent === 'overview' && (
            <div>
              <Spin
                spinning={this.storeState.athleteLoading}
                size="large"
                tip="Loading athlete..."
              >
                <Row style={{ width: 'calc(25vw)', margin: '5px' }} gutter={16}>
                  <Col span={12}>
                    <Statistic
                      title="Last Session"
                      value={
                        lastSession === undefined
                          ? 'loading...'
                          : lastSession.date
                      }
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Last exercise"
                      value={
                        lastSession === undefined
                          ? 'loading...'
                          : lastSession.exercise
                      }
                    />
                    <Button
                      style={{ marginTop: 16 }}
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
                  </Col>
                </Row>
              </Spin>
            </div>
          )}
          {render && (
            <Tabs defaultActiveKey="-1" tabPosition="top" size="small">
              <TabPane tab="Overall" key={-1}>
                <div>
                  <ExerciseForDay exercise={exercise}></ExerciseForDay>
                </div>
              </TabPane>
              {exDays.map((e, index) => (
                <TabPane tab={this.formatDate(e.date)} key={index}>
                  <div>
                    <ExerciseForDay
                      day={e.date}
                      exercise={e.exercise}
                    ></ExerciseForDay>
                  </div>
                </TabPane>
              ))}
            </Tabs>
          )}
        </div>
      );
    }
  }
);

export default AthleteContent;
