import React, { Component } from 'react';
import { Tag, Tooltip, Switch } from 'antd';
import _ from 'lodash';
import { observer } from 'mobx-react';
import { GetStore } from '../../../models/store/store';
import ReactTable from 'react-table';
import { Icon } from 'semantic-ui-react';
import uniqid from 'uniqid';

import 'react-table/react-table.css';
import '../athletePage.css';

const sortOrder = ['Isometric', 'Throw-off', 'Constant Contact'];

const maxRowStyle = {
  backgroundColor: '#FFFFE8',
  // backgroundColor: '#C83434',
  borderTop: 'solid 0.1em #ECD6A4',
  // borderTop: 'solid 0.1em #3D0000',
  alignContent: 'center',
  verticalAlign: 'middle',
  padding: '1px',
  paddingTop: '2.5px',
  height: '28px',
  fontWeight: '500',
  color: '#00325F'
};

const ExerciseForDay = observer(
  class ExerciseForDay extends Component {
    constructor(props) {
      super(props);
      this.athlete = GetStore().athlete;
      this.state = {
        mounted: false,
        day: props.day,
        weights: props.weights,
        data: this.getData(props.day),
        expanded: {
          '0': {},
          '1': {},
          '2': {}
        },
        sorted: [
          {
            id: 'type',
            desc: false
          }
        ],
        hidden: [],
        maxPower: []
      };
      this.setStateFromProps(props);
      this.storeState = GetStore().state;
      this.exercises = GetStore().exercises;
      this.bestPowerIndex = [];
      this.bestLeftPowerIndex = [];
      this.bestRightPowerIndex = [];
      this.bestPowerMaxIndex = [];
      this.bestLeftPowerMaxIndex = [];
      this.bestRightPowerMaxIndex = [];
      this.bestForceIndex = [];
      this.bestLeftForceIndex = [];
      this.bestRightForceIndex = [];
      this.bestFMaxIndex = [];
      this.bestLeftFMaxIndex = [];
      this.bestRightFMaxIndex = [];
      this.bestDisConIndex = [];
      this.bestLeftDisConIndex = [];
      this.bestRightDisConIndex = [];
      this.bestDisEccIndex = [];
      this.bestLeftDisEccIndex = [];
      this.bestRightDisEccIndex = [];
    }

    setStateFromProps = props => {
      this.setState(
        {
          day: props.day,
          // data: this.getData(props.day),
          weights: props.weights
        },
        () => {}
      );
    };

    getColor = value => {
      //value from 0 to 1
      var hue = ((1 - value) * 255).toString(10);
      return ['hsl(', hue, ',90%,40%)'].join('');
    };

    componentWillReceiveProps = props => {
      this.setStateFromProps(props);
    };

    componentDidMount = () => {
      this.setState({
        mounted: true
      });
    };
    1;

    onClick = () => {};

    getMaxForceValues = row => {
      const { data } = this.state;

      var leftForces = [];
      var rightForces = [];
      var bothForces = [];
      row.row._subRows.forEach(sr => {
        if (sr._subRows !== undefined) {
          sr._subRows.forEach(ssr => {
            if (ssr.side === 'Left') {
              leftForces.push(ssr.force);
            }
            if (ssr.side === 'Right') {
              rightForces.push(ssr.force);
            }
            if (ssr.side === 'Both') {
              bothForces.push(ssr.force);
            }
          });
        }
      });
      var leftMax = _.max(leftForces);
      var rightMax = _.max(rightForces);
      var bothMax = _.max(bothForces);

      var maxItem = data.find(d => d.force == leftMax);
      if (maxItem !== undefined) {
        this.bestLeftForceIndex.push(maxItem.id);
        this.bestLeftForceIndex = [
          ...new Set(this.bestLeftForceIndex.map(x => x))
        ];
      }

      maxItem = data.find(d => d.force == rightMax);
      if (maxItem !== undefined) {
        this.bestRightForceIndex.push(maxItem.id);
        this.bestRightForceIndex = [
          ...new Set(this.bestRightForceIndex.map(x => x))
        ];
      }
      maxItem = data.find(d => d.force == bothMax);
      if (maxItem !== undefined) {
        this.bestForceIndex.push(maxItem.id);
        this.bestForceIndex = [...new Set(this.bestForceIndex.map(x => x))];
      }
      return {
        left: leftMax,
        right: rightMax,
        both: bothMax
      };
    };

    getMaxFMaxValues = row => {
      const { data } = this.state;

      var leftFMaxes = [];
      var rightFMaxes = [];
      var bothFMaxes = [];
      row.row._subRows.forEach(sr => {
        if (sr._subRows !== undefined) {
          sr._subRows.forEach(ssr => {
            if (ssr.side === 'Left') {
              leftFMaxes.push(ssr.fmax);
            }
            if (ssr.side === 'Right') {
              rightFMaxes.push(ssr.fmax);
            }
            if (ssr.side === 'Both') {
              bothFMaxes.push(ssr.fmax);
            }
          });
        }
      });
      var leftMax = _.max(leftFMaxes);
      var rightMax = _.max(rightFMaxes);
      var bothMax = _.max(bothFMaxes);

      var maxItem = data.find(d => d.fmax == leftMax);
      if (maxItem !== undefined) {
        this.bestLeftFMaxIndex.push(maxItem.id);
        this.bestLeftFMaxIndex = [
          ...new Set(this.bestLeftFMaxIndex.map(x => x))
        ];
      }

      maxItem = data.find(d => d.fmax == rightMax);
      if (maxItem !== undefined) {
        this.bestRightFMaxIndex.push(maxItem.id);
        this.bestRightFMaxIndex = [
          ...new Set(this.bestRightFMaxIndex.map(x => x))
        ];
      }
      maxItem = data.find(d => d.fmax == bothMax);
      if (maxItem !== undefined) {
        this.bestFMaxIndex.push(maxItem.id);
        this.bestFMaxIndex = [...new Set(this.bestFMaxIndex.map(x => x))];
      }
      return {
        left: leftMax,
        right: rightMax,
        both: bothMax
      };
    };

    getMaxDissConValues = row => {
      const { data } = this.state;

      var leftDiss = [];
      var rightDiss = [];
      var bothDiss = [];
      row.row._subRows.forEach(sr => {
        if (sr._subRows !== undefined) {
          sr._subRows.forEach(ssr => {
            if (ssr.side === 'Left') {
              leftDiss.push(ssr['displacement-concentric']);
            }
            if (ssr.side === 'Right') {
              rightDiss.push(ssr['displacement-concentric']);
            }
            if (ssr.side === 'Both') {
              bothDiss.push(ssr['displacement-concentric']);
            }
          });
        }
      });
      var leftMax = _.max(leftDiss);
      var rightMax = _.max(rightDiss);
      var bothMax = _.max(bothDiss);

      var maxItem = data.find(d => d['displacement-concentric'] == leftMax);
      if (maxItem !== undefined) {
        this.bestLeftDisConIndex.push(maxItem.id);
        this.bestLeftDisConIndex = [
          ...new Set(this.bestLeftDisConIndex.map(x => x))
        ];
      }

      maxItem = data.find(d => d['displacement-concentric'] == rightMax);
      if (maxItem !== undefined) {
        this.bestRightDisConIndex.push(maxItem.id);
        this.bestRightDisConIndex = [
          ...new Set(this.bestRightDisConIndex.map(x => x))
        ];
      }
      maxItem = data.find(d => d['displacement-concentric'] == bothMax);
      if (maxItem !== undefined) {
        this.bestDisConIndex.push(maxItem.id);
        this.bestDisConIndex = [...new Set(this.bestDisConIndex.map(x => x))];
      }
      return {
        left: leftMax,
        right: rightMax,
        both: bothMax
      };
    };

    getMaxDissEccValues = row => {
      const { data } = this.state;

      var leftDiss = [];
      var rightDiss = [];
      var bothDiss = [];
      row.row._subRows.forEach(sr => {
        if (sr._subRows !== undefined) {
          sr._subRows.forEach(ssr => {
            if (ssr.side === 'Left') {
              leftDiss.push(ssr['displacement-eccentric']);
            }
            if (ssr.side === 'Right') {
              rightDiss.push(ssr['displacement-eccentric']);
            }
            if (ssr.side === 'Both') {
              bothDiss.push(ssr['displacement-eccentric']);
            }
          });
        }
      });
      var leftMax = _.max(leftDiss);
      var rightMax = _.max(rightDiss);
      var bothMax = _.max(bothDiss);

      var maxItem = data.find(d => d['displacement-eccentric'] == leftMax);
      if (maxItem !== undefined) {
        this.bestLeftDisEccIndex.push(maxItem.id);
        this.bestLeftDisEccIndex = [
          ...new Set(this.bestLeftDisEccIndex.map(x => x))
        ];
      }

      maxItem = data.find(d => d['displacement-eccentric'] == rightMax);
      if (maxItem !== undefined) {
        this.bestRightDisEccIndex.push(maxItem.id);
        this.bestRightDisEccIndex = [
          ...new Set(this.bestRightDisEccIndex.map(x => x))
        ];
      }
      maxItem = data.find(d => d['displacement-eccentric'] == bothMax);
      if (maxItem !== undefined) {
        this.bestDisEccIndex.push(maxItem.id);
        this.bestDisEccIndex = [...new Set(this.bestDisEccIndex.map(x => x))];
      }
      return {
        left: leftMax,
        right: rightMax,
        both: bothMax
      };
    };

    getMaxPowerValues = row => {
      const { data } = this.state;

      var leftPowers = [];
      var rightPowers = [];
      var bothPowers = [];
      var leftMaxPowers = [];
      var rightMaxPowers = [];
      var bothMaxPowers = [];

      row.row._subRows.forEach(sr => {
        if (sr._subRows !== undefined) {
          sr._subRows.forEach(ssr => {
            if (ssr.side === 'Left') {
              leftPowers.push(ssr.power);
              leftMaxPowers.push(ssr._original['best:power']);
            }
            if (ssr.side === 'Right') {
              rightPowers.push(ssr.power);
              rightMaxPowers.push(ssr._original['best:power']);
            }
            if (ssr.side === 'Both') {
              bothPowers.push(ssr.power);
              bothMaxPowers.push(ssr._original['best:power']);
            }
          });
        } else {
          if (sr.side === 'Left') {
            leftPowers.push(sr.power);
            leftMaxPowers.push(sr._original['best:power']);
          }
          if (sr.side === 'Right') {
            rightPowers.push(sr.power);
            rightMaxPowers.push(sr._original['best:power']);
          }
          if (sr.side === 'Both') {
            bothPowers.push(sr.power);
            bothMaxPowers.push(sr._original['best:power']);
          }
        }
      });
      var leftMax = _.max(leftPowers);
      var rightMax = _.max(rightPowers);
      var bothMax = _.max(bothPowers);
      var leftMaxMax = _.max(leftMaxPowers);
      var rightMaxMax = _.max(rightMaxPowers);
      var bothMaxMax = _.max(bothMaxPowers);

      var maxItem = data.find(d => d.power == leftMax);
      if (maxItem !== undefined) {
        this.bestLeftPowerIndex.push(maxItem.id);
        this.bestLeftPowerIndex = [
          ...new Set(this.bestLeftPowerIndex.map(x => x))
        ];
      }
      maxItem = data.find(d => d.power == rightMax);
      if (maxItem !== undefined) {
        this.bestRightPowerIndex.push(maxItem.id);
        this.bestRightPowerIndex = [
          ...new Set(this.bestRightPowerIndex.map(x => x))
        ];
      }
      maxItem = data.find(d => d.power == bothMax);
      if (maxItem !== undefined) {
        this.bestPowerIndex.push(maxItem.id);
        this.bestPowerIndex = [...new Set(this.bestPowerIndex.map(x => x))];
      }

      maxItem = data.find(d => d['best:power'] == leftMaxMax);
      if (maxItem !== undefined) {
        this.bestLeftPowerMaxIndex.push(maxItem.id);
        this.bestLeftPowerMaxIndex = [
          ...new Set(this.bestLeftPowerMaxIndex.map(x => x))
        ];
      }
      maxItem = data.find(d => d['best:power'] == rightMaxMax);
      if (maxItem !== undefined) {
        this.bestRightPowerMaxIndex.push(maxItem.id);
        this.bestRightPowerMaxIndex = [
          ...new Set(this.bestRightPowerMaxIndex.map(x => x))
        ];
      }
      maxItem = data.find(d => d['best:power'] == bothMaxMax);
      if (maxItem !== undefined) {
        this.bestPowerMaxIndex.push(maxItem.id);
        this.bestPowerMaxIndex = [
          ...new Set(this.bestPowerMaxIndex.map(x => x))
        ];
      }

      return {
        left: leftMax,
        right: rightMax,
        both: bothMax,
        leftMax: leftMaxMax,
        rightMax: rightMaxMax,
        bothMax: bothMaxMax
      };
    };

    onSwitchDeviations = checked => {
      const { hidden } = this.state;
      if (!checked) {
        hidden.push('deviations');
        this.setState({
          hidden: hidden
        });
      } else {
        _.pull(hidden, 'deviations');
        this.setState({
          hidden: hidden
        });
      }
    };

    render() {
      const { day, data, hidden } = this.state;

      if (this.athlete.loaded) {
        var dayData = this.athlete.period.exerciseDays.find(
          d => day === d.date.toISOString().slice(0, 10)
        );
      }
      var sortedData = data.filter(d => d.sessionType === 'test');
      sortedData.sort((a, b) => (a.side < b.side ? 1 : -1));
      sortedData.sort((a, b) => (a.weight > b.weight ? 1 : -1));

      return (
        <div>
          <div style={{ marginBottom: '10px' }}>
            <span>
              <span style={{ color: '#003463', fontWeight: '300' }}>
                Show deviations
              </span>{' '}
              <Switch
                size="small"
                defaultChecked
                onChange={this.onSwitchDeviations}
              />
            </span>
          </div>
          <ReactTable
            style={{ width: '70%' }}
            data={sortedData}
            filterable
            columns={[
              {
                Header: ' ',
                columns: [
                  {
                    Header: 'Body Part',
                    accessor: 'bodyPart',
                    show: false
                  }
                ]
              },
              {
                Header: 'Exercise',
                columns: [
                  {
                    Header: 'Class',
                    accessor: 'exerciseClass',
                    minWidth: 20,
                    show: false,
                    aggregate: vals => getUniqArrayStr(vals)
                  },
                  // {
                  //   Header: 'Exercise',
                  //   id: 'exercise',
                  //   show: false,
                  //   accessor: d => d.exerciseSubClass,
                  //   aggregate: vals => getUniqArrayStr(vals)
                  // },
                  {
                    Header: 'Type',
                    id: 'type',
                    width: 150,
                    Pivot: cellInfo => {
                      if (cellInfo.isExpanded) {
                        return (
                          <div className="expand">
                            <div className="expand-icon">
                              <i class="fa fa-caret-down"></i>
                            </div>
                            <div className="expand-value">{cellInfo.value}</div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="expand">
                            <div className="expand-icon">
                              <i class="fa fa-caret-right"></i>
                            </div>
                            <div className="expand-value">{cellInfo.value}</div>
                          </div>
                        );
                      }
                    },
                    accessor: d => d.type,
                    aggregate: vals => getUniqArrayStr(vals),
                    sortMethod: (a, b) => {
                      if (a === b) {
                        return 0;
                      }
                      var aIndex = sortOrder.indexOf(a);
                      var bIndex = sortOrder.indexOf(b);
                      return aIndex > bIndex ? 1 : -1;
                    },
                    filterMethod: (filter, row) => {
                      if (filter.value === 'all') {
                        return true;
                      }
                      return row[filter.id].includes(filter.value);
                    },
                    Filter: ({ filter, onChange }) => {
                      this.bestPowerIndex = [];
                      var types = [...new Set(data.map(x => x.type))];
                      return (
                        <select
                          onChange={event => onChange(event.target.value)}
                          style={{
                            width: '100%',
                            backgroundColor: '#00194E',
                            color: 'white'
                          }}
                          value={filter ? filter.value : 'all'}
                        >
                          <option value="all">All</option>
                          {types.map(type => (
                            <option value={type}>{type}</option>
                          ))}
                        </select>
                      );
                    }
                  },
                  {
                    Header: 'Group',
                    id: 'group',
                    width: 90,
                    accessor: d => d.group,
                    aggregate: vals => getUniqArrayStr(vals),
                    Pivot: cellInfo => {
                      if (cellInfo.isExpanded) {
                        return (
                          <div className="expand">
                            <div className="expand-icon">
                              <i class="fa fa-caret-down"></i>
                            </div>
                            <div className="expand-value-group">
                              {cellInfo.value}
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="expand">
                            <div className="expand-icon">
                              <i class="fa fa-caret-right"></i>
                            </div>
                            <div className="expand-value-group">
                              {cellInfo.value}
                            </div>
                          </div>
                        );
                      }
                    },
                    Cell: row => {
                      return (
                        <div
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {row.value}
                        </div>
                      );
                    },
                    filterMethod: (filter, row) => {
                      if (filter.value === 'all') {
                        return true;
                      }
                      return row[filter.id].includes(filter.value);
                    },
                    Filter: ({ filter, onChange }) => {
                      this.bestPowerIndex = [];
                      var groups = [...new Set(data.map(x => x.group))];
                      return (
                        <select
                          onChange={event => onChange(event.target.value)}
                          style={{
                            width: '100%',
                            backgroundColor: '#00A4D6',
                            color: 'white'
                          }}
                          value={filter ? filter.value : 'all'}
                        >
                          <option value="all">All</option>
                          {groups.map(group => (
                            <option value={group}>{group}</option>
                          ))}
                        </select>
                      );
                    }
                  },

                  {
                    Header: 'Weight',
                    id: 'weight',
                    width: 65,
                    accessor: d => d.weight,
                    aggregate: (vals, rows) => {
                      return getUniqArrayStr(vals, rows);
                    },
                    getProps: (state, rowInfo, column) => {
                      if (
                        rowInfo &&
                        rowInfo.row._original &&
                        rowInfo.row._original.max
                      ) {
                        return {
                          style: maxRowStyle
                        };
                      } else return { style: {} };
                    },
                    Cell: row => {
                      if (row.level <= 1) {
                        return (
                          <div
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {row.value}
                          </div>
                        );
                      }
                      if (row.value === 999999) {
                        const padding = {
                          paddingLeft: '10px',
                          paddingRight: '10px'
                        };
                        if (row.row.side === 'Left') {
                          return (
                            <span className="best-power-left" style={padding}>
                              {'Max'}
                            </span>
                          );
                        } else if (row.row.side === 'Right') {
                          return (
                            <span className="best-power-right" style={padding}>
                              {'Max'}
                            </span>
                          );
                        }
                        return (
                          <span className="best-power-both" style={padding}>
                            {'Max'}
                          </span>
                        );
                      }
                      return <span className="tag-weight">{row.value}</span>;
                    },
                    filterMethod: (filter, row) => {
                      if (filter.value === 'all') {
                        return true;
                      }
                      var rowValue = row[filter.id];
                      if (
                        typeof rowValue === 'string' ||
                        rowValue instanceof String
                      ) {
                        return row[filter.id].includes(filter.value);
                      } else {
                        return String(row[filter.id]).includes(filter.value);
                      }
                    },
                    Filter: ({ filter, onChange }) => {
                      this.bestPowerIndex = [];
                      var weights = [...new Set(data.map(x => x.weight))];
                      return (
                        <select
                          onChange={event => onChange(event.target.value)}
                          style={{
                            width: '100%',
                            backgroundColor: '#005312',
                            color: 'white'
                          }}
                          value={filter ? filter.value : 'all'}
                        >
                          <option value="all">All</option>
                          {weights.map(weight => (
                            <option value={weight}>{weight}</option>
                          ))}
                        </select>
                      );
                    }
                  },
                  {
                    Header: 'Side',
                    id: 'side',
                    width: 75,
                    accessor: 'side',
                    aggregate: vals => getUniqArrayStr(vals),
                    getProps: (state, rowInfo, column) => {
                      if (
                        rowInfo &&
                        rowInfo.row._original &&
                        rowInfo.row._original.max
                      ) {
                        return {
                          style: maxRowStyle
                        };
                      } else return { style: {} };
                    },
                    Cell: row => {
                      if (row.level >= 2) {
                        if (row.value === 'Left') {
                          return (
                            <span className="tag-side-left">
                              <Icon name="angle left"></Icon>
                              {row.value}
                            </span>
                          );
                        } else if (row.value === 'Right') {
                          return (
                            <span className="tag-side-right">
                              {row.value}
                              <Icon name="angle right"></Icon>
                            </span>
                          );
                        } else if (row.value === 'Both') {
                          return (
                            <span className="tag-side-both">
                              <Icon name="angle left"></Icon>
                              {row.value}
                              <Icon name="angle right"></Icon>
                            </span>
                          );
                        } else {
                          return (
                            <div
                              style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {row.value}
                            </div>
                          );
                        }
                      }
                      return (
                        <div
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {row.value}
                        </div>
                      );
                    },
                    filterMethod: (filter, row) => {
                      if (filter.value === 'all') {
                        return true;
                      }
                      return row[filter.id].includes(filter.value);
                    },
                    Filter: ({ filter, onChange }) => {
                      this.bestPowerIndex = [];
                      var sides = [...new Set(data.map(x => x.side))];
                      return (
                        <select
                          onChange={event => onChange(event.target.value)}
                          style={{
                            width: '100%',
                            backgroundColor: '#FA3200',
                            color: 'white'
                          }}
                          value={filter ? filter.value : 'all'}
                        >
                          <option value="all">All</option>
                          {sides.map(side => (
                            <option value={side}>{side}</option>
                          ))}
                        </select>
                      );
                    }
                  }
                ],
                Cell: row => (
                  <div style={{ fontWeight: '800' }}>{row.value}</div>
                )
              },
              {
                Header: 'Power(W)',
                headerStyle: {
                  backgroundColor: '#EDF8FF',
                  color: 'black',
                  fontWeight: '500'
                },
                columns: [
                  {
                    Header: 'Power',
                    accessor: 'power',
                    filterable: false,
                    width: 65,
                    className: 'cell-value',
                    getProps: (state, rowInfo, column) => {
                      if (
                        rowInfo &&
                        rowInfo.row._original &&
                        rowInfo.row._original.max
                      ) {
                        return {
                          style: maxRowStyle
                        };
                      } else return { style: {} };
                    },
                    aggregate: vals => ({
                      mean: Number(_.mean(vals)),
                      max: Number(_.max(vals))
                    }),
                    Aggregated: row => {
                      if (row.row.type === 'Isometric') {
                        return null;
                      }
                      var powers = row.subRows.map(r => r.power);
                      if (isNaN(powers[0])) {
                        var powersMean = powers.map(p => p.mean);
                        var mean = _.mean(powersMean);
                        //array
                      } else {
                        mean = _.mean(powers);
                      }
                      const { left, right, both } = this.getMaxPowerValues(row);
                      var maxStr = undefined;
                      if (left !== undefined) {
                        maxStr = (
                          <span className="tooltip-best">
                            <Icon name="angle left"></Icon>
                            {'Right: ' + left.toFixed(2)}
                          </span>
                        );
                      }
                      if (right !== undefined) {
                        maxStr = (
                          <div>
                            {maxStr}
                            <br></br>
                            <span className="tooltip-best">
                              {'Left: ' + right.toFixed(2)}
                              <Icon name="angle right"></Icon>
                            </span>
                          </div>
                        );
                      }
                      if (both !== undefined) {
                        maxStr = (
                          <div>
                            {maxStr}
                            <span className="tooltip-best">
                              <Icon name="angle left"></Icon>
                              {'Both: ' + both.toFixed(2)}
                              <Icon name="angle right"></Icon>
                            </span>
                          </div>
                        );
                      }
                      return (
                        <Tooltip title={maxStr}>
                          <span style={{ height: '50px', cursor: 'pointer' }}>
                            <span style={{ color: '#1F3371', height: '50px' }}>
                              {mean.toFixed(2) + '    '}
                            </span>
                          </span>
                        </Tooltip>
                      );
                    },
                    Cell: row => {
                      if (row.row.type === 'Isometric') {
                        return null;
                      }
                      if (row.row._original.max) {
                        return <div>{Number(row.value).toFixed(2)}</div>;
                      }
                      var max = data.find(d => {
                        return (
                          (this.bestPowerIndex.includes(d.id) ||
                            this.bestLeftPowerIndex.includes(d.id) ||
                            this.bestRightPowerIndex.includes(d.id)) &&
                          d.group === row.row.group &&
                          d.type === row.row.type &&
                          d.side === row.row.side
                        );
                      });
                      var pct = row.value / max.power;
                      if (this.bestPowerIndex.includes(row.original.id)) {
                        return (
                          <span className="best-power-both">
                            {Number(row.value).toFixed(2)}
                          </span>
                        );
                      } else if (
                        this.bestLeftPowerIndex.includes(row.original.id)
                      ) {
                        return (
                          <span className="best-power-left">
                            {Number(row.value).toFixed(2)}
                          </span>
                        );
                      } else if (
                        this.bestRightPowerIndex.includes(row.original.id)
                      ) {
                        return (
                          <span className="best-power-right">
                            {Number(row.value).toFixed(2)}
                          </span>
                        );
                      } else {
                        return (
                          <div style={{ color: this.getColor(pct) }}>
                            {Number(row.value).toFixed(2)}
                          </div>
                        );
                      }
                    },
                    Filter: () => {
                      return '';
                    }
                  },
                  {
                    Header: 'Max',
                    accessor: 'best:power',
                    filterable: false,
                    width: 65,
                    className: 'cell-value',
                    getProps: (state, rowInfo, column) => {
                      if (
                        rowInfo &&
                        rowInfo.row._original &&
                        rowInfo.row._original.max
                      ) {
                        return {
                          style: maxRowStyle
                        };
                      } else return { style: {} };
                    },
                    aggregate: vals => {
                      return {
                        mean: Number(_.mean(vals)),
                        max: Number(_.max(vals))
                      };
                    },
                    Aggregated: row => {
                      if (row.row.type === 'Isometric') {
                        return null;
                      }
                      var powers = row.subRows.map(r => r['best:power']);
                      if (isNaN(powers[0])) {
                        var powersMean = powers.map(p => p.mean);
                        var mean = _.mean(powersMean);
                        //array
                      } else {
                        mean = _.mean(powers);
                      }
                      const {
                        leftMax,
                        rightMax,
                        bothMax
                      } = this.getMaxPowerValues(row);
                      var maxStr = undefined;
                      if (leftMax !== undefined) {
                        maxStr = (
                          <span className="tooltip-best">
                            <Icon name="angle left"></Icon>
                            {'Right: ' + leftMax.toFixed(2)}
                          </span>
                        );
                      }
                      if (rightMax !== undefined) {
                        maxStr = (
                          <div>
                            {maxStr}
                            <br></br>
                            <span className="tooltip-best">
                              {'Left: ' + rightMax.toFixed(2)}
                              <Icon name="angle right"></Icon>
                            </span>
                          </div>
                        );
                      }
                      if (bothMax !== undefined) {
                        maxStr = (
                          <div>
                            {maxStr}
                            <span className="tooltip-best">
                              <Icon name="angle left"></Icon>
                              {'Both: ' + bothMax.toFixed(2)}
                              <Icon name="angle right"></Icon>
                            </span>
                          </div>
                        );
                      }
                      return (
                        <Tooltip title={maxStr}>
                          <span style={{ height: '50px', cursor: 'pointer' }}>
                            <span style={{ color: '#E34100', height: '50px' }}>
                              {mean.toFixed(2) + '    '}
                            </span>
                          </span>
                        </Tooltip>
                      );
                    },
                    Cell: row => {
                      if (row.row.type === 'Isometric') {
                        return null;
                      }
                      if (row.row._original.max) {
                        return <div>{Number(row.value).toFixed(2)}</div>;
                      }
                      var max = data.find(d => {
                        return (
                          (this.bestPowerIndex.includes(d.id) ||
                            this.bestLeftPowerIndex.includes(d.id) ||
                            this.bestRightPowerIndex.includes(d.id)) &&
                          d.group === row.row.group &&
                          d.type === row.row.type &&
                          d.side === row.row.side
                        );
                      });
                      var pct = row.value / max['best:power'];
                      if (this.bestPowerMaxIndex.includes(row.original.id)) {
                        return (
                          <span className="best-power-both">
                            {Number(row.value).toFixed(2)}
                          </span>
                        );
                      } else if (
                        this.bestLeftPowerMaxIndex.includes(row.original.id)
                      ) {
                        return (
                          <span className="best-power-left">
                            {Number(row.value).toFixed(2)}
                          </span>
                        );
                      } else if (
                        this.bestRightPowerMaxIndex.includes(row.original.id)
                      ) {
                        return (
                          <span className="best-power-right">
                            {Number(row.value).toFixed(2)}
                          </span>
                        );
                      } else {
                        return (
                          <div style={{ color: this.getColor(pct) }}>
                            {Number(row.value).toFixed(2)}
                          </div>
                        );
                      }
                    },
                    Filter: () => {
                      return '';
                    }
                  },
                  {
                    Header: 'Side deviation',
                    filterable: false,
                    accessor: 'power:deviation',
                    show: !hidden.includes('deviations'),
                    width: 45,
                    aggregate: vals => Number(_.mean(vals).toFixed(2)),
                    getProps: (state, rowInfo, column) => {
                      if (
                        rowInfo &&
                        rowInfo.row._original &&
                        rowInfo.row._original.max
                      ) {
                        return {
                          style: maxRowStyle
                        };
                      } else return { style: {} };
                    },
                    Cell: row => {
                      if (row.row.type === 'Isometric') {
                        return null;
                      }
                      if (row.level === 1) {
                        return null;
                      }
                      if (
                        (row.row.side === 'Right' ||
                          row.row.side === 'Both' ||
                          row.row.side === 'Left') &&
                        row.value !== undefined
                      ) {
                        if (row.row.side === 'Right') {
                          return (
                            <Tooltip
                              title={`Right is ${Math.abs(
                                row.value.toFixed(0)
                              )}%  ${
                                row.value > 0 ? 'higher' : 'lower'
                              } than the Left`}
                            >
                              <div className="deviation-value-side">
                                {row.value.toFixed(0) + '%'}
                              </div>
                            </Tooltip>
                          );
                        }
                      }
                      return null;
                    }
                  },
                  {
                    Header: 'Weight deviation',
                    filterable: false,
                    accessor: 'power:deviation:weight',
                    show: !hidden.includes('deviations'),
                    width: 45,
                    aggregate: vals => Number(_.mean(vals).toFixed(2)),
                    getProps: (state, rowInfo, column) => {
                      if (
                        rowInfo &&
                        rowInfo.row._original &&
                        rowInfo.row._original.max
                      ) {
                        return {
                          style: maxRowStyle
                        };
                      } else return { style: {} };
                    },
                    Cell: row => {
                      if (row.level === 1) {
                        return null;
                      }
                      if (
                        (row.row.side === 'Right' ||
                          row.row.side === 'Both' ||
                          row.row.side === 'Left') &&
                        row.value !== undefined
                      ) {
                        if (row.row.side === 'Both') {
                          return (
                            <Tooltip
                              title={`${row.original.weight}kg is ${Math.abs(
                                row.value.toFixed(0)
                              )}% ${
                                row.value > 0 ? 'higher' : 'lower'
                              } than the previous weight`}
                            >
                              <div className="deviation-value-side">
                                {row.value.toFixed(0) + '%'}
                              </div>
                            </Tooltip>
                          );
                        } else if (row.row.side === 'Right') {
                          return (
                            <Tooltip
                              title={`${row.original.weight}kg is ${Math.abs(
                                row.value.toFixed(0)
                              )}% ${
                                row.value > 0 ? 'higher' : 'lower'
                              } than the previous weight`}
                            >
                              <div className="deviation-value-right">
                                {row.value.toFixed(0) + '%'}
                              </div>
                            </Tooltip>
                          );
                        } else {
                          return (
                            <Tooltip
                              title={`${row.original.weight}kg is ${Math.abs(
                                row.value.toFixed(0)
                              )}% ${
                                row.value > 0 ? 'higher' : 'lower'
                              } than the previous weight`}
                            >
                              <div className="deviation-value-left">
                                {row.value.toFixed(0) + '%'}
                              </div>
                            </Tooltip>
                          );
                        }
                      }
                      return null;
                    }
                  }
                ]
              },
              {
                Header: 'Force(kgf)',
                headerStyle: {
                  backgroundColor: '#DAF0FE',
                  color: 'black',
                  fontWeight: '500'
                },
                columns: [
                  {
                    Header: 'Force',
                    accessor: 'force',
                    width: 60,
                    filterable: false,
                    className: 'cell-value',
                    getProps: (state, rowInfo, column) => {
                      if (
                        rowInfo &&
                        rowInfo.row._original &&
                        rowInfo.row._original.max
                      ) {
                        return {
                          style: maxRowStyle
                        };
                      } else return { style: {} };
                    },
                    aggregate: vals => ({
                      mean: Number(_.mean(vals)),
                      max: Number(_.max(vals))
                    }),
                    Aggregated: row => {
                      var forces = row.subRows.map(r => r.force);
                      if (isNaN(forces[0])) {
                        var forcesMean = forces.map(p => p.mean);
                        var mean = _.mean(forcesMean);
                        //array
                      } else {
                        mean = _.mean(forces);
                      }
                      const { left, right, both } = this.getMaxForceValues(row);
                      var maxStr = undefined;
                      if (left !== undefined) {
                        maxStr = (
                          <span className="tooltip-best">
                            <Icon name="angle left"></Icon>
                            {'Right: ' + left.toFixed(2)}
                          </span>
                        );
                      }
                      if (right !== undefined) {
                        maxStr = (
                          <div>
                            {maxStr}
                            <br></br>
                            <span className="tooltip-best">
                              {'Left: ' + right.toFixed(2)}
                              <Icon name="angle right"></Icon>
                            </span>
                          </div>
                        );
                      }
                      if (both !== undefined) {
                        maxStr = (
                          <div>
                            {maxStr}
                            <span className="tooltip-best">
                              <Icon name="angle left"></Icon>
                              {'Both: ' + both.toFixed(2)}
                              <Icon name="angle right"></Icon>
                            </span>
                          </div>
                        );
                      }
                      return (
                        <Tooltip title={maxStr}>
                          <span style={{ height: '50px', cursor: 'pointer' }}>
                            <span style={{ color: '#1F3371', height: '50px' }}>
                              {mean.toFixed(2) + '    '}
                            </span>
                          </span>
                        </Tooltip>
                      );
                    },
                    Cell: row => {
                      if (row.row._original.max) {
                        return <div>{Number(row.value).toFixed(2)}</div>;
                      }
                      var max = data.find(d => {
                        return (
                          (this.bestForceIndex.includes(d.id) ||
                            this.bestLeftForceIndex.includes(d.id) ||
                            this.bestRightForceIndex.includes(d.id)) &&
                          d.group === row.row.group &&
                          d.type === row.row.type &&
                          d.side === row.row.side
                        );
                      });
                      var pct = row.value / max.force;
                      if (this.bestForceIndex.includes(row.original.id)) {
                        return (
                          <span className="best-power-both">
                            {Number(row.value).toFixed(2)}
                          </span>
                        );
                      } else if (
                        this.bestLeftForceIndex.includes(row.original.id)
                      ) {
                        return (
                          <span className="best-power-left">
                            {Number(row.value).toFixed(2)}
                          </span>
                        );
                      } else if (
                        this.bestRightForceIndex.includes(row.original.id)
                      ) {
                        return (
                          <span className="best-power-right">
                            {Number(row.value).toFixed(2)}
                          </span>
                        );
                      } else {
                        return (
                          <div style={{ color: this.getColor(pct) }}>
                            {Number(row.value).toFixed(2)}
                          </div>
                        );
                      }
                    }
                  },
                  {
                    Header: 'Max',
                    accessor: 'fmax',
                    width: 60,
                    filterable: false,
                    className: 'cell-value',
                    getProps: (state, rowInfo, column) => {
                      if (
                        rowInfo &&
                        rowInfo.row._original &&
                        rowInfo.row._original.max
                      ) {
                        return {
                          style: maxRowStyle
                        };
                      } else return { style: {} };
                    },
                    aggregate: vals => ({
                      mean: Number(_.mean(vals)),
                      max: Number(_.max(vals))
                    }),
                    Aggregated: row => {
                      var forces = row.subRows.map(r => r.fmax);
                      if (isNaN(forces[0])) {
                        var forcesMean = forces.map(p => p.mean);
                        var mean = _.mean(forcesMean);
                        //array
                      } else {
                        mean = _.mean(forces);
                      }
                      const { left, right, both } = this.getMaxFMaxValues(row);
                      var maxStr = undefined;
                      if (left !== undefined) {
                        maxStr = (
                          <span className="tooltip-best">
                            <Icon name="angle left"></Icon>
                            {'Right: ' + left.toFixed(2)}
                          </span>
                        );
                      }
                      if (right !== undefined) {
                        maxStr = (
                          <div>
                            {maxStr}
                            <br></br>
                            <span className="tooltip-best">
                              {'Left: ' + right.toFixed(2)}
                              <Icon name="angle right"></Icon>
                            </span>
                          </div>
                        );
                      }
                      if (both !== undefined) {
                        maxStr = (
                          <div>
                            {maxStr}
                            <span className="tooltip-best">
                              <Icon name="angle left"></Icon>
                              {'Both: ' + both.toFixed(2)}
                              <Icon name="angle right"></Icon>
                            </span>
                          </div>
                        );
                      }
                      return (
                        <Tooltip title={maxStr}>
                          <span style={{ height: '50px', cursor: 'pointer' }}>
                            <span style={{ color: '#E34100', height: '50px' }}>
                              {mean.toFixed(2) + '    '}
                            </span>
                          </span>
                        </Tooltip>
                      );
                    },
                    Cell: row => {
                      if (row.row._original.max) {
                        return <div>{Number(row.value).toFixed(2)}</div>;
                      }
                      const { data } = this.state;
                      var max = data.find(d => {
                        return (
                          (this.bestFMaxIndex.includes(d.id) ||
                            this.bestLeftFMaxIndex.includes(d.id) ||
                            this.bestRightFMaxIndex.includes(d.id)) &&
                          d.group === row.row.group &&
                          d.type === row.row.type &&
                          d.side === row.row.side
                        );
                      });
                      var pct = row.value / max.fmax;
                      if (this.bestFMaxIndex.includes(row.original.id)) {
                        return (
                          <span className="best-power-both">
                            {Number(row.value).toFixed(2)}
                          </span>
                        );
                      } else if (
                        this.bestLeftFMaxIndex.includes(row.original.id)
                      ) {
                        return (
                          <span className="best-power-left">
                            {Number(row.value).toFixed(2)}
                          </span>
                        );
                      } else if (
                        this.bestRightFMaxIndex.includes(row.original.id)
                      ) {
                        return (
                          <span className="best-power-right">
                            {Number(row.value).toFixed(2)}
                          </span>
                        );
                      } else {
                        return (
                          <div style={{ color: this.getColor(pct) }}>
                            {Number(row.value).toFixed(2)}
                          </div>
                        );
                      }
                    }
                  },
                  {
                    Header: 'Side deviation',
                    filterable: false,
                    accessor: 'force:deviation',
                    show: !hidden.includes('deviations'),
                    width: 45,
                    aggregate: vals => Number(_.mean(vals).toFixed(2)),
                    getProps: (state, rowInfo, column) => {
                      if (
                        rowInfo &&
                        rowInfo.row._original &&
                        rowInfo.row._original.max
                      ) {
                        return {
                          style: maxRowStyle
                        };
                      } else return { style: {} };
                    },
                    Cell: row => {
                      if (row.level === 1) {
                        return null;
                      }
                      if (
                        (row.row.side === 'Right' ||
                          row.row.side === 'Both' ||
                          row.row.side === 'Left') &&
                        row.value !== undefined
                      ) {
                        if (row.row.side === 'Right') {
                          return (
                            <Tooltip
                              title={`Right is ${Math.abs(
                                row.value.toFixed(0)
                              )}%  ${
                                row.value > 0 ? 'higher' : 'lower'
                              } than the Left`}
                            >
                              <div className="deviation-value-side">
                                {row.value.toFixed(0) + '%'}
                              </div>
                            </Tooltip>
                          );
                        }
                      }
                      return null;
                    }
                  },
                  {
                    Header: 'Weight deviation',
                    filterable: false,
                    accessor: 'power:deviation:weight',
                    show: !hidden.includes('deviations'),
                    width: 45,
                    aggregate: vals => Number(_.mean(vals).toFixed(2)),
                    getProps: (state, rowInfo, column) => {
                      if (
                        rowInfo &&
                        rowInfo.row._original &&
                        rowInfo.row._original.max
                      ) {
                        return {
                          style: maxRowStyle
                        };
                      } else return { style: {} };
                    },
                    Cell: row => {
                      if (row.level === 1) {
                        return null;
                      }
                      if (
                        (row.row.side === 'Right' ||
                          row.row.side === 'Both' ||
                          row.row.side === 'Left') &&
                        row.value !== undefined
                      ) {
                        if (row.row.side === 'Both') {
                          return (
                            <Tooltip
                              title={`${row.original.weight}kg is ${Math.abs(
                                row.value.toFixed(0)
                              )}% ${
                                row.value > 0 ? 'higher' : 'lower'
                              } than the previous weight`}
                            >
                              <div className="deviation-value-side">
                                {row.value.toFixed(0) + '%'}
                              </div>
                            </Tooltip>
                          );
                        } else if (row.row.side === 'Right') {
                          return (
                            <Tooltip
                              title={`${row.original.weight}kg is ${Math.abs(
                                row.value.toFixed(0)
                              )}% ${
                                row.value > 0 ? 'higher' : 'lower'
                              } than the previous weight`}
                            >
                              <div className="deviation-value-right">
                                {row.value.toFixed(0) + '%'}
                              </div>
                            </Tooltip>
                          );
                        } else {
                          return (
                            <Tooltip
                              title={`${row.original.weight}kg is ${Math.abs(
                                row.value.toFixed(0)
                              )}% ${
                                row.value > 0 ? 'higher' : 'lower'
                              } than the previous weight`}
                            >
                              <div className="deviation-value-left">
                                {row.value.toFixed(0) + '%'}
                              </div>
                            </Tooltip>
                          );
                        }
                      }
                      return null;
                    }
                  }
                ]
              },
              {
                Header: 'Displacement',
                headerStyle: {
                  backgroundColor: '#68C0E6',
                  color: 'black',
                  fontWeight: '500'
                },
                columns: [
                  {
                    Header: 'Concentric (degree)',
                    accessor: 'displacement-concentric',
                    className: 'cell-value',
                    filterable: false,
                    width: 55,
                    getProps: (state, rowInfo, column) => {
                      if (
                        rowInfo &&
                        rowInfo.row._original &&
                        rowInfo.row._original.max
                      ) {
                        return {
                          style: maxRowStyle
                        };
                      } else return { style: {} };
                    },
                    aggregate: vals => ({
                      mean: Number(_.mean(vals)),
                      max: Number(_.max(vals))
                    }),
                    Aggregated: row => {
                      if (row.row.type === 'Isometric') {
                        return null;
                      }
                      var values = row.subRows.map(
                        r => r['displacement-concentric']
                      );
                      if (isNaN(values[0])) {
                        var valuesMean = values.map(p => p.mean);
                        var mean = _.mean(valuesMean);
                        //array
                      } else {
                        mean = _.mean(values);
                      }
                      const { left, right, both } = this.getMaxDissConValues(
                        row
                      );
                      var maxStr = undefined;
                      if (left !== undefined) {
                        maxStr = (
                          <span className="tooltip-best">
                            <Icon name="angle left"></Icon>
                            {'Right: ' + left.toFixed(2)}
                          </span>
                        );
                      }
                      if (right !== undefined) {
                        maxStr = (
                          <div>
                            {maxStr}
                            <br></br>
                            <span className="tooltip-best">
                              {'Left: ' + right.toFixed(2)}
                              <Icon name="angle right"></Icon>
                            </span>
                          </div>
                        );
                      }
                      if (both !== undefined) {
                        maxStr = (
                          <div>
                            {maxStr}
                            <span className="tooltip-best">
                              <Icon name="angle left"></Icon>
                              {'Both: ' + both.toFixed(2)}
                              <Icon name="angle right"></Icon>
                            </span>
                          </div>
                        );
                      }
                      return (
                        <Tooltip title={maxStr}>
                          <span style={{ height: '50px', cursor: 'pointer' }}>
                            <span style={{ color: '#1F3371', height: '50px' }}>
                              {mean.toFixed(2) + '    '}
                            </span>
                          </span>
                        </Tooltip>
                      );
                    },
                    Cell: row => {
                      if (row.row._original.max) {
                        return <div>{Number(row.value).toFixed(2)}</div>;
                      }
                      if (!isNaN(row.value)) {
                        const { data } = this.state;
                        var maxFiltered = data.filter(d => {
                          return (
                            d.group === row.row.group && d.type === row.row.type
                          );
                        });
                        var maxValues = maxFiltered.map(
                          m => m['displacement-concentric']
                        );
                        if (maxValues.length > 0) {
                          var max = _.max(maxValues);
                          var pct = row.value / max;
                          if (this.bestDisConIndex.includes(row.original.id)) {
                            return (
                              <span className="best-power-both">
                                {Number(row.value).toFixed(2)}&#176;
                              </span>
                            );
                          } else if (
                            this.bestLeftDisConIndex.includes(row.original.id)
                          ) {
                            return (
                              <span className="best-power-left">
                                {Number(row.value).toFixed(2)}&#176;
                              </span>
                            );
                          } else if (
                            this.bestRightDisConIndex.includes(row.original.id)
                          ) {
                            return (
                              <span className="best-power-right">
                                {Number(row.value).toFixed(2)}&#176;
                              </span>
                            );
                          } else {
                            return (
                              <div style={{ color: this.getColor(pct) }}>
                                {Number(row.value).toFixed(2)}&#176;
                              </div>
                            );
                          }
                        }
                        return <div>{row.value}</div>;
                      } else return null;
                    }
                  },
                  {
                    Header: 'Eccentric (degree)',
                    accessor: 'displacement-eccentric',
                    className: 'cell-value',
                    width: 55,
                    filterable: false,
                    getProps: (state, rowInfo, column) => {
                      if (
                        rowInfo &&
                        rowInfo.row._original &&
                        rowInfo.row._original.max
                      ) {
                        return {
                          style: maxRowStyle
                        };
                      } else return { style: {} };
                    },
                    aggregate: vals => ({
                      mean: Number(_.mean(vals)),
                      max: Number(_.max(vals))
                    }),
                    Aggregated: row => {
                      if (row.row.type === 'Isometric') {
                        return null;
                      }
                      var values = row.subRows.map(
                        r => r['displacement-eccentric']
                      );
                      if (isNaN(values[0])) {
                        var valuesMean = values.map(p => p.mean);
                        var mean = _.mean(valuesMean);
                        //array
                      } else {
                        mean = _.mean(values);
                      }
                      const { left, right, both } = this.getMaxDissEccValues(
                        row
                      );
                      var maxStr = undefined;
                      if (left !== undefined) {
                        maxStr = (
                          <span className="tooltip-best">
                            <Icon name="angle left"></Icon>
                            {'Right: ' + left.toFixed(2)}
                          </span>
                        );
                      }
                      if (right !== undefined) {
                        maxStr = (
                          <div>
                            {maxStr}
                            <br></br>
                            <span className="tooltip-best">
                              {'Left: ' + right.toFixed(2)}
                              <Icon name="angle right"></Icon>
                            </span>
                          </div>
                        );
                      }
                      if (both !== undefined) {
                        maxStr = (
                          <div>
                            {maxStr}
                            <span className="tooltip-best">
                              <Icon name="angle left"></Icon>
                              {'Both: ' + both.toFixed(2)}
                              <Icon name="angle right"></Icon>
                            </span>
                          </div>
                        );
                      }
                      return (
                        <Tooltip title={maxStr}>
                          <span style={{ height: '50px', cursor: 'pointer' }}>
                            <span style={{ color: '#1F3371', height: '50px' }}>
                              {mean.toFixed(2) + '    '}
                            </span>
                          </span>
                        </Tooltip>
                      );
                    },
                    Cell: row => {
                      if (row.row._original.max) {
                        return <div>{Number(row.value).toFixed(2)}</div>;
                      }
                      if (!isNaN(row.value)) {
                        const { data } = this.state;
                        var maxFiltered = data.filter(d => {
                          return (
                            d.group === row.row.group && d.type === row.row.type
                          );
                        });
                        var maxValues = maxFiltered.map(
                          m => m['displacement-eccentric']
                        );
                        if (maxValues.length > 0) {
                          var max = _.max(maxValues);
                          var pct = row.value / max;
                          if (this.bestDisEccIndex.includes(row.original.id)) {
                            return (
                              <span className="best-power-both">
                                {Number(row.value).toFixed(2)}&#176;
                              </span>
                            );
                          } else if (
                            this.bestLeftDisEccIndex.includes(row.original.id)
                          ) {
                            return (
                              <span className="best-power-left">
                                {Number(row.value).toFixed(2)}&#176;
                              </span>
                            );
                          } else if (
                            this.bestRightDisEccIndex.includes(row.original.id)
                          ) {
                            return (
                              <span className="best-power-right">
                                {Number(row.value).toFixed(2)}&#176;
                              </span>
                            );
                          } else {
                            return (
                              <div style={{ color: this.getColor(pct) }}>
                                {Number(row.value).toFixed(2)}&#176;
                              </div>
                            );
                          }
                        }
                        return <div>{row.value}</div>;
                      } else return null;
                    }
                  }
                ]
              },
              {
                Header: 'Stats',
                columns: [
                  {
                    Header: 'Power to weight(W/kg)',
                    accessor: 'power-to-weight',
                    className: 'cell-value',
                    filterable: false,
                    width: 75,
                    aggregate: vals => Number(_.mean(vals).toFixed(2)),
                    getProps: (state, rowInfo, column) => {
                      if (
                        rowInfo &&
                        rowInfo.row._original &&
                        rowInfo.row._original.max
                      ) {
                        return {
                          style: maxRowStyle
                        };
                      } else return { style: {} };
                    },
                    Cell: row => {
                      if (!isNaN(row.value)) {
                        return <div>{row.value}</div>;
                      } else return null;
                    }
                  },
                  {
                    Header: 'Velocity(m/s)',
                    id: 'velocity',
                    accessor: 'velocity',
                    className: 'cell-value',
                    width: 75,
                    filterable: false,
                    aggregate: vals => Number(_.mean(vals).toFixed(2)),
                    getProps: (state, rowInfo, column) => {
                      if (
                        rowInfo &&
                        rowInfo.row._original &&
                        rowInfo.row._original.max
                      ) {
                        return {
                          style: maxRowStyle
                        };
                      } else return { style: {} };
                    },
                    Cell: row => <div>{row.value}</div>
                  }
                ]
              }
            ]}
            pivotBy={['type', 'group']}
            showPagination={false}
            defaultPageSize={10}
            getTheadProps={getHeaderStyle}
            getTheadGroupProps={getHeaderStyle}
            getTheadTrProps={getHeaderStyle}
            getTrProps={getRowStyle}
            getTrGroupProps={getGroupRowStyle}
            getTdProps={getRowDataStyle}
            expanded={this.state.expanded}
            onExpandedChange={expanded => this.setState({ expanded })}
            filtered={this.state.filtered}
            onFilteredChange={filtered => this.setState({ filtered })}
            sorted={this.state.sorted}
            onSortedChange={sorted => this.setState({ sorted })}
            // className="-striped -highlight"
            className="-highlight"
          />
        </div>
      );
    }

    getData(day, sessionType = 'test') {
      var data = [];
      var newData = getDataForWeight(
        this.athlete.period.summary.exercises[0],
        sessionType
      );
      newData.forEach(d => data.push(d));
      newData = getDataForWeight(
        this.athlete.period.summary.exercises[1],
        sessionType
      );
      newData.forEach(d => data.push(d));
      newData = getDataForWeight(
        this.athlete.period.summary.exercises[2],
        sessionType
      );
      newData.forEach(d => data.push(d));
      var grouped = _.groupBy(data, 'type');
      var gdata = [];
      Object.keys(grouped).forEach(key => {
        grouped[key].sort((a, b) => (a.side < b.side ? 1 : -1));
        grouped[key].sort((a, b) => (a.weight > b.weight ? 1 : -1));
        var gg = _.groupBy(grouped[key], 'group');
        gdata.push({
          type: key,
          group: gg
        });
      });
      console.log('gdata', gdata);
      this.getDeviations(gdata, data);
      this.getMaxRows(gdata, data);
      console.log('data', data);
      return data;
    }

    getMaxForProps = (groupData, side, name) => {
      var side = _.filter(groupData, function(s) {
        return s.side === side;
      });
      var max = _.max(_.map(side, name));
      return max;
    };

    getMaxRows = (groupedTypeData, data) => {
      // * gtd.type: Throw-off, Constant Contact, Isometric
      groupedTypeData.forEach(gtd => {
        // * group: single/double
        Object.keys(gtd.group).forEach(key => {
          var groupData = gtd.group[key];
          if (key === 'single') {
            if (groupData.length <= 2) {
              return;
            }
            // insert 2 rows: Left/Right
            var rowLeft = {};
            var item = _.first(groupData);
            Object.keys(item).forEach(name => {
              if (
                typeof item[name] === 'string' ||
                item[name] instanceof String
              ) {
                rowLeft[name] = item[name];
              } else {
                rowLeft[name] = 0;
              }
            });
            rowLeft.type = gtd.type;
            rowLeft.group = key;
            rowLeft.id = uniqid();
            rowLeft.max = true;
            rowLeft.weight = 999999;
            rowLeft.side = 'Left';
            rowLeft.power = this.getMaxForProps(groupData, 'Left', 'power');
            rowLeft['best:power'] = this.getMaxForProps(
              groupData,
              'Left',
              'best:power'
            );
            rowLeft.force = this.getMaxForProps(groupData, 'Left', 'force');
            rowLeft['best:force'] = this.getMaxForProps(
              groupData,
              'Left',
              'best:force'
            );
            rowLeft.fmax = this.getMaxForProps(groupData, 'Left', 'fmax');
            rowLeft['displacement-eccentric'] = this.getMaxForProps(
              groupData,
              'Left',
              'displacement-eccentric'
            );
            rowLeft['displacement-concentric'] = this.getMaxForProps(
              groupData,
              'Left',
              'displacement-concentric'
            );

            data.push(rowLeft);

            var rowRight = JSON.parse(JSON.stringify(rowLeft));
            rowRight.id = uniqid();
            rowRight.side = 'Right';
            rowRight.power = this.getMaxForProps(groupData, 'Right', 'power');
            rowRight['best:power'] = this.getMaxForProps(
              groupData,
              'Right',
              'best:power'
            );
            rowRight.force = this.getMaxForProps(groupData, 'Right', 'force');
            rowRight['best:force'] = this.getMaxForProps(
              groupData,
              'Right',
              'best:force'
            );
            rowRight.fmax = this.getMaxForProps(groupData, 'Right', 'fmax');
            rowRight['displacement-eccentric'] = this.getMaxForProps(
              groupData,
              'Right',
              'displacement-eccentric'
            );
            rowRight['displacement-concentric'] = this.getMaxForProps(
              groupData,
              'Right',
              'displacement-concentric'
            );
            rowRight['power:deviation'] =
              (1 - rowLeft.power / rowRight.power) * 100;
            rowRight['force:deviation'] =
              (1 - rowLeft.force / rowRight.force) * 100;

            data.push(rowRight);
          }
        });
      });
    };

    getDeviations = (groupedTypeData, data) => {
      groupedTypeData.forEach(gtd => {
        // group: single/double
        Object.keys(gtd.group).forEach(key => {
          var groupData = gtd.group[key];
          if (key === 'single') {
            for (var i = 0; i < groupData.length - 1; i++) {
              var record = groupData[i];
              if (record.side === 'Left') {
                var nextRecord = groupData[i + 1];
                var dev = (1 - record.power / nextRecord.power) * 100;
                data.find(dr => dr.id === record.id)['power:deviation'] = dev;
                data.find(dr => dr.id === nextRecord.id)[
                  'power:deviation'
                ] = dev;
                dev = (1 - record.force / nextRecord.force) * 100;
                data.find(dr => dr.id === record.id)['force:deviation'] = dev;
                data.find(dr => dr.id === nextRecord.id)[
                  'force:deviation'
                ] = dev;
              }
              //every 4 we get the weight deviation
              if (record.side === 'Right' && (i + 1) % 2 === 0 && i >= 3) {
                var record1 = groupData[i - 3];
                var record2 = groupData[i - 2];
                var record3 = groupData[i - 1];
                var record4 = groupData[i];
                dev =
                  (1 -
                    (record1.power + record2.power) /
                      (record3.power + record4.power)) *
                  100;
                data.find(dr => dr.id === record3.id)[
                  'power:deviation:weight'
                ] = dev;
                data.find(dr => dr.id === record4.id)[
                  'power:deviation:weight'
                ] = dev;
                dev =
                  (1 -
                    (record1.force + record2.force) /
                      (record3.force + record4.force)) *
                  100;
                data.find(dr => dr.id === record3.id)[
                  'force:deviation:weight'
                ] = dev;
                data.find(dr => dr.id === record4.id)[
                  'force:deviation:weight'
                ] = dev;
              }
            }
          }
          if (key === 'double') {
            for (i = 0; i < groupData.length - 1; i++) {
              record = groupData[i];
              nextRecord = groupData[i + 1];
              dev = (1 - record.power / nextRecord.power) * 100;
              data.find(dr => dr.id === nextRecord.id)[
                'power:deviation:weight'
              ] = dev;
              dev = (1 - record.force / nextRecord.force) * 100;
              data.find(dr => dr.id === nextRecord.id)[
                'force:deviation:weight'
              ] = dev;
            }
          }
        });
      });
    };
  }
);

