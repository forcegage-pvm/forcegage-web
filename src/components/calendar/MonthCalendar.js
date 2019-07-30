import React, { Component } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import moment from 'moment';
import styles from './style.css';
import { Radio } from 'antd'; //for athlete data
import Array from '../../extensions/Array';
import AthleteTransformer from '../../transformers/data/athleteTransformer';
import expander from '../../transformers/data/DataExpander';
import StatsProvider from '../..//providers/data/StatsProvider';
import { Badge } from 'antd';
import PersonalBests from './PersonalBest';
import DayView from './DayView';

function getWeekDays(weekStart) {
  const days = [weekStart];
  for (let i = 1; i < 7; i += 1) {
    days.push(
      moment(weekStart)
        .add(i, 'days')
        .toDate()
    );
  }
  return days;
}

function getWeekRange(date) {
  return {
    from: moment(date)
      .startOf('week')
      .toDate(),
    to: moment(date)
      .endOf('week')
      .toDate()
  };
}

export default class MonthCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selecting: 'week',
      modifiers: {
        highlighted: undefined
      },
      hoverRange: undefined,
      selectedDays: [],
      from: null,
      to: null,
      enteredTo: null,
      distinctExerciseDays: [],
      exercises: [],
      periodBest: []
    };
    this.transformer = new AthleteTransformer();
  }

  componentDidMount = async () => {
    var data = this.transformer.getData(1).then(data => {
      var expanded = expander(data);
      this.statsProvider = new StatsProvider(expanded);
      const filter = {
        // weight: 60,
        year: {
          filter: false,
          values: [2019],
          compare: '='
        },
        fullDate: {
          filter: true,
          values: [new Date(2019, 1, 1), new Date(2019, 12, 1)],
          compare: 'between'
        }
      };
      var stats = this.statsProvider.filterSessionsBy(filter);
      this.seasonBest = this.statsProvider.personalBestsForPeriod(filter);
      const distinctDates = [
        ...new Set(
          stats.map(x => new Date(new Date(x.date).toISOString().slice(0, 10)))
        )
      ];
      const distinctExercises = [...new Set(stats.map(x => x.exercise))];
      var exercises = [];
      var randomColor = require('randomcolor'); // import the script
      distinctExercises.forEach(exercise => {
        exercises.push({
          exercise: exercise,
          color: randomColor()
        });
      });
      this.getProperColors(exercises);
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
        distinctExerciseDays: distinctDates,
        exerciseDays: exerciseDays,
        exercises: exercises
      });
    });
  };

  getProperColors(exercises) {
    const colors = ['#D4E6F1', '#FAE5D3', '#D0ECE7', '#D6DBDF', '#D4EFDF'];
    for (var index in exercises) {
      var exercise = exercises[index];
      exercise.color = colors[index];
    }
  }

  isSelectingFirstDay(from, to, day) {
    const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
    const isRangeSelected = from && to;
    return !from || isBeforeFirstDay || isRangeSelected;
  }

  handleDayChange = (date, { selected }) => {
    const { selecting, from, to } = this.state;
    if (selecting === 'days') {
      if (selected) {
        this.setState({
          selectedDays: [],
          hoverRange: undefined,
          periodBest: []
        });
        return;
      }
      const filter = {
        date: {
          filter: true,
          values: [new Date(date).toISOString().slice(0, 10)],
          compare: '='
        }
      };
      console.log('filter', filter);
      var periodPbs = this.statsProvider.personalBestsForPeriod(filter);
      console.log('periodPbs', periodPbs);
      this.setState({
        selectedDays: [date],
        periodBest: periodPbs
      });
    }
    if (selecting === 'range') {
      if (from && to && date >= from && date <= to) {
        this.resetRange();
        return;
      }
      if (this.isSelectingFirstDay(from, to, date)) {
        this.setState({
          from: date,
          to: null,
          enteredTo: null
        });
      } else {
        this.setState({
          to: date,
          enteredTo: date
        });
        const filter = {
          fullDate: {
            filter: true,
            values: [new Date(from), new Date(date)],
            compare: 'between'
          }
        };
        var periodPbs = this.statsProvider.personalBestsForPeriod(filter);
        this.setState({
          periodBest: periodPbs
        });
      }
    }
    if (selecting === 'week') {
      const range = getWeekDays(getWeekRange(date).from);
      const filter = {
        fullDate: {
          filter: true,
          values: [new Date(range[0]), new Date(range[6])],
          compare: 'between'
        }
      };
      var periodPbs = this.statsProvider.personalBestsForPeriod(filter);
      this.setState({
        selectedDays: getWeekDays(getWeekRange(date).from),
        periodBest: periodPbs
      });
    }
  };

  handleDayEnter = date => {
    const { selecting, from, to } = this.state;
    if (selecting === 'week') {
      this.setState({
        hoverRange: getWeekRange(date)
      });
    } else {
      this.setState({
        hoverRange: undefined
      });
    }
    if (selecting === 'week') {
      if (!this.isSelectingFirstDay(from, to, date)) {
        this.setState({
          enteredTo: date
        });
      }
    }
  };

  handleSelectingChange = selecting => {
    var newSelecting = selecting.target.value;
    this.setState({
      selectedDays: []
    });
    this.resetRange();
    this.setState({
      selecting: selecting.target.value
    });
  };

  handleDayLeave = () => {
    this.setState({
      hoverRange: undefined
    });
  };

  handleWeekClick = (weekNumber, days, e) => {
    const filter = {
      fullDate: {
        filter: true,
        values: [new Date(days[0]), new Date(days[6])],
        compare: 'between'
      }
    };
    var periodPbs = this.statsProvider.personalBestsForPeriod(filter);
    this.setState({
      selectedDays: days,
      periodBest: periodPbs
    });
  };

  resetRange = () => {
    this.setState({
      from: null,
      to: null,
      enteredTo: null
    });
  };

  getColorForExercise = e => {
    const { exercises } = this.state;
    var exercise = exercises.find(x => {
      return x.exercise === e;
    });
    return exercise.color;
  };

  renderDay = (day, modifiers) => {
    const date = day.getDate();
    const { exerciseDays } = this.state;
    if (modifiers.exerciseRange) {
      var daye = new Date(day).toISOString().slice(0, 10);
      var dayData = exerciseDays.find(exercise => {
        return exercise.date === daye;
      });
      if (dayData !== undefined) {
        var distinctExercisesForDay = [
          ...new Set(dayData.exercises.map(x => x))
        ];
      }
    }
    return (
      <div style={cellStyle}>
        <div style={contentStyle}>{date}</div>
        {modifiers.exerciseRange && distinctExercisesForDay.length > 0 && (
          <div style={infoStyle}>
            {distinctExercisesForDay.map(e => {
              return (
                <Badge
                  style={badgeStyle}
                  dot
                  color={this.getColorForExercise(e)}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  };

  render() {
    const {
      hoverRange,
      selectedDays,
      selecting,
      from,
      to,
      enteredTo,
      exercises,
      distinctExerciseDays,
      periodBest
    } = this.state;
    var daysSelected = selectedDays;
    const daysAreSelected = selectedDays.length > 0;

    const modifiers = {
      hoverRange,
      selectedRange: daysAreSelected && {
        from: selectedDays[0],
        to: selectedDays[6]
      },
      start: from,
      end: enteredTo,
      hoverRangeStart: hoverRange && hoverRange.from,
      hoverRangeEnd: hoverRange && hoverRange.to,
      selectedRangeStart: daysAreSelected && selectedDays[0],
      selectedRangeEnd: daysAreSelected && selectedDays[6],
      exerciseRange: distinctExerciseDays
    };

    const modifiersStyles = {
      exerciseRange: {
        color: '#587EA5',
        fontWeight: '500'
      }
    };

    const disabledDays = { before: this.state.from };
    if (selecting === 'range') {
      daysSelected = [from, { from, to: enteredTo }];
    }

    return (
      <div className="main">
        <div className="main-calendar">
          <div style={{ textAlign: 'center' }}>
            <Radio.Group
              value={selecting}
              buttonStyle="solid"
              onChange={this.handleSelectingChange}
            >
              <Radio.Button value="week">Week</Radio.Button>
              <Radio.Button value="range">Range</Radio.Button>
              <Radio.Button value="days">Days</Radio.Button>
            </Radio.Group>
          </div>
          <div>
            <DayPicker
              selectedDays={daysSelected}
              showWeekNumbers
              showOutsideDays
              fromMonth={from}
              disabledDays={disabledDays}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              onDayClick={this.handleDayChange}
              onDayMouseEnter={this.handleDayEnter}
              onDayMouseLeave={this.handleDayLeave}
              onWeekClick={this.handleWeekClick}
              renderDay={this.renderDay}
            />
          </div>
          <ExerciseList style={{ padding: '50px' }} exercises={exercises} />
          {this.seasonBest !== undefined && periodBest.length > 0 && (
            <PersonalBests
              seasonBest={this.seasonBest}
              periodBest={periodBest}
              exercises={exercises}
            ></PersonalBests>
          )}
        </div>
        <div className="main-body">
          <DayView></DayView>
        </div>
      </div>
    );
  }
}

function ExerciseList(props) {
  const { exercises } = props;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: '1fr',
        gridTemplateColumns: 'auto',
        gridAutoFlow: 'column dense',
        marginLeft: '40px',
        marginRight: '40px'
      }}
    >
      {exercises.map(e => {
        return <Exercise exercise={e} />;
      })}
    </div>
  );
}

function Exercise(props) {
  const { exercise } = props;
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: '1fr',
        gridTemplateColumns: '10px 100%',
        gridAutoFlow: 'column dense',
        padding: '3px'
      }}
    >
      <Badge
        style={{
          textAlign: 'left',
          verticalAlign: 'middle',
          alignContent: 'middle'
        }}
        dot
        color={exercise.color}
      />
      <div
        style={{
          marginTop: '4px',
          fontSize: '0.8em',
          fontWeight: '500',
          color: '#196FC8',
          textAlign: 'left',
          verticalAlign: 'middle'
        }}
      >
        {exercise.exercise}
      </div>
    </div>
  );
}

const cellStyle = {
  display: 'grid',
  gridTemplateRows: '10px 10px',
  gridTemplateColumns: '20px'
};
const contentStyle = {
  gridRow: '1',
  marginTop: '-10px'
};
const infoStyle = {
  gridRow: '2',
  display: 'grid',
  gridTemplateColumns: 'auto',
  gridTemplateRows: 'auto',
  gridAutoFlow: 'column'
};
const badgeStyle = {
  display: 'flex',
  alignItems: 'left',
  justifyContent: 'left',
  flexDirection: 'column',
  width: '7px',
  textAlign: 'left',
  marginTop: '3px',
  marginLeft: '0px',
  alignItems: 'left'
};
