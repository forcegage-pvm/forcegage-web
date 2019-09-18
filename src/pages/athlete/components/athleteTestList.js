import React, { Component } from 'react';
import ReactTable from 'react-table';
import { observer } from 'mobx-react';
import { GetStore } from '../../../models/store/store';
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

const AthleteTestList = observer(
  class AthleteTestList extends Component {
    constructor(props) {
      super(props);
      this.state = {
        mounted: false,
        onSelectTest: props.onSelectTest,
        expanded: {
          '0': { '0': {}, '1': {} },
          '1': { '0': {}, '1': {} },
          '2': { '0': {}, '1': {} }
        },
        sorted: [
          {
            id: 'type',
            desc: false
          }
        ]
      };

      this.athlete = GetStore().athlete;
      this.tests = this.athlete.tests;
      this.storeState = GetStore().state;
    }
    render() {
      return (
        <div>
          <ReactTable
            data={this.tests}
            columns={[
              {
                Header: 'Exercise',
                columns: [
                  {
                    Header: 'Class',
                    accessor: 'class',
                    width: 150,
                    show: true,
                    Pivot: cellInfo => {
                      if (cellInfo.isExpanded) {
                        return (
                          <div className="expand">
                            <div className="expand-icon">
                              <i className="fa fa-caret-down"></i>
                            </div>
                            <div className="expand-value">{cellInfo.value}</div>
                          </div>
                        );
                      } else {
                        return (
                          <div className="expand">
                            <div className="expand-icon">
                              <i className="fa fa-caret-right"></i>
                            </div>
                            <div className="expand-value">{cellInfo.value}</div>
                          </div>
                        );
                      }
                    },
                    aggregate: vals => getUniqArrayStr(vals)
                  },
                  {
                    Header: 'Group',
                    id: 'group',
                    width: 110,
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
                    accessor: d => d.group,
                    aggregate: vals => {
                      return getUniqArrayStr(vals);
                    }
                  },
                  {
                    Header: 'Type',
                    id: 'complete',
                    width: 120,
                    accessor: d => d.complete,
                    aggregate: (vals, rows) => {
                      return <div></div>;
                    },
                    Cell: row => {
                      if (row.value === true) {
                        return (
                          <div style={{ textAlign: 'left' }}>Complete</div>
                        );
                      } else {
                        return (
                          <div style={{ textAlign: 'left' }}>
                            Neuro-muscular
                          </div>
                        );
                      }
                    }
                  },
                  {
                    Header: 'Test',
                    id: 'test',
                    width: 100,
                    accessor: d => d.test,
                    aggregate: (vals, rows) => {
                      return <div></div>;
                    },
                    Cell: row => {
                      if (row.level > 1) {
                        return (
                          <div
                            onClick={() => {
                              this.state.onSelectTest(row.row.test);
                            }}
                            className={
                              row.row.complete
                                ? 'tag-exercise-complete'
                                : 'tag-exercise-neuro'
                            }
                            style={{ cursor: 'pointer' }}
                          >
                            {row.value}
                          </div>
                        );
                      }
                      return <div></div>;
                    }
                  },
                  {
                    Header: 'Exercise',
                    id: 'exercise',
                    width: 180,
                    accessor: d => d.exercise,
                    aggregate: (vals, rows) => {
                      return <div></div>;
                    }
                  }
                ]
              },
              {
                Header: 'Force',
                columns: [
                  {
                    Header: 'Isometric',
                    id: 'max[0].force',
                    width: 80,
                    accessor: d => d.max[0].force,
                    Cell: row => {
                      if (isNaN(row.value)) {
                        return <div></div>;
                      }
                      return (
                        <span className="best-power-test">
                          {Number(row.value).toFixed(2)}
                        </span>
                      );
                    },
                    aggregate: (vals, rows) => {
                      return <div></div>;
                    }
                  },
                  {
                    Header: 'Constant Contact',
                    id: 'max[1].force',
                    width: 80,
                    accessor: d => d.max[1].force,
                    Cell: row => {
                      if (isNaN(row.value)) {
                        return <div></div>;
                      }
                      return (
                        <span className="best-power-test">
                          {Number(row.value).toFixed(2)}
                        </span>
                      );
                    },
                    aggregate: (vals, rows) => {
                      return <div></div>;
                    }
                  },
                  {
                    Header: 'Throw-off',
                    id: 'max[2].force',
                    width: 80,
                    accessor: d => d.max[2].force,
                    Cell: row => {
                      if (isNaN(row.value)) {
                        return <div></div>;
                      }
                      return (
                        <span className="best-power-test">
                          {Number(row.value).toFixed(2)}
                        </span>
                      );
                    },
                    aggregate: (vals, rows) => {
                      return <div></div>;
                    }
                  }
                ]
              }
            ]}
            pivotBy={['class', 'group']}
            showPagination={false}
            defaultPageSize={10}
            minRows={17}
            filterable={false}
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
            className="data-table-test"
          ></ReactTable>
        </div>
      );
    }
  }
);

export default AthleteTestList;
