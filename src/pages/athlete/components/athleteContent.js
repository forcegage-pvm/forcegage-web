import React, { Component } from 'react';
import '../athletePage.css';
import { Spin, Alert, Button, Row, Col, Tabs } from 'antd';
import { observer } from 'mobx-react';
import { GetStore } from '../../../models/store/store';
import ExerciseData from './exerciseForDay';
import { Header, Icon, Statistic } from 'semantic-ui-react';
import AthleteOverview from './athleteOverview';
import AthleteTests from './athleteTests';
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
        new Date(date).getDate() +
        ' ' +
        monthName +
        " '" +
        Number(new Date(date).getFullYear() - 2000)
      );
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
      console.log('this.storeState.menuChild', this.storeState.menuChild);
      var complete = this.storeState.menuChild == 'complete';
      console.log('complete', complete);

      return (
        <div>
          {this.storeState.menuParent === 'overview' && (
            <AthleteOverview></AthleteOverview>
          )}
          {this.storeState.menuParent === 'tests' && (
            <div>
              <AthleteTests></AthleteTests>
            </div>
          )}
          {render && (
            <div>
              <Header as="h3">
                <Icon name="heart outline" color="red" />
                <Header.Content>{exercise.exercise}</Header.Content>
              </Header>
              <Tabs
                defaultActiveKey="-1"
                tabPosition="top"
                size="small"
                style={{ marginTop: '-5px' }}
              >
                <TabPane tab="Overall" key={-1}>
                  <div>
                    <ExerciseData exercise={exercise}></ExerciseData>
                  </div>
                </TabPane>
                {exDays.map((e, index) => (
                  <TabPane tab={this.formatDate(e.date)} key={index}>
                    <div>
                      <ExerciseData
                        day={e.date}
                        exercise={e.exercise}
                      ></ExerciseData>
                    </div>
                  </TabPane>
                ))}
              </Tabs>
            </div>
          )}
        </div>
      );
    }
  }
);

export default AthleteContent;
