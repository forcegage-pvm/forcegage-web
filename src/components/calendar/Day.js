import React, { Component } from 'react';
import { Tabs } from 'antd';
import styles from './session.css';
import { Table, Tag, Radio } from 'antd';
import { Icon } from 'semantic-ui-react';
import DaySummary from './DaySummary';
import PeriodSummary from './PeriodSummary';
import { Drawer, Button } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ReferenceLine
} from 'recharts';

const { TabPane } = Tabs;
const { CheckableTag } = Tag;

const bestSessionField = 'power';

export default class Day extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      loading: true,
      setsDrawerVisible: false
    };
    this.athlete = props.athlete;
    this.setStateFromProps(props);
  }

  setStateFromProps = props => {
    const { mounted } = this.state;
    if (mounted) {
      this.setState(
        {
          mounted: true,
          date: props.date,
          sessionData: [],
          setData: [],
          exercisesForDay: [],
          weightsForExercise: [],
          sidesForExercise: [],
          selectedWeight: '',
          selectedSide: '',
          bestSessionId: -1,
          dayStats: [],
          period: props.period
        },
        () => {
          this.getExercisesForDay(props.date);
        }
      );
    } else {
      this.state = {
        mounted: true,
        date: props.date,
        sessionData: [],
        setData: [],
        exercisesForDay: [],
        weightsForExercise: [],
        sidesForExercise: [],
        selectedWeight: '',
        selectedSide: '',
        bestSessionId: -1,
        dayStats: [],
        period: props.period
      };
      this.getExercisesForDay(props.date);
    }
  };

  viewSession = (record, text) => {};

  getSessionColumns = () => {
    var columns = [];
    columns.push({
      title: 'Session',
      dataIndex: 'time',
      key: 'time',
      align: 'center',
      width: '100px',
      render(text, record) {
        return {
          props: {
            style: { lineHeight: '5px', height: '5px' }
          },
          children: <Tag color="#229954">{text}</Tag>
        };
      }
    });
    columns.push({
      title: 'Exercise',
      dataIndex: 'exercise',
      key: 'exercise',
      align: 'center',
      width: '35px',
      render(text, record) {
        return {
          props: {
            style: { lineHeight: '5px', height: '5px' }
          },
          children: <Tag color="red">{text}</Tag>
        };
      }
    });
    columns.push({
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
      align: 'center',
      width: '35px',
      render(text, record) {
        return {
          props: {
            style: { lineHeight: '5px', height: '5px' }
          },
          children: <Tag color="blue">{text}</Tag>
        };
      }
    });
    columns.push({
      title: 'Side',
      dataIndex: 'side',
      key: 'side',
      align: 'center',
      width: '35px'
    });
    columns.push({
      title: 'Set',
      dataIndex: 'set',
      key: 'set',
      align: 'center',
      width: '35px',
      render(text, record) {
        return {
          props: {
            style: { lineHeight: '5px', height: '5px' }
          },
          children: <Tag color="#5499C7">{text}</Tag>
        };
      }
    });
    columns.push({
      title: 'Reps',
      dataIndex: 'reps',
      key: 'reps',
      align: 'center',
      width: '35px',
      render(text, record) {
        return {
          props: {
            style: { lineHeight: '5px', height: '5px' }
          },
          children: <Tag color="#515A5A">{text}</Tag>
        };
      }
    });
    columns.push({
      title: 'Fmax',
      dataIndex: 'fmax',
      key: 'fmax',
      align: 'center',
      width: '35px',
      render: value => this.isMaxValueSession(value, 'fmax')
    });
    columns.push({
      title: 'Force',
      dataIndex: 'force',
      key: 'force',
      align: 'center',
      width: '35px',
      render: value => this.isMaxValueSession(value, 'force')
    });
    columns.push({
      title: 'Power',
      dataIndex: 'power',
      key: 'power',
      align: 'center',
      width: '35px',
      render: value => this.isMaxValueSession(value, 'power')
    });
    columns.push({
      title: 'Rfd',
      dataIndex: 'rfd',
      key: 'rfd',
      align: 'center',
      width: '35px',
      render: value => this.isMaxValueSession(value, 'rfd')
    });
    columns.push({
      title: 'Velocity',
      dataIndex: 'velocity',
      key: 'velocity',
      align: 'center',
      width: '35px',
      render: value => this.isMaxValueSession(value, 'velocity')
    });
    columns.push({
      title: 'Contact time',
      dataIndex: 'contactTime',
      key: 'contactTime',
      align: 'center',
      width: '65px',
      render: value => this.isMaxValueSession(value, 'contactTime')
    });
    columns.push({
      title: 'Power to weight',
      dataIndex: 'powerToWeight',
      key: 'powerToWeight',
      align: 'center',
      width: '65px',
      render: value => this.isMaxValueSession(value, 'powerToWeight')
    });
    columns.push({
      title: 'Best',
      dataIndex: 'rating',
      key: 'rating',
      align: 'center',
      width: '50px',
      render: (rating, record) => {
        const { bestSessionId } = this.state;
        const isBest = bestSessionId == record.sessionId;
        return (
          <div>
            <Icon
              disabled={!isBest}
              size="large"
              color={isBest ? 'red' : 'grey'}
              name={isBest ? 'star' : 'star outline'}
            />
          </div>
        );
      }
    });
    columns.push({
      title: 'Action',
      dataIndex: 'recordIndex',
      key: 'recordIndex',
      align: 'center',
      width: '65px',
      render: (text, record) => (
        <a href="javascript:;" onClick={() => this.viewSession(record, text)}>
          View
        </a>
      )
    });

    return columns;
  };

  isMaxValueSession(value, type) {
    if (value === NaN || value === 'NaN') {
      return <div>-</div>;
    }
    const { sessionData } = this.state;
    var values = [...new Set(sessionData.map(record => Number(record[type])))];
    var max = values.Max();
    var isMax = value == max[0];
    return (
      <div>
        {isMax ? (
          <Tag className="tag-max-value">{Number(value).toFixed(2) + ' '}</Tag>
        ) : (
          <div>
            {Number(value).toFixed(2) + ' '}
            <span style={{ fontSize: '1.7ex', color: '#D5B598' }}></span>
          </div>
        )}
      </div>
    );
  }

  getSetColumns = data => {
    var columns = [];
    columns.push({
      title: 'Session',
      dataIndex: 'time',
      key: 'time',
      align: 'center',
      width: '100px',
      render(text, record) {
        return {
          props: {
            style: { lineHeight: '5px', height: '5px' }
          },
          children: <Tag color="blue">{text}</Tag>
        };
      }
    });
    columns.push({
      title: 'Exercise',
      dataIndex: 'exercise',
      key: 'exercise',
      align: 'center',
      width: '35px',
      render(text, record) {
        return {
          props: {
            style: { lineHeight: '5px', height: '5px' }
          },
          children: <Tag color="red">{text}</Tag>
        };
      }
    });
    columns.push({
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
      align: 'center',
      width: '35px',
      render(text, record) {
        return {
          props: {
            style: { lineHeight: '5px', height: '5px' }
          },
          children: <Tag color="blue">{text}</Tag>
        };
      }
    });
    columns.push({
      title: 'Side',
      dataIndex: 'side',
      key: 'side',
      align: 'center',
      width: '35px'
    });
    columns.push({
      title: 'Set',
      dataIndex: 'set',
      key: 'set',
      align: 'center',
      width: '35px',
      render(text, record) {
        return {
          props: {
            style: { lineHeight: '5px', height: '5px' }
          },
          children: <Tag color="#5499C7">{text}</Tag>
        };
      }
    });
    columns.push({
      title: 'Rep',
      dataIndex: 'reps',
      key: 'reps',
      align: 'center',
      width: '35px',
      render(text, record) {
        return {
          props: {
            style: { lineHeight: '5px', height: '5px' }
          },
          children: <Tag color="#229954">{text}</Tag>
        };
      }
    });
    columns.push({
      title: 'Fmax',
      dataIndex: 'fmax',
      key: 'fmax',
      align: 'center',
      width: '35px',
      render: value => this.isMaxValueSet(value, 'fmax')
    });
    columns.push({
      title: 'Force',
      dataIndex: 'force',
      key: 'force',
      align: 'center',
      width: '35px',
      render: value => this.isMaxValueSet(value, 'force')
    });
    columns.push({
      title: 'Power',
      dataIndex: 'power',
      key: 'power',
      align: 'center',
      width: '35px',
      render: value => this.isMaxValueSet(value, 'power')
    });
    columns.push({
      title: 'Rfd',
      dataIndex: 'rfd',
      key: 'rfd',
      align: 'center',
      width: '35px',
      render: value => this.isMaxValueSet(value, 'rfd')
    });
    columns.push({
      title: 'Velocity',
      dataIndex: 'velocity',
      key: 'velocity',
      align: 'center',
      width: '35px',
      render: value => this.isMaxValueSet(value, 'velocity')
    });
    columns.push({
      title: 'Contact time',
      dataIndex: 'contactTime',
      key: 'contactTime',
      align: 'center',
      width: '65px',
      render: value => this.isMaxValueSet(value, 'contactTime')
    });
    columns.push({
      title: 'Power to weight',
      dataIndex: 'powerToWeight',
      key: 'powerToWeight',
      align: 'center',
      width: '65px',
      render: value => this.isMaxValueSet(value, 'powerToWeight')
    });
    columns.push({
      title: 'Best',
      dataIndex: 'rating',
      key: 'rating',
      align: 'center',
      width: '50px',
      render: (rating, record) => {
        const { bestSessionId } = this.state;
        const isBest = bestSessionId == record.sessionId;
        return (
          <div
            style={{ cursor: 'pointer' }}
            onClick={() => {
              this.setBestSession(record.sessionId);
            }}
          >
            <Icon
              disabled={!isBest}
              size="large"
              color={isBest ? 'red' : 'grey'}
              name={isBest ? 'star' : 'star outline'}
            />
          </div>
        );
      }
    });
    return columns;
  };

  isMaxValueSet(value, type) {
    if (value === NaN || value === 'NaN') {
      return <div>-</div>;
    }
    const { setData } = this.state;
    var values = [...new Set(setData.map(record => Number(record[type])))];
    var max = values.Max();
    var isMax = value == max[0];
    return (
      <div>
        {isMax ? (
          <Tag className="tag-max-value">{Number(value).toFixed(2) + ' '}</Tag>
        ) : (
          <div>
            {Number(value).toFixed(2) + ' '}
            <span style={{ fontSize: '1.7ex', color: '#D5B598' }}></span>
          </div>
        )}
      </div>
    );
  }

  getExercisesForDay = day => {
    const { period } = this.state;
    var exercises = [
      ...new Set(
        period.find(x => x.date === day).exercises.map(x => x.exercise)
      )
    ];
    this.setState(
      {
        exercisesForDay: exercises,
        selectedExercise: String(exercises[0])
      },
      () => {
        const { selectedExercise, period } = this.state;
        this.getWeightsForExercise(day);
      }
    );
  };

  getWeightsForExercise = day => {
    const { selectedExercise } = this.state;
    var exerciseDay = this.athlete.getDay(day);
    var exercises = exerciseDay.exercises.find(
      e => e.exercise === selectedExercise
    );
    var weights = [...new Set(exercises.weights.map(x => x.weight))];
    if (weights.length > 1) {
      weights.unshift('All');
    }
    this.setState(
      {
        weightsForExercise: weights,
        selectedWeight: weights[0]
      },
      () => {
        this.getSidesForExercise(day);
      }
    );
  };

  getSidesForExercise = day => {
    const { selectedExercise, selectedWeight } = this.state;

    const filter = {
      date: {
        filter: true,
        values: [day],
        compare: '='
      },
      exercise: {
        filter: true,
        values: [selectedExercise],
        compare: '=',
        group: true
      },
      weight: {
        filter: true,
        values: [selectedWeight],
        compare: '='
      }
    };
    if (selectedWeight === 'All') {
      filter.weight.filter = false;
    }
    var exerciseDay = this.athlete.getDay(day);
    if (selectedWeight !== 'All') {
      var weightExercises = exerciseDay.exercises
        .find(e => e.exercise === selectedExercise)
        .weights.find(w => w.weight === selectedWeight);
    } else {
      var weightExercises = exerciseDay.exercises.find(
        e => e.exercise === selectedExercise
      );
    }
    var sides = [];
    weightExercises.sides.forEach(side => sides.push(side));
    if (sides.length > 1) {
      sides.unshift('Both');
    }
    this.setState(
      {
        sidesForExercise: sides,
        selectedSide: sides[0]
      },
      () => {
        this.getStatsForSession(day);
        this.getStatsForSet(day);
      }
    );
  };

  getDataForSets = (stats, side, getBestSession) => {
    const data = [];
    var previousBestSessionId = -1;
    var setCount = 1;
    for (var index in stats.sets) {
      var set = stats.sets[index];
      if (side !== 'Both') {
        if (side !== set.side) continue;
      }
      var session = stats.sessions.find(s => s.sessionId === set.sessionId);
      var item = {
        sessionId: session.sessionId,
        exercise: session.exercise,
        date: session.date,
        time: session.time,
        weight: session.weight,
        side: set.side,
        set: setCount,
        timeOfDay: session.timeOfDay,
        reps: stats.reps.filter(rep => {
          return rep.setId === set.setId && rep.sessionId === set.sessionId;
        }).length,
        fmax: this.getStatsValueForSet(
          stats.stats,
          set.setId,
          set.sessionId,
          'fmax'
        ),
        force: this.getStatsValueForSet(
          stats.stats,
          set.setId,
          set.sessionId,
          'force'
        ),
        power: this.getStatsValueForSet(
          stats.stats,
          set.setId,
          set.sessionId,
          'power'
        ),
        rfd: this.getStatsValueForSet(
          stats.stats,
          set.setId,
          set.sessionId,
          'rfd'
        ),
        powerToWeight: this.getStatsValueForSet(
          stats.stats,
          set.setId,
          set.sessionId,
          'power-to-weight'
        ),
        velocity: this.getStatsValueForSet(
          stats.stats,
          set.setId,
          set.sessionId,
          'velocity'
        ),
        contactTime: this.getStatsValueForSet(
          stats.stats,
          set.setId,
          set.sessionId,
          'contact-time'
        )
      };
      if (session.best) {
        previousBestSessionId = session.sessionId;
      }
      data.push(item);
      setCount++;
    }
    var result = {
      data: data,
      bestSessionId: previousBestSessionId
    };
    return result;
  };

  getStatsForSession = day => {
    const { selectedExercise, selectedWeight, selectedSide } = this.state;
    var exerciseDay = this.athlete.getDay(day);
    var exercise = exerciseDay.exercises.find(
      e => e.exercise === selectedExercise
    );
    if (selectedWeight !== 'All') {
      var stats = exercise.weights.find(w => w.weight === selectedWeight);
    } else {
      var stats = exercise;
    }
    var dataStats = this.getDataForSets(stats, selectedSide, true);
    this.setState(
      {
        sessionData: dataStats.data,
        bestSessionId: exercise.personalBest.sessionId,
        loading: false
      },
      () => {}
    );
  };

  getStatsForDay = () => {
    const { exercisesForDay, date } = this.state;
    var data = [];
    var day = this.athlete.getDay(date);
    exercisesForDay.forEach(exercise => {
      var statsExercise = day.exercises.find(e => e.exercise === exercise);
      var dataStats = this.getDataForSets(statsExercise, 'Both');
      data.push({ exercise: exercise, data: dataStats.data });
    });
    return data;
  };

  getStatsForSet = day => {
    const { selectedExercise, selectedWeight, selectedSide } = this.state;

    var exerciseDay = this.athlete.getDay(day);
    if (selectedWeight !== 'All') {
      var stats = exerciseDay.exercises
        .find(e => e.exercise === selectedExercise)
        .weights.find(w => w.weight === selectedWeight);
    } else {
      var stats = exerciseDay.exercises.find(
        e => e.exercise === selectedExercise
      );
    }
    const data = [];
    var setCount = 0;
    for (var index in stats.reps) {
      var rep = stats.reps[index];
      var session = stats.sessions.find(s => s.sessionId === rep.sessionId);
      if (rep.repId === 0) setCount++;
      var item = {
        sessionId: session.sessionId,
        exercise: session.exercise,
        date: session.date,
        time: session.time,
        weight: session.weight,
        side: rep.side,
        set: setCount,
        timeOfDay: session.timeOfDay,
        reps: Number(rep.repId) + 1,
        fmax: this.getStatsValueForRep(
          stats.stats,
          rep.repId,
          rep.setId,
          rep.sessionId,
          'fmax'
        ),
        force: this.getStatsValueForRep(
          stats.stats,
          rep.repId,
          rep.setId,
          rep.sessionId,
          'force'
        ),
        power: this.getStatsValueForRep(
          stats.stats,
          rep.repId,
          rep.setId,
          rep.sessionId,
          'power'
        ),
        rfd: this.getStatsValueForRep(
          stats.stats,
          rep.repId,
          rep.setId,
          rep.sessionId,
          'rfd'
        ),
        powerToWeight: this.getStatsValueForRep(
          stats.stats,
          rep.repId,
          rep.setId,
          rep.sessionId,
          'power-to-weight'
        ),
        velocity: this.getStatsValueForRep(
          stats.stats,
          rep.repId,
          rep.setId,
          rep.sessionId,
          'velocity'
        ),
        contactTime: this.getStatsValueForRep(
          stats.stats,
          rep.repId,
          rep.setId,
          rep.sessionId,
          'contact-time'
        )
      };
      data.push(item);
    }

    this.setState({
      setData: data,
      loading: false
    });
  };

  getStatsValueForSet = (stats, setId, sessionId, type) => {
    var data = stats.filter(stat => {
      return (
        stat.setId === setId &&
        stat.sessionId === sessionId &&
        stat.class === 'Total' &&
        stat.aggregation === 'avg' &&
        stat.type === type
      );
    });
    var sum = 0;
    var count = 0;
    data.forEach(d => {
      sum += d.value;
      count++;
    });
    return Number(sum / count).toFixed(2);
  };

  getStatsValueForRep = (stats, repId, setId, sessionId, type) => {
    var data = stats.filter(stat => {
      return (
        stat.repId === repId &&
        stat.setId === setId &&
        stat.sessionId === sessionId &&
        stat.class === 'Total' &&
        stat.aggregation === 'avg' &&
        stat.type === type
      );
    });
    var sum = 0;
    var count = 0;
    data.forEach(d => {
      sum += d.value;
      count++;
    });
    return Number(sum / count).toFixed(2);
  };

  getSessionForId = (id, sessions) => {
    return sessions.find(session => {
      return session.sessionId === id;
    });
  };

  componentWillReceiveProps = props => {
    this.setStateFromProps(props);
  };

  componentDidMount = () => {
    this.setState({
      mounted: true
    });
  };

  callback = key => {};

  exerciseChange = e => {
    const { date } = this.state;
    this.setState(
      {
        selectedExercise: e.target.value,
        loading: true
      },
      () => {
        this.getWeightsForExercise(date);
      }
    );
  };

  weightChange = e => {
    const { date } = this.state;
    this.setState(
      {
        selectedWeight: e.target.value
      },
      () => {
        this.getSidesForExercise(date);
      }
    );
  };

  sideChange = e => {
    const { date } = this.state;
    this.setState(
      {
        selectedSide: e.target.value
      },
      () => {
        this.getStatsForSession(date);
        this.getStatsForSet(date);
      }
    );
  };

  showSetsDrawer = () => {
    this.setState({
      setsDrawerVisible: true
    });
  };

  onSetsDrawerClose = () => {
    this.setState({
      setsDrawerVisible: false
    });
  };

  render() {
    const {
      sessionData,
      exercisesForDay,
      selectedExercise,
      setData,
      weightsForExercise,
      selectedWeight,
      sidesForExercise,
      selectedSide,
      loading,
      setsDrawerVisible,
      period,
      date
    } = this.state;

    return (
      <div className="day-tab">
        <Tabs onChange={this.callback} type="card">
          <TabPane tab="Period" key="0">
            <PeriodSummary period={period}></PeriodSummary>
          </TabPane>
          <TabPane tab="Day" key="1">
            <DaySummary athlete={this.athlete} day={date}></DaySummary>
          </TabPane>
          <TabPane tab="Sessions" key="2">
            {exercisesForDay.length > 1 && (
              <div>
                <Radio.Group
                  style={{ marginTop: '0px', marginBottom: '10px' }}
                  buttonStyle="solid"
                  value={selectedExercise}
                  onChange={this.exerciseChange}
                >
                  {exercisesForDay.map(exercise => (
                    <Radio.Button value={exercise}>{exercise}</Radio.Button>
                  ))}
                </Radio.Group>
              </div>
            )}
            {weightsForExercise.length > 1 && (
              <div>
                <Radio.Group
                  style={{ marginTop: '2px', marginBottom: '10px' }}
                  buttonStyle="solid"
                  value={selectedWeight}
                  onChange={this.weightChange}
                >
                  {weightsForExercise.map(weight => (
                    <Radio.Button value={weight}>{weight}</Radio.Button>
                  ))}
                </Radio.Group>
              </div>
            )}
            {sidesForExercise.length > 1 && (
              <div>
                <Radio.Group
                  style={{ marginTop: '2px', marginBottom: '10px' }}
                  buttonStyle="solid"
                  value={selectedSide}
                  onChange={this.sideChange}
                >
                  {sidesForExercise.map(side => (
                    <Radio.Button value={side}>{side}</Radio.Button>
                  ))}
                </Radio.Group>
              </div>
            )}
            <Table
              columns={this.getSessionColumns(sessionData)}
              bordered={false}
              dataSource={sessionData}
              size="small"
              loading={loading}
              pagination={false}
              indentSize={0}
            />
          </TabPane>
          <TabPane tab="Sets" key="3">
            {exercisesForDay.length > 1 && (
              <div>
                <Radio.Group
                  style={{ marginTop: '0px', marginBottom: '10px' }}
                  buttonStyle="solid"
                  value={selectedExercise}
                  onChange={this.exerciseChange}
                >
                  {exercisesForDay.map(exercise => (
                    <Radio.Button value={exercise}>{exercise}</Radio.Button>
                  ))}
                </Radio.Group>
              </div>
            )}
            {weightsForExercise.length > 1 && (
              <div>
                <Radio.Group
                  style={{ marginTop: '2px', marginBottom: '10px' }}
                  buttonStyle="solid"
                  value={selectedWeight}
                  onChange={this.weightChange}
                >
                  {weightsForExercise.map(weight => (
                    <Radio.Button value={weight}>{weight}</Radio.Button>
                  ))}
                </Radio.Group>
              </div>
            )}
            {sidesForExercise.length > 1 && (
              <div>
                <Radio.Group
                  style={{ marginTop: '2px', marginBottom: '10px' }}
                  buttonStyle="solid"
                  value={selectedSide}
                  onChange={this.sideChange}
                >
                  {sidesForExercise.map(side => (
                    <Radio.Button value={side}>{side}</Radio.Button>
                  ))}
                </Radio.Group>
              </div>
            )}
            <Button
              type="secondary"
              style={{ marginBottom: '10px', marginTop: '-10px' }}
              onClick={this.showSetsDrawer}
            >
              View
            </Button>
            <Table
              columns={this.getSetColumns(setData)}
              bordered={false}
              dataSource={setData}
              size="small"
              pagination={false}
              indentSize={0}
            />
            <Drawer
              title="Session Graphs"
              placement="right"
              closable={false}
              width={650}
              onClose={this.onSetsDrawerClose}
              visible={setsDrawerVisible}
            >
              <SetGraph setData={setData} type="force" />
              <SetGraph setData={setData} type="power" />
              <SetGraph setData={setData} type="fmax" />
            </Drawer>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

function SetGraph(props) {
  const data = props.setData;
  const type = props.type;
  const max = Number(data.Max(type));
  const min = Number(data.Min(type));
  const minAxis = data.find(session => session[type] == max).time;
  return (
    <div>
      <h4 style={{ color: '#7B241C' }}>{type}</h4>
      <LineChart
        width={620}
        height={200}
        data={data}
        margin={{
          top: 5,
          right: 15,
          left: 10,
          bottom: 5
        }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis
          dataKey="time"
          tickSize={10}
          type="category"
          interval={3}
          allowDecimals={false}
        />
        <YAxis type="number" domain={[min - 5, max + 5]} />
        <Tooltip />
        {/* <Legend /> */}
        <Line
          type="monotone"
          dataKey={type}
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <ReferenceLine x={minAxis} stroke="#D35400" />
        <ReferenceLine y={max} stroke="#D35400" />
        {/* <ReferenceArea x1={"1:25:59 PM"} x2={"1:25:59 PM"} y1={80} y2={110} alwaysShow={true} stroke="red" strokeOpacity={0.3} /> */}
      </LineChart>
    </div>
  );
}