function getUniqArrayStr(array, rows) {
  var result = '';
  var splitArray = [];
  _.uniq(array).forEach(a => {
    if (typeof a === 'string' || a instanceof String) {
      var arr = a.split(',');
      arr = arr.map(a => (a = a.trim()));
      if (arr.length > 1) {
        arr.forEach(a => splitArray.push(String(a)));
      } else {
        splitArray.push(String(a));
      }
    } else {
      splitArray.push(String(a));
    }
  });
  _.uniq(splitArray).forEach((v, index) => {
    if (index === 0) {
      result = v;
    } else {
      result = result + ', ' + v;
    }
  });
  return result;
}

function getHeaderStyle() {
  return {
    style: {
      backgroundColor: 'white',
      color: '#004C72',
      fontWeight: '500',
      textAlign: 'center',
      verticalAlign: 'middle',
      boxShadow: 'inset 0 0 0 0 transparent',
      fontSize: '0.98em',
      fontWeight: '400',
      padding: '0px',
      paddingBottom: '3px',
      height: '26px'
    }
  };
}

function getRowStyle(state, rowInfo, column, instance) {
  return {
    style: {
      backgroundColor: 'white',
      borderBottom: '0',
      padding: '0px',
      color: '#8E92A0',
      fontWeight: '500'
    }
  };
}

