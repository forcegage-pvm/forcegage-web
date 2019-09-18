import React, { Component } from 'react';
import { Select, Tooltip, Dropdown, Menu, Radio } from 'antd';
import _ from 'lodash';
import { observer } from 'mobx-react';
import { GetStore } from '../../../models/store/store';
import ReactTable from 'react-table';
import { Icon } from 'semantic-ui-react';
import uniqid from 'uniqid';
import { Header, Image, Segment, Sidebar, Button } from 'semantic-ui-react';
import 'react-table/react-table.css';
import '../athletePage.css';
import {
  getUniqArrayStr,
  getTableStyle,
  getHeaderStyle,
  getHeaderFilterStyle,
  getHeaderGroupStyle,
  getRowStyle,
  getRowDataStyle,
  getGroupRowStyle
} from './styles/tableStyles';

const { Option } = Select;

const sortOrder = ['Isometric', 'Throw-off', 'Constant Contact'];
const deviationList = [
  'acceleration',
  'contact-time',
  'displacement-concentric',
  'displacement-eccentric',
  'fmax',
  'force',
  'power',
  'power-to-weight',
  'rfd',
  'time to fmax',
  'time-to-fmax-ec-switchover',
  'velocity'
];

const maxRowStyle = {
  backgroundColor: '#FFF4DD',
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

const ExerciseData = observer(
  class ExerciseData extends Component {
    constructor(props) {
      super(props);
      this.athlete = GetStore().athlete;
      this.state = {
        mounted: false,
        day: props.day,
        exercise: props.exercise,
        isTest: props.isTest,
        drawerVisible: false,
        data: props.isTest
          ? this.getTestData(props.test)
          : this.getData(
              props.day,
              props.exercise,
              props.sessionType === undefined ? 'combined' : props.sessionType
            ),
        sessionType:
          props.sessionType === undefined ? 'combined' : props.sessionType,
        expanded: {
          '0': { '0': {} },
          '1': { '0': {} },
          '2': { '0': {} }
        },
        sorted: [
          {
            id: 'type',
            desc: false
          }
        ],
        maxPower: [],
        deviations: []
      };
      this.storeState = GetStore().state;
      this.exercises = GetStore().exercises;
      this.maxIndexList = [];
    }

    setStateFromProps = props => {
      this.setState(
        {
          day: props.day,
          exercise: props.exercise,
          isTest: props.isTest,
          drawerVisible: false,
          data: props.isTest
            ? this.getTestData(props.test)
            : this.getData(
                props.day,
                props.exercise,
                props.sessionType === undefined ? 'combined' : props.sessionType
              ),
          sessionType:
            props.sessionType === undefined ? 'combined' : props.sessionType
        },
        () => {
          this.removeMaxRows();
        }
      );
    };

    componentWillReceiveProps = props => {
      this.setStateFromProps(props);
    };

    componentDidMount = () => {
      this.setState(
        {
          mounted: true
        },
        () => {
          this.removeMaxRows();
        }
      );
    };

    getColor = value => {
      //value from 0 to 1
      var hue = ((1 - value) * 255).toString(10);
      return ['hsl(', hue, ',90%,40%)'].join('');
    };

    getSideDeviationHeader = () => {
      return (
        <Tooltip title="Deviation from left to right">
          <div className="container">
            <div className="container-content">
              <div className="container-top">Left</div>
              <div className="container-bottom">Right</div>
            </div>
            <div className="container-versus">vs</div>
          </div>
        </Tooltip>
      );
    };

    getWeightDeviationHeader = () => {
      return (
        <Tooltip title="Deviation between weights">
          <div className="container">
            <div className="container-content">
              <div className="container-top">
                <Icon name="chevron down"></Icon>
              </div>
              <div className="container-bottom">Weight</div>
            </div>
          </div>
        </Tooltip>
      );
    };

    getWeightDeviationRender = row => {
      if (row.level <= 1) {
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
              title={`${row.row.weight}kg is ${Math.abs(
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
              title={`${row.row.weight}kg is ${Math.abs(
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
    };

    getSideDeviationRender = row => {
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
              title={`Right is ${Math.abs(row.value.toFixed(0))}%  ${
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
    };

    getAggregate = vals => {
      return {
        mean: Number(_.mean(vals)),
        max: Number(_.max(vals))
      };
    };

    getMaxRowProps = (state, rowInfo, column) => {
      if (rowInfo && rowInfo.row._original && rowInfo.row._original.max) {
        return {
          style: maxRowStyle
        };
      } else return { style: {} };
    };

    getAggregateRender = (row, min = false) => {
      if (
        row.row.type === 'Isometric' &&
        !['force', 'fmax'].includes(row.column.id)
      ) {
        return null;
      }
      var maxes = row.subRows.map(r => r[row.column.id]);
      if (isNaN(maxes[0])) {
        var meanValues = maxes.map(p => p.mean);
        var mean = _.mean(meanValues);
        //array
      } else {
        mean = _.mean(maxes);
      }
      const maxValues = this.getMaxValues(row, row.column.id, min);

      var maxStr = undefined;
      if (maxValues.Left !== undefined) {
        maxStr = (
          <span className="tooltip-best">
            <Icon name="angle left"></Icon>
            {'Right: ' + maxValues.Left.toFixed(2)}
          </span>
        );
      }
      if (maxValues.Right !== undefined) {
        maxStr = (
          <div>
            {maxStr}
            <br></br>
            <span className="tooltip-best">
              {'Left: ' + maxValues.Right.toFixed(2)}
              <Icon name="angle right"></Icon>
            </span>
          </div>
        );
      }
      if (maxValues.Both !== undefined) {
        maxStr = (
          <div>
            {maxStr}
            <span className="tooltip-best">
              <Icon name="angle left"></Icon>
              {'Both: ' + maxValues.Both.toFixed(2)}
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
    };

    getCellRender = (row, unit = '') => {
      const { data } = this.state;
      if (
        row.row.type === 'Isometric' &&
        !['force', 'fmax'].includes(row.column.id)
      ) {
        return null;
      }
      if (row.level <= 1) {
        return <div>{Number(row.value).toFixed(2)}</div>;
      }
      if (row.row._original && row.row._original.max) {
        return <div>{Number(row.value).toFixed(2)}</div>;
      }
      var max = data.find(d => {
        return (
          this.maxIndexList[row.column.id][row.row.side].includes(d.id) &&
          d.group === row.row.group &&
          d.type === row.row.type &&
          d.side === row.row.side
        );
      });
      var pct = 1;
      if (max !== undefined) {
        var pct = row.value / max[row.column.id];
      }
      if (unit === 'degrees') {
        unit = <span>&deg;</span>;
      } else {
        unit = (
          <span
            style={{
              fontSize: '0.58em',
              fontWeight: '400',
              lineHeight: '0.5em',
              verticalAlign: 'baseline',
              position: 'relative',
              color: '#B6A9A5',
              top: '-0.4em'
            }}
          >
            {' ' + unit}
          </span>
        );
      }
      if (
        this.maxIndexList[row.column.id][row.row.side].includes(row.original.id)
      ) {
        return (
          <span className={'best-power-' + row.row.side.toLowerCase()}>
            {Number(row.value).toFixed(2)}
            {unit}
          </span>
        );
      } else {
        return (
          <div style={{ color: this.getColor(pct) }}>
            {Number(row.value).toFixed(2)}
            {unit}
          </div>
        );
      }
    };

    onClick = () => {};

    getMaxValues = (row, type, min = false) => {
      const { data } = this.state;
      var maxList = {};
      var maxValues = { Left: 0, Right: 0, Both: 0 };
      if (this.maxIndexList[type] === undefined) {
        this.maxIndexList[type] = { Left: [], Right: [], Both: [] };
      }
      maxList[type] = { Left: [], Right: [], Both: [] };

      row.row._subRows.forEach(sr => {
        if (sr._subRows !== undefined) {
          sr._subRows.forEach(ssr => {
            maxList[type][ssr.side].push(ssr._original[type]);
          });
        } else {
          maxList[type][sr.side].push(sr._original[type]);
        }
      });
      Object.keys(maxValues).forEach(key => {
        if (min) {
          maxValues[key] = _.minBy(maxList[type][key], function(v) {
            if (v > 0 || v < 0) return v;
          });
        } else {
          maxValues[key] = _.max(maxList[type][key]);
        }
        var maxItem = data.find(d => d[type] == maxValues[key]);
        if (maxItem !== undefined) {
          if (_.indexOf(this.maxIndexList[type][key], maxItem.id) < 0) {
            this.maxIndexList[type][key].push(maxItem.id);
          }
        }
      });
      return maxValues;
    };

    removeMaxRows = () => {
      const { data } = this.state;
      var maxRows = data.filter(d => d.max === true);
      var nonMaxRows = _.takeWhile(data, ['max', false]);
      this.setState({
        data: nonMaxRows,
        maxRows: maxRows
      });
    };
    addMaxRows = () => {
      const { data, maxRows } = this.state;
      maxRows.forEach(m => data.push(m));
      this.setState({
        data: data,
        maxRows: []
      });
    };

    handleDeviationChange = value => {
      if (value.length == 0) {
        this.removeMaxRows();
      } else {
        this.addMaxRows();
      }
      this.setState({ deviations: value });
    };

    HorizontalSidebar = ({ animation, direction, visible }) => {
      const { day, exercise, sessionType, isTest } = this.state;

      return (
        <Sidebar
          as={Segment}
          animation={animation}
          direction={direction}
          visible={visible}
        >
          <div
            style={{
              marginBottom: '10px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <span>
              <Select
                mode="multiple"
                style={{ marginLeft: '0px', width: '450px' }}
                placeholder="Show deviations"
                onChange={this.handleDeviationChange}
              >
                <Option key={'power'}>Power</Option>
                <Option key={'force'}>Force</Option>
                <Option key={'acceleration'}>Acceleration</Option>
                <Option key={'velocity'}>Velocity</Option>
                <Option key={'displacement'}>Displacement</Option>
                <Option key={'power-to-weight'}>Power to weight</Option>
                <Option key={'contact-time'}>Contact Time</Option>
              </Select>
              {!isTest && (
                <Radio.Group
                  value={sessionType}
                  buttonStyle="solid"
                  size="default"
                  style={{ marginLeft: '15px' }}
                  onChange={e => {
                    this.setState(
                      {
                        sessionType: e.target.value,
                        data: this.getData(day, exercise, e.target.value),
                        drawerVisible: true
                      },
                      () => {
                        this.removeMaxRows();
                      }
                    );
                  }}
                >
                  <Radio.Button value="test">Test</Radio.Button>
                  <Radio.Button value="exercise">Exercise</Radio.Button>
                  <Radio.Button value="combined">Combined</Radio.Button>
                </Radio.Group>
              )}
            </span>
          </div>
        </Sidebar>
      );
    };

    render() {
      const {
        day,
        data,
        deviations,
        exercise,
        sessionType,
        isTest,
        drawerVisible
      } = this.state;

      if (this.athlete.loaded) {
        var dayData = this.athlete.period.exerciseDays.find(
          d => day === d.date.toISOString().slice(0, 10)
        );
      }
      if (sessionType !== 'combined') {
        var sortedData = data.filter(d => d.sessionType === sessionType);
      } else {
        var sortedData = data;
      }
      sortedData.sort((a, b) => (a.side < b.side ? 1 : -1));
      sortedData.sort((a, b) => (a.weight > b.weight ? 1 : -1));

      return (
        <div style={{ border: 'none' }}>
          {/* <Button onClick={() => {
            this.setState({ drawerVisible: true });
          }}>push me</Button> */}
          <Sidebar.Pushable
            as={Segment}
            onClick={() => {
              if (drawerVisible) {
                this.setState({ drawerVisible: false });
              }
            }}
            style={{ border: 'none' }}
          >
            <this.HorizontalSidebar
              animation={'overlay'}
              direction={'top'}
              width="very thin"
              visible={drawerVisible}
              onHide={() => this.setState({ drawerVisible: false })}
            />
            <Sidebar.Pusher dimmed={drawerVisible}>
              <Segment basic>
                <ReactTable
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
                        {
                          Header: 'Type',
                          id: 'type',
                          width: 150,
                          Pivot: cellInfo => {
                            if (cellInfo.isExpanded) {
                              return (
                                <div className="expand">
                                  <div className="expand-icon">
                                    <i className="fa fa-caret-down"></i>
                                  </div>
                                  <div className="expand-value">
                                    {cellInfo.value}
                                  </div>
                                </div>
                              );
                            } else {
                              return (
                                <div className="expand">
                                  <div className="expand-icon">
                                    <i className="fa fa-caret-right"></i>
                                  </div>
                                  <div className="expand-value">
                                    {cellInfo.value}
                                  </div>
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
                                  <option key={type} value={type}>
                                    {type}
                                  </option>
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
                                    <i className="fa fa-caret-right"></i>
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
                                  <option key={group} value={group}>
                                    {group}
                                  </option>
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
                          getProps: this.getMaxRowProps,
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
                                  <span
                                    className="best-power-left"
                                    style={padding}
                                  >
                                    {'Max'}
                                  </span>
                                );
                              } else if (row.row.side === 'Right') {
                                return (
                                  <span
                                    className="best-power-right"
                                    style={padding}
                                  >
                                    {'Max'}
                                  </span>
                                );
                              }
                              return (
                                <span
                                  className="best-power-both"
                                  style={padding}
                                >
                                  {'Max'}
                                </span>
                              );
                            }
                            return (
                              <Dropdown
                                trigger={['click']}
                                overlay={menuWeight}
                                style={{
                                  color: 'white',
                                  backgroundColor: 'red'
                                }}
                              >
                                <span
                                  className="tag-weight"
                                  style={{ cursor: 'pointer' }}
                                >
                                  {row.value}
                                </span>
                              </Dropdown>
                            );
                          },
                          filterMethod: (filter, row) => {
                            if (filter.value === 'all' || row._aggregated) {
                              return true;
                            }
                            var rowValue = row[filter.id];
                            if (
                              typeof rowValue === 'string' ||
                              rowValue instanceof String
                            ) {
                              return row[filter.id] === filter.value;
                            } else {
                              return String(row[filter.id]) === filter.value;
                            }
                          },
                          Filter: ({ filter, onChange }) => {
                            this.resetMaxIndexes();
                            var weights = [
                              ...new Set(
                                data.map(x => {
                                  if (x.weight !== 999999) {
                                    return Number(x.weight);
                                  }
                                })
                              )
                            ];
                            weights.sort((a, b) => (a > b ? 1 : -1));
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
                          getProps: this.getMaxRowProps,
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
                      columns: [
                        {
                          Header: (
                            <Dropdown
                              trigger={['click']}
                              overlay={menu}
                              style={{ color: 'white', backgroundColor: 'red' }}
                            >
                              <div style={{ cursor: 'pointer' }}>
                                Avg
                                <Icon
                                  style={{ marginLeft: '5px', color: 'red' }}
                                  name="chart line"
                                />
                              </div>
                            </Dropdown>
                          ),
                          filterable: false,
                          headerClassName: 'header-avg',
                          accessor: 'power',
                          filterable: false,
                          width: 65,
                          className: 'cell-value',
                          getProps: this.getMaxRowProps,
                          aggregate: this.getAggregate,
                          Aggregated: row => this.getAggregateRender(row),
                          Cell: row => this.getCellRender(row),
                          Filter: ({ filter, onChange }) => {
                            return (
                              <div style={{ backgroundColor: 'white' }}></div>
                            );
                          }
                        },
                        {
                          Header: 'Max',
                          headerClassName: 'header-max',
                          accessor: 'best:power',
                          filterable: false,
                          width: 65,
                          className: 'cell-value',
                          getProps: this.getMaxRowProps,
                          aggregate: this.getAggregate,
                          Aggregated: row => this.getAggregateRender(row),
                          Cell: row => this.getCellRender(row),
                          Filter: () => {
                            return '';
                          }
                        },
                        {
                          Header: this.getSideDeviationHeader(),
                          filterable: false,
                          accessor: 'power:deviation',
                          show: deviations.includes('power'),
                          width: 48,
                          aggregate: vals => Number(_.mean(vals).toFixed(2)),
                          getProps: this.getMaxRowProps,
                          Cell: this.getSideDeviationRender
                        },
                        {
                          Header: this.getWeightDeviationHeader(),
                          filterable: false,
                          accessor: 'power:deviation:weight',
                          show: deviations.includes('power'),
                          width: 42,
                          aggregate: vals => Number(_.mean(vals).toFixed(2)),
                          getProps: this.getMaxRowProps,
                          Cell: this.getWeightDeviationRender
                        }
                      ]
                    },
                    {
                      Header: 'Force(kgf)',
                      columns: [
                        {
                          Header: 'Avg',
                          headerClassName: 'header-avg',
                          accessor: 'force',
                          width: 60,
                          filterable: false,
                          className: 'cell-value',
                          getProps: this.getMaxRowProps,
                          aggregate: this.getAggregate,
                          Aggregated: row => this.getAggregateRender(row),
                          Cell: row => this.getCellRender(row)
                        },
                        {
                          Header: 'Max',
                          accessor: 'fmax',
                          headerClassName: 'header-max',
                          width: 60,
                          filterable: false,
                          className: 'cell-value',
                          getProps: this.getMaxRowProps,
                          aggregate: this.getAggregate,
                          Aggregated: row => this.getAggregateRender(row),
                          Cell: row => this.getCellRender(row)
                        },
                        {
                          Header: this.getSideDeviationHeader(),
                          filterable: false,
                          accessor: 'force:deviation',
                          show: deviations.includes('force'),
                          width: 48,
                          aggregate: vals => Number(_.mean(vals).toFixed(2)),
                          getProps: this.getMaxRowProps,
                          Cell: this.getSideDeviationRender
                        },
                        {
                          Header: this.getWeightDeviationHeader(),
                          filterable: false,
                          accessor: 'power:deviation:weight',
                          show: deviations.includes('force'),
                          width: 42,
                          aggregate: vals => Number(_.mean(vals).toFixed(2)),
                          getProps: this.getMaxRowProps,
                          Cell: this.getWeightDeviationRender
                        }
                      ]
                    },
                    {
                      Header: 'Displacement (degrees)',
                      columns: [
                        {
                          Header: 'Conc',
                          accessor: 'displacement-concentric',
                          className: 'cell-value',
                          headerClassName: 'header-avg',
                          filterable: false,
                          width: 55,
                          getProps: this.getMaxRowProps,
                          aggregate: this.getAggregate,
                          Aggregated: row => this.getAggregateRender(row),
                          Cell: row => this.getCellRender(row, 'degrees')
                        },
                        {
                          Header: this.getSideDeviationHeader(),
                          filterable: false,
                          accessor: 'displacement-concentric:deviation',
                          show: deviations.includes('displacement'),
                          width: 48,
                          aggregate: vals => Number(_.mean(vals).toFixed(2)),
                          getProps: this.getMaxRowProps,
                          Cell: this.getSideDeviationRender
                        },
                        {
                          Header: this.getWeightDeviationHeader(),
                          filterable: false,
                          accessor: 'displacement-concentric:deviation:weight',
                          show: deviations.includes('displacement'),
                          width: 42,
                          aggregate: vals => Number(_.mean(vals).toFixed(2)),
                          getProps: this.getMaxRowProps,
                          Cell: this.getWeightDeviationRender
                        },
                        {
                          Header: 'Ecc',
                          accessor: 'displacement-eccentric',
                          headerClassName: 'header-avg',
                          className: 'cell-value',
                          width: 55,
                          filterable: false,
                          getProps: this.getMaxRowProps,
                          aggregate: this.getAggregate,
                          Aggregated: row => this.getAggregateRender(row),
                          Cell: row => this.getCellRender(row, 'degrees')
                        },
                        {
                          Header: this.getSideDeviationHeader(),
                          filterable: false,
                          accessor: 'displacement-eccentric:deviation',
                          show: deviations.includes('displacement'),
                          width: 48,
                          aggregate: vals => Number(_.mean(vals).toFixed(2)),
                          getProps: this.getMaxRowProps,
                          Cell: this.getSideDeviationRender
                        },
                        {
                          Header: this.getWeightDeviationHeader(),
                          filterable: false,
                          accessor: 'displacement-eccentric:deviation:weight',
                          show: deviations.includes('displacement'),
                          width: 42,
                          aggregate: vals => Number(_.mean(vals).toFixed(2)),
                          getProps: this.getMaxRowProps,
                          Cell: this.getWeightDeviationRender
                        }
                      ]
                    },
                    {
                      Header: 'Power to weight(W/kg)',
                      columns: [
                        {
                          Header: 'Avg',
                          accessor: 'power-to-weight',
                          className: 'cell-value',
                          headerClassName: 'header-avg',
                          filterable: false,
                          width: 75,
                          getProps: this.getMaxRowProps,
                          aggregate: this.getAggregate,
                          Aggregated: row => this.getAggregateRender(row),
                          Cell: row => this.getCellRender(row)
                        },
                        {
                          Header: 'Max',
                          headerClassName: 'header-max',
                          accessor: 'best:power-to-weight',
                          filterable: false,
                          width: 65,
                          className: 'cell-value',
                          getProps: this.getMaxRowProps,
                          aggregate: this.getAggregate,
                          Aggregated: row => this.getAggregateRender(row),
                          Cell: row => this.getCellRender(row),
                          Filter: () => {
                            return '';
                          }
                        },
                        {
                          Header: this.getSideDeviationHeader(),
                          filterable: false,
                          accessor: 'power-to-weight:deviation',
                          show: deviations.includes('power-to-weight'),
                          width: 48,
                          aggregate: vals => Number(_.mean(vals).toFixed(2)),
                          getProps: this.getMaxRowProps,
                          Cell: this.getSideDeviationRender
                        },
                        {
                          Header: this.getWeightDeviationHeader(),
                          filterable: false,
                          accessor: 'power-to-weight:deviation:weight',
                          show: deviations.includes('power-to-weight'),
                          width: 48,
                          aggregate: vals => Number(_.mean(vals).toFixed(2)),
                          getProps: this.getMaxRowProps,
                          Cell: this.getWeightDeviationRender
                        }
                      ]
                    },
                    {
                      Header: 'Acceleration (m/s2)',
                      columns: [
                        {
                          Header: 'Avg',
                          accessor: 'acceleration',
                          className: 'cell-value',
                          headerClassName: 'header-avg',
                          filterable: false,
                          width: 75,
                          getProps: this.getMaxRowProps,
                          aggregate: this.getAggregate,
                          Aggregated: row => this.getAggregateRender(row),
                          Cell: row => this.getCellRender(row)
                        },
                        {
                          Header: 'Max',
                          headerClassName: 'header-max',
                          accessor: 'best:acceleration',
                          filterable: false,
                          width: 65,
                          className: 'cell-value',
                          getProps: this.getMaxRowProps,
                          aggregate: this.getAggregate,
                          Aggregated: row => this.getAggregateRender(row),
                          Cell: row => this.getCellRender(row),
                          Filter: () => {
                            return '';
                          }
                        },
                        {
                          Header: this.getSideDeviationHeader(),
                          filterable: false,
                          accessor: 'acceleration:deviation',
                          show: deviations.includes('acceleration'),
                          width: 48,
                          aggregate: vals => Number(_.mean(vals).toFixed(2)),
                          getProps: this.getMaxRowProps,
                          Cell: this.getSideDeviationRender
                        },
                        {
                          Header: this.getWeightDeviationHeader(),
                          filterable: false,
                          accessor: 'acceleration:deviation:weight',
                          show: deviations.includes('acceleration'),
                          width: 48,
                          aggregate: vals => Number(_.mean(vals).toFixed(2)),
                          getProps: this.getMaxRowProps,
                          Cell: this.getWeightDeviationRender
                        }
                      ]
                    },
                    {
                      Header: 'Velocity(m/s)',
                      columns: [
                        {
                          Header: 'Avg',
                          id: 'velocity',
                          accessor: 'velocity',
                          className: 'cell-value',
                          headerClassName: 'header-avg',
                          width: 50,
                          filterable: false,
                          getProps: this.getMaxRowProps,
                          aggregate: this.getAggregate,
                          Aggregated: row => this.getAggregateRender(row, true),
                          Cell: row => this.getCellRender(row)
                        },
                        {
                          Header: this.getSideDeviationHeader(),
                          filterable: false,
                          accessor: 'velocity:deviation',
                          show: deviations.includes('velocity'),
                          width: 48,
                          aggregate: vals => Number(_.mean(vals).toFixed(2)),
                          getProps: this.getMaxRowProps,
                          Cell: this.getSideDeviationRender
                        },
                        {
                          Header: this.getWeightDeviationHeader(),
                          filterable: false,
                          accessor: 'velocity:deviation:weight',
                          show: deviations.includes('velocity'),
                          width: 48,
                          aggregate: vals => Number(_.mean(vals).toFixed(2)),
                          getProps: this.getMaxRowProps,
                          Cell: this.getWeightDeviationRender
                        }
                      ]
                    },
                    {
                      Header: 'Contact Time(s)',
                      columns: [
                        {
                          Header: 'Avg',
                          id: 'contact-time',
                          accessor: 'contact-time',
                          className: 'cell-value',
                          headerClassName: 'header-avg',
                          width: 50,
                          filterable: false,
                          getProps: this.getMaxRowProps,
                          aggregate: this.getAggregate,
                          Aggregated: row => this.getAggregateRender(row, true),
                          Cell: row => this.getCellRender(row)
                        },
                        {
                          Header: this.getSideDeviationHeader(),
                          filterable: false,
                          accessor: 'contact-time:deviation',
                          show: deviations.includes('contact-time'),
                          width: 48,
                          aggregate: vals => Number(_.mean(vals).toFixed(2)),
                          getProps: this.getMaxRowProps,
                          Cell: this.getSideDeviationRender
                        },
                        {
                          Header: this.getWeightDeviationHeader(),
                          filterable: false,
                          accessor: 'contact-time:deviation:weight',
                          show: deviations.includes('contact-time'),
                          width: 48,
                          aggregate: vals => Number(_.mean(vals).toFixed(2)),
                          getProps: this.getMaxRowProps,
                          Cell: this.getWeightDeviationRender
                        }
                      ]
                    }
                  ]}
                  pivotBy={['type', 'group']}
                  showPagination={false}
                  defaultPageSize={10}
                  minRows={17}
                  sortable={false}
                  resizable={false}
                  getTheadProps={getHeaderStyle}
                  getTableProps={getTableStyle}
                  getProps={getTableStyle}
                  getTheadGroupProps={getHeaderGroupStyle}
                  getTheadFilterThProps={getHeaderFilterStyle}
                  getTheadTrProps={getHeaderStyle}
                  getTrProps={getRowStyle}
                  getTrGroupProps={getGroupRowStyle}
                  getTdProps={getRowDataStyle}
                  expanded={this.state.expanded}
                  onExpandedChange={expanded => {
                    this.setState({ expanded });
                  }}
                  filtered={this.state.filtered}
                  onFilteredChange={filtered => this.setState({ filtered })}
                  sorted={this.state.sorted}
                  onSortedChange={sorted => this.setState({ sorted })}
                  className="data-table"
                  style={{ height: isTest ? 'calc(85vh)' : 'calc(85vh)' }}
                />{' '}
              </Segment>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </div>
      );
    }

    resetMaxIndexes() {
      Object.keys(this.maxIndexList).forEach(key => {
        Object.keys(this.maxIndexList[key]).forEach(type => {
          this.maxIndexList[key][type] = [];
        });
      });
    }

    getTestData(test) {
      var gdata = [];
      var data = [];
      test.summary.exercises.forEach(exercise => {
        var edata = getDataForWeight(exercise, 'test');
        edata.forEach(d => data.push(d));
      });
      var grouped = _.groupBy(data, 'type');
      Object.keys(grouped).forEach(key => {
        grouped[key].sort((a, b) => (a.side < b.side ? 1 : -1));
        grouped[key].sort((a, b) => (a.weight > b.weight ? 1 : -1));
        var gg = _.groupBy(grouped[key], 'group');
        gdata.push({
          type: key,
          group: gg
        });
      });
      this.getDeviations(gdata, data);
      this.getMaxRows(gdata, data);
      return data;
    }

    getData(day, exercise, sessionType) {
      var data = getDataForWeight(exercise, sessionType);
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
                deviationList.forEach(d => {
                  var dev = (1 - record[d] / nextRecord[d]) * 100;
                  data.find(dr => dr.id === record.id)[`${d}:deviation`] = dev;
                  data.find(dr => dr.id === nextRecord.id)[
                    `${d}:deviation`
                  ] = dev;
                });
              }
              //every 4 we get the weight deviation
              if (record.side === 'Right' && (i + 1) % 2 === 0 && i >= 3) {
                var record1 = groupData[i - 3];
                var record2 = groupData[i - 2];
                var record3 = groupData[i - 1];
                var record4 = groupData[i];
                deviationList.forEach(d => {
                  var dev =
                    (1 -
                      (record1[d] + record2[d]) / (record3[d] + record4[d])) *
                    100;
                  data.find(dr => dr.id === record3.id)[
                    `${d}:deviation:weight`
                  ] = dev;
                  data.find(dr => dr.id === record4.id)[
                    `${d}:deviation:weight`
                  ] = dev;
                });
              }
            }
          }
          if (key === 'double') {
            for (i = 0; i < groupData.length - 1; i++) {
              record = groupData[i];
              nextRecord = groupData[i + 1];

              deviationList.forEach(d => {
                var dev = (1 - record[d] / nextRecord[d]) * 100;
                data.find(dr => dr.id === nextRecord.id)[
                  `${d}:deviation:weight`
                ] = dev;
              });
            }
          }
        });
      });
    };
  }
);

function getDataForWeight(exercise, sessionType) {
  var exercises = GetStore().exercises;
  var currentExercise = exercises.find(ex => ex.exercise === exercise.exercise);
  // * we flatten the data
  var results = [];

  if (sessionType === 'combined') {
    exercise.types.forEach(type => {
      type.summary.weights.forEach(weight => {
        weight.sides.forEach(s => {
          var item = {
            id: s.id,
            type: type.type,
            sessionType: 'combined',
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
    return results;
  }

  exercise.types.forEach(type => {
    type.sessionTypes.forEach(sTypes => {
      sTypes.weights.forEach(weight => {
        weight.sides.forEach(s => {
          var item = {
            id: s.id,
            type: type.type,
            sessionType: sTypes.type,
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
  if (sessionType !== 'combined') {
    return results.filter(ex => ex.sessionType === sessionType);
  }
  return results;
}

function handleMenuClick(e) {}

const menu = (
  <Menu onClick={handleMenuClick}>
    <Menu.Item key="1">
      <Icon style={{ marginLeft: '0px', color: 'grey' }} name="chart line" />
      Across Weights
    </Menu.Item>
  </Menu>
);

const menuWeight = (
  <Menu onClick={handleMenuClick}>
    <Menu.Item key="1">
      <Icon style={{ marginLeft: '0px', color: 'grey' }} name="chart line" />
      Over Time - Power
    </Menu.Item>
    <Menu.Item key="2">
      <Icon style={{ marginLeft: '0px', color: 'grey' }} name="chart line" />
      Over Time - Power(Max)
    </Menu.Item>
    <Menu.Item key="3">
      <Icon style={{ marginLeft: '0px', color: 'grey' }} name="chart line" />
      Over Time - Force
    </Menu.Item>
    <Menu.Item key="4">
      <Icon style={{ marginLeft: '0px', color: 'grey' }} name="chart line" />
      Over Time - Force(Max)
    </Menu.Item>
  </Menu>
);

export default ExerciseData;
