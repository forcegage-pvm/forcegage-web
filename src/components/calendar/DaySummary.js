import React, { Component } from 'react';
import ExerciseSummary from './ExerciseSummary';
import { Radio } from 'antd';

export default class DaySummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      aggregation: 'best'
    };
    this.athlete = props.athlete;
    this.setStateFromProps(props);
  }

  setStateFromProps = props => {
    const { mounted } = this.state;

    if (mounted) {
      this.setState(
        {
          day: props.day,
          aggregation: 'best'
        },
        () => {}
      );
    } else {
      this.state = {
        day: props.day,
        aggregation: 'best'
      };
    }
  };

  componentWillReceiveProps = props => {
    this.setStateFromProps(props);
  };

  componentDidMount = () => {
    this.setState({
      mounted: true
    });
  };

  getSeasonBest = exercise => {
    var pb = this.athlete.exercises.find(e => e.exercise === exercise)
      .personalBest;
    return pb;
  };

  aggregationChange = e => {
    this.setState(
      {
        aggregation: e.target.value
      },
      () => {}
    );
  };

  render() {
    const { day, aggregation } = this.state;

    const exercises = this.athlete.getDay(day).exercises;

    return (
      <div>
        <Radio.Group
          style={{ marginTop: '0px', marginBottom: '10px' }}
          buttonStyle="solid"
          value={aggregation}
          onChange={this.aggregationChange}
        >
          <Radio.Button value="best">Best</Radio.Button>
          <Radio.Button value="avg">Average</Radio.Button>
          <Radio.Button value="max">Max</Radio.Button>
          <Radio.Button value="tm">Olympic</Radio.Button>
        </Radio.Group>

        <div className="day-summary-container">
          {exercises.map((ex, index) => (
            <ExerciseSummary
              key={index}
              exercise={ex.exercise}
              data={ex}
              day={day}
              athlete={this.athlete}
              seasonBest={this.getSeasonBest(ex.exercise)}
              aggregation={aggregation}
            ></ExerciseSummary>
          ))}
        </div>
      </div>
    );
  }
}