function getGroupRowStyle() {
  return {
    style: {
      backgroundColor: 'red',
      borderBottom: '0',
      padding: '0px',
      fontWeight: '600',
      color: 'green'
    }
  };
}

function getRowDataStyle(state, rowInfo, column, instance) {
  if (rowInfo !== undefined) {
    if (rowInfo.level === 1) {
      return {
        style: {
          backgroundColor: '#EEF8F9',
          // color: "#86230B",
          borderTop: 'solid 0.1em #C6E2E5',
          alignContent: 'center',
          verticalAlign: 'middle',
          padding: '1px',
          paddingTop: '5px',
          height: '31px',
          fontWeight: '400'
        }
      };
    }
    if (rowInfo.level === 2) {
      return {
        style: {
          backgroundColor: 'white',
          borderBottom: 'solid 0.0em #E0ECFA',
          padding: '0px',
          margin: '0px',
          height: '23px',
          fontWeight: '300'
        }
      };
    }
  } else {
    return {
      style: {
        backgroundColor: 'white',
        // color: "#003871",
        borderBottom: 'solid 0.0em #EEF1F8',
        // fontSize: "0.97em",
        padding: '1px',
        margin: '0px',
        height: '23px'
        // fontWeight: "300"
      }
    };
  }
  return {
    style: {
      backgroundColor: 'white',
      color: '#405399',
      borderBottom: 'solid 0.0em #EEF1F8',
      alignContent: 'center',
      verticalAlign: 'middle',
      padding: '1px',
      paddingTop: '10px',
      height: '40px',
      fontWeight: '500'
    }
  };
}

