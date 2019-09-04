import React, { Component } from 'react';
import AthleteTransformer from '../../transformers/data/athleteTransformer';
import Expander from '../../transformers/data/DataExpander';
import StatsProvider from '../..//providers/data/StatsProvider';
import { Select } from 'antd';
import PersonalBests from './PersonalBest';
import { Tab } from 'semantic-ui-react';
import MonthCalendar from './MonthCalendar';
import PeriodView from './PeriodView';
import { DataProvider } from '../../providers/data/dataProvider';

const { Option } = Select;

export default class MonthCalendarContainer extends Component {
  constructor(props) {
    super(props);
    this.transformer = new AthleteTransformer();
    this.state = {
      range: {
        from: new Date(2019, 1, 1),
        to: new Date(2019, 12, 1)
      },
      exerciseDays: [],
      availableExercises: [],
      selectedExercises: [],
      periodExercises: [],
      loading: true,
      selectedExerciseIndex: 0,
      rangeSelected: false
    };
    // this.athlete = new Athlete('Magda', 'Niewoudt', 63, 1);
  }

  componentDidMount = async () => {
    var provider = new DataProvider();
    this.athlete = await provider.loadAthlete('Glwok6yOD5CgxJJ8x3aq');
    await this.athlete.loadSessionData();

    // await this.athlete.loadSessionData();
    this.athlete.getPeriodData(new Date(2018, 5, 1), new Date(2019, 9, 31));

    var exercises = this.athlete.exercises.map(e => e.exercise);
    var exerciseDays = this.athlete.exerciseDays.map(e => ({
      date: e.date,
      exercises: [...new Set(e.exercises.map(x => x.exercise))]
    }));
    this.setState({
      availableExercises: exercises,
      exerciseDays: exerciseDays,
      loading: false
    });
  };

  getStats = () => {
    const { selectedExercises } = this.state;

    const filter = {
      fullDate: {
        filter: true,
        values: [new Date(2019, 1, 1), new Date(2019, 12, 1)],
        compare: 'between'
      },
      exercise: {
        filter: false,
        values: [],
        compare: 'in'
      }
    };

    if (selectedExercises.length > 0) {
      filter.exercise.values = selectedExercises;
      filter.exercise.filter = true;
    }

    var stats = this.statsProvider.filterSessionsBy(filter);

    const distinctDates = [
      ...new Set(
        stats.map(x => new Date(new Date(x.date).toISOString().slice(0, 10)))
      )
    ];

    var exerciseDays = [];
    for (var day in distinctDates) {
      var date = new Date(distinctDates[day]).toISOString().slice(0, 10);
      var sessions = stats.filter(session => {
        return session.date === date;
      });
      exerciseDays.push({
        date: date,
        exercises: [...new Set(sessions.map(x => x.exercise))]
      });
    }
    this.setState({
      exerciseDays: exerciseDays
    });
  };

  handleExerciseChange = values => {
    this.setState(
      {
        selectedExercises: values
      },
      () => {
        this.getStats();
        this.getPeriodStats();
      }
    );
  };

  getPeriodStats = () => {
    const { selectedExercises, range } = this.state;
    const filter = {
      fullDate: {
        filter: true,
        values: [range.from, range.to],
        compare: 'between'
      },
      exercise: {
        filter: false,
        values: [],
        compare: 'in'
      }
    };
    if (selectedExercises.length > 0) {
      filter.exercise.values = selectedExercises;
      filter.exercise.filter = true;
    }
    var rangeData = this.athlete.getRange(
      range.from.toISOString().slice(0, 10),
      range.to.toISOString().slice(0, 10)
    );
    var exList = rangeData.map(x => x.exercises);
    this.setState({
      periodExercises: [...new Set(exList.map(x => x.exercise))],
      selectedExerciseIndex: 0,
      rangeSelected: true
    });
  };

  onRangeChange = range => {
    this.setState(
      {
        range: range
      },
      () => {
        this.getPeriodStats();
      }
    );
  };

  onExerciseChange = (event, data) => {
    this.setState({
      selectedExerciseIndex: data.activeIndex
    });
  };

  getDaysForSelectedPeriod = () => {
    const { range, rangeSelected, selectedExercises } = this.state;
    if (rangeSelected === false) return [];
    var filter = {
      fullDate: {
        filter: true,
        values: [range.from, range.to],
        compare: 'between'
      },
      date: {
        group: true
      }
    };
    if (range.from === range.to) {
      filter = {
        date: {
          filter: true,
          values: [range.from.toISOString().slice(0, 10)],
          compare: '=',
          group: true
        }
      };
    }
    if (selectedExercises.length > 0) {
      filter.exercise.values = selectedExercises;
      filter.exercise.filter = true;
    }
    var days = this.athlete.getRange(
      range.from.toISOString().slice(0, 10),
      range.to.toISOString().slice(0, 10)
    );
    return days;
  };

  render() {
    const {
      exerciseDays,
      loading,
      availableExercises,
      periodExercises,
      rangeSelected,
      range
    } = this.state;

    const panes = [];

    periodExercises.forEach(e => {
      var item = {
        menuItem: {
          content: e,
          color: 'red',
          style: { fontSize: '0.9em', fontWeight: '500' }
        },
        render: () => (
          <Tab.Pane
            attached={false}
            style={{ backgroundColor: 'white' }}
            grid={{ paneWidth: 12, tabWidth: 4 }}
          >
            <PersonalBests
              seasonBest={this.seasonBest}
              statsProvider={this.statsProvider}
              range={range}
              showWeights={true}
              selectedWeights={[]}
              exercise={e}
            ></PersonalBests>
          </Tab.Pane>
        )
      };
      panes.push(item);
    });

    const days = this.getDaysForSelectedPeriod();

    return (
      <div className="main">
        <div className="main-calendar">
          <div className="main-calendar-exercises">
            <Select
              mode="multiple"
              size="default"
              loading={loading}
              allowClear={true}
              optionLabelProp="label"
              className="exercise-list"
              placeholder="Select exercises"
              onChange={this.handleExerciseChange}
            >
              {availableExercises.map(e => (
                <Option className="exercise-list-item" label={e} key={e}>
                  {e}
                </Option>
              ))}
            </Select>
          </div>
          <div className="main-calendar-selector">
            <MonthCalendar
              exerciseDays={exerciseDays}
              onRangeChange={this.onRangeChange}
            ></MonthCalendar>
          </div>
        </div>
        <div className="main-body">
          {rangeSelected === true > 0 && (
            <PeriodView days={days} athlete={this.athlete}></PeriodView>
          )}
        </div>
      </div>
    );
  }
}
