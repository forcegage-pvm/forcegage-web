import React, { Component } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import styles from './style.css';
import { Badge } from 'antd';
import Helmet from 'react-helmet';

export default class MonthCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from: null,
      to: null,
      exerciseDays: [],
      rangeChangeCallback: props.onRangeChange
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      exerciseDays: nextProps.exerciseDays
    });
  }

  handleDayChange = (date, { selected }) => {
    const { rangeChangeCallback } = this.state;
    const range = DateUtils.addDayToRange(date, this.state);
    this.setState(range);
    rangeChangeCallback(range);
  };

  renderDay = (day, modifiers) => {
    const date = day.getDate();
    const { exerciseDays } = this.state;
    var daye = new Date(day).toISOString().slice(0, 10);
    var dayData = exerciseDays.find(exercise => {
      return exercise.date === daye;
    });
    if (dayData !== undefined) {
      var distinctExercisesForDay = [...new Set(dayData.exercises.map(x => x))];
    }
    return (
      <div style={cellStyle}>
        <div style={contentStyle}>{date}</div>
        {distinctExercisesForDay && distinctExercisesForDay.length > 0 && (
          <div style={infoStyle}>
            <Badge style={badgeStyle} dot color="red" />
          </div>
        )}
      </div>
    );
  };

  handleWeekClick = (weekNumber, days, e) => {
    const { rangeChangeCallback } = this.state;
    this.setState({
      from: days[0],
      to: days[days.length - 1]
    });
    rangeChangeCallback({ from: days[0], to: days[days.length - 1] });
  };

  render() {
    const { from, to } = this.state;
    const modifiers = { start: from, end: to };

    return (
      <div className="main">
        <div className="main-calendar">
          <div>
            <DayPicker
              className="Selectable"
              selectedDays={[from, { from, to }]}
              showWeekNumbers
              showOutsideDays
              modifiers={modifiers}
              onDayClick={this.handleDayChange}
              onDayMouseEnter={this.handleDayEnter}
              onDayMouseLeave={this.handleDayLeave}
              onWeekClick={this.handleWeekClick}
              renderDay={this.renderDay}
            />
            <Helmet>
              <style>{`
                                .Selectable .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
                                    background-color: #f0f8ff !important;
                                    color: #4a90e2;
                                }
                                .Selectable .DayPicker-Day {
                                    border-radius: 0 !important;
                                }
                                .Selectable .DayPicker-Day--start {
                                    border-top-left-radius: 10% !important;
                                    border-bottom-left-radius: 10% !important;
                                    background-color: #D4E9F5 !important;
                                    color: #AD7244 !important;
                                }
                                .Selectable .DayPicker-Day--end {
                                    border-top-right-radius: 10% !important;
                                    border-bottom-right-radius: 10% !important;
                                    background-color: #D4E9F5 !important;
                                    color: #AD7244 !important;
                                }
                            `}</style>
            </Helmet>
          </div>
        </div>
      </div>
    );
  }
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
  width: '1px',
  textAlign: 'left',
  marginTop: '3px',
  marginLeft: '0px',
  alignItems: 'center'
};