function getDataForWeight(exercise, sessionType = 'test') {
  var exercises = GetStore().exercises;
  var currentExercise = exercises.find(ex => ex.exercise === exercise.exercise);
  // * we flatten the data
  var results = [];
  exercise.types.forEach(type => {
    type.sessionTypes.forEach(sessionType => {
      sessionType.weights.forEach(weight => {
        weight.sides.forEach(s => {
          var item = {
            id: s.id,
            type: type.type,
            sessionType: sessionType.type,
            exercise: exercise.exercise,
            weight: weight.weight,
            side: s.side,
            max: false,
            exerciseGroup: currentExercise['exercise-group'],
            exerciseClass: currentExercise['exercise-class'],
            exerciseSubClass: currentExercise['exercise-subclass'],
            group: currentExercise['group'],
            bodyPart: currentExercise['body-part']
          };
          //use the data on the weight not the side
          var average = s.average;
          var best = s.best;
          if (s.side === 'Both') {
            average = weight.average;
            best = weight.best;
          }
          average.forEach(a => {
            item[a.name] = Number(a.value.toFixed(2));
            item['unit:' + a.name] = a.unit; // if (a['unit:deviation'] !== undefined) {
          });
          best.forEach(a => {
            if (a.unit === 's') {
              item['best:' + a.name] = Number((a.value * 1000).toFixed(2));
            } else {
              item['best:' + a.name] = Number(a.value.toFixed(2));
            }
          });
          results.push(item);
        });
      });
    });
  });
  return results.filter(ex => ex.sessionType === sessionType);
}

export default ExerciseForDay;
