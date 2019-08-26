import React, { Component } from 'react';
import PersonalBestPie from './PersonalBestPie';
import { Select } from 'antd';

const { Option } = Select;

export default class PersonalBests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      exercise: props.exercise,
      seasonBest: props.seasonBest,
      range: props.range,
      availableWeights: [],
      selectedWeights: props.selectedWeights,
      loading: true
    };
    this.statsProvider = props.statsProvider;
  }

  componentDidMount = () => {
    this.getPBValues();
  };

  componentWillReceiveProps(nextProps) {
    this.setStateFromProps(nextProps);
  }

  setStateFromProps = props => {
    this.setState(
      {
        exercise: props.exercise,
        seasonBest: props.seasonBest,
        range: props.range,
        availableWeights: [],
        selectedWeights: [],
        loading: true,
        showWeights: props.showWeights
      },
      () => {
        this.getPBValues();
      }
    );
  };

  getPBValues = () => {
    const { exercise, range, availableWeights, selectedWeights } = this.state;

    var filter = {
      fullDate: {
        filter: true,
        values: [range.from, range.to],
        compare: 'between'
      },
      exercise: {
        filter: true,
        values: [exercise],
        compare: '='
      }
    };
    var weightList = availableWeights;
    if (selectedWeights.length > 0) {
      var weights = selectedWeights.map(w => Number(w));
      filter['weight'] = {
        filter: true,
        values: weights,
        compare: 'in'
      };
    }
    var periodBest = this.statsProvider.personalBestsForPeriod(filter);
    var sessions = this.statsProvider.filterSessionsBy(filter);

    if (availableWeights.length === 0) {
      weightList = [...new Set(sessions.map(x => x.weight))];
    }

    filter.fullDate.values = [new Date(2019, 1, 1), new Date(2019, 12, 1)];
    var seasonBest = this.statsProvider.personalBestsForPeriod(filter);

    var season = seasonBest.filter(best => {
      return best.exercise === exercise;
    });
    var period = periodBest.filter(best => {
      return best.exercise === exercise;
    });

    if (season.length <= 0 || period.length <= 0) {
      return <h1>asdfasdf</h1>;
    }

    const force = [
      {
        name: ((period[0].value / season[0].value) * 100).toFixed(0) + '%',
        value: period[0].value
      },
      { name: 'Season', value: season[0].value - period[0].value }
    ];
    const fmax = [
      {
        name: ((period[1].value / season[1].value) * 100).toFixed(0) + '%',
        value: period[1].value
      },
      { name: 'Season', value: season[1].value - period[1].value }
    ];
    const power = [
      {
        name: ((period[2].value / season[2].value) * 100).toFixed(0) + '%',
        value: period[2].value
      },
      { name: 'Season', value: season[2].value - period[2].value }
    ];

    this.setState(
      {
        power: power,
        fmax: fmax,
        force: force,
        periodBest: periodBest,
        seasonBest: seasonBest,
        availableWeights: weightList,
        loading: false
      },
      () => {}
    );
  };
  handleWeightChange = values => {
    this.setState(
      {
        selectedWeights: [values]
      },
      () => {
        this.getPBValues();
      }
    );
  };

  render() {
    const {
      force,
      fmax,
      power,
      loading,
      availableWeights,
      showWeights
    } = this.state;

    return (
      <div className="personal-best-container">
        {showWeights && availableWeights.length > 1 && (
          <div className="personal-best-weight">
            <Select
              mode="default"
              size="default"
              className="exercise-list"
              placeholder="select weight"
              onChange={this.handleWeightChange}
            >
              {availableWeights.map(e => (
                <Option className="exercise-list-item" label={e} key={e}>
                  {e}
                </Option>
              ))}
            </Select>
          </div>
        )}

        {!loading && force !== undefined && (
          <div className="personal-best-list">
            <PersonalBestPie data={force} title={'Force'} color="#2980B9" />
            <PersonalBestPie data={fmax} title={'FMax'} color="#2980B9" />
            <PersonalBestPie data={power} title={'Power'} color="#2980B9" />
          </div>
        )}
      </div>
    );
  }
}
