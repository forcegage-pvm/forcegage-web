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
import DayBrowser from './dayBrowser';

const { TabPane } = Tabs;

const AthleteContent = observer(
  class AthleteContent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        mounted: false,
        currentExercise: undefined,
        days: []
      };
      this.athlete = GetStore().athlete;
      this.storeState = GetStore().state;
    }

    setStateFromProps = props => {
      this.setState(
        {
          currentExercise: undefined
        },
        () => {}
      );
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
      return new Date(date).getDate() + ' ' + monthName;
    };

    componentWillUpdate() {
      return true;
    }

    render() {
      const { selectedDay } = this.storeState;

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

        if (selectedDay !== 'overall') {
          exercise = exDays.find(e => e.date == selectedDay).exercise;
        }

        render = this.storeState.menuSelected;
        var days = exDays.map((e, index) => ({
          type: 'date',
          key: e.date,
          day: this.formatDate(e.date),
          year: Number(new Date(e.date).getFullYear()),
          text: ''
        }));
        days.unshift({
          type: 'text',
          text: 'Overall',
          key: 'overall'
        });
      }

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
            <div
              style={{ alignContent: 'start', margin: '0px', padding: '0px' }}
            >
              <DayBrowser
                exercise={exercise.exercise}
                days={days}
                onChange={e => {
                  this.storeState.selectedDay = e;
                }}
              ></DayBrowser>
              <ExerciseData isTest={false} exercise={exercise}></ExerciseData>
            </div>
          )}
        </div>
      );
    }
  }
);

export default AthleteContent;
