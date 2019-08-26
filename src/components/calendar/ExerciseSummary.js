import React, { Component } from 'react';
import DayPbRadial from '../charts/DayPbRadial';
import DayPbBar from '../charts/DayPbBar';
import { Statistic } from 'antd';
import { Icon } from 'semantic-ui-react';

export default class ExerciseSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      aggregation: props.aggregation,
      seasonBest: props.seasonBest,
      data: props.data,
      day: props.day
    };
    this.athlete = props.athlete;
    this.setStateFromProps(props);
  }

  setStateFromProps = props => {
    this.setState(
      {
        data: props.data,
        exercise: props.exercise,
        seasonBest: props.seasonBest,
        aggregation: props.aggregation,
        day: props.day
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

  getBest = () => {
    const { data } = this.state;
    var sessionId = data.personalBest.sessionId;

    var forceSets = data.stats.filter(
      stat =>
        stat.sessionId === sessionId &&
        stat.type === 'force' &&
        stat.aggregation === 'avg' &&
        stat.class === 'Total'
    );
    var maxSet = forceSets.map(stat => stat.value);
    var force = maxSet.Max();

    forceSets = data.stats.filter(
      stat =>
        stat.sessionId === sessionId &&
        stat.type === 'fmax' &&
        stat.aggregation === 'avg' &&
        stat.class === 'Total'
    );
    maxSet = forceSets.map(stat => stat.value);
    var fmax = maxSet.Max();

    forceSets = data.stats.filter(
      stat =>
        stat.sessionId === sessionId &&
        stat.type === 'power' &&
        stat.aggregation === 'avg' &&
        stat.class === 'Total'
    );
    maxSet = forceSets.map(stat => stat.value);
    var power = maxSet.Max();

    var sessionCount = data.sessions.length;
    var setCount = data.sets.length;
    var repCount = data.reps.length;
    return {
      sessionCount: sessionCount,
      setCount: setCount,
      repCount: repCount,
      fmax: fmax,
      force: force,
      power: power,
      date: data.personalBest.date
    };
  };

  getAggregation = () => {
    const { data, aggregation, day, exercise } = this.state;

    var sessionCount = data.sessions.length;
    var setCount = data.sets.length;
    var repCount = data.reps.length;
    var personalBest = this.athlete.getPersonalBest(day, exercise, aggregation);
    return {
      sessionCount: sessionCount,
      setCount: setCount,
      repCount: repCount,
      fmax: personalBest.fmax,
      force: personalBest.force,
      power: personalBest.power,
      date: personalBest.date
    };
  };

  render() {
    const { exercise, aggregation, seasonBest } = this.state;

    if (aggregation === 'best') {
      var agData = this.getBest();
    } else {
      var agData = this.getAggregation();
    }
    var seasonBestFmax = seasonBest.fmax;
    var seasonBestForce = seasonBest.force;
    var seasonBestPower = seasonBest.power;

    var seasonBestFmaxDate = seasonBest.date.fmax;
    var seasonBestForceDate = seasonBest.date.force;
    var seasonBestPowerDate = seasonBest.date.power;

    return (
      <div className="exercise-summary-container">
        <div className="exercise-summary-title">{exercise}</div>
        <Icon className="exercise-summary-icon" name="child" size="big" />
        <Statistic
          className="exercise-summary-sessions"
          title="Sessions"
          value={agData.sessionCount}
        />
        <Statistic
          className="exercise-summary-sets"
          title="Sets"
          value={agData.setCount}
        />
        <Statistic
          className="exercise-summary-reps"
          title="Reps"
          value={agData.repCount}
        />
        <Statistic
          className="exercise-summary-force"
          title="Force"
          value={agData.force}
          suffix="kgf"
          valueStyle={valueStyle}
        />
        <Statistic
          className="exercise-summary-power"
          title="Power"
          value={agData.power}
          suffix="W"
        />
        <Statistic
          className="exercise-summary-fmax"
          title="FMax"
          value={agData.fmax}
          suffix="kgf"
        />
        <DayPbBar
          day={agData.fmax}
          season={seasonBestFmax}
          seasoBestDate={seasonBestFmaxDate}
          className="exercise-summary-chart-fmax"
        ></DayPbBar>
        <DayPbBar
          day={agData.force}
          season={seasonBestForce}
          seasoBestDate={seasonBestForceDate}
          className="exercise-summary-chart-force"
        ></DayPbBar>
        <DayPbBar
          day={agData.power}
          season={seasonBestPower}
          seasoBestDate={seasonBestPowerDate}
          className="exercise-summary-chart-power"
        ></DayPbBar>
      </div>
    );
  }
}

const valueStyle = {
  color: '#CB4335',
  // fontSize: "1.5em",
  fontWeight: '500'
};
