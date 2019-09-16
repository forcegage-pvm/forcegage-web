import React, { Component } from 'react';
import '../athletePage.css';
import { observer, Observer } from 'mobx-react';
import { GetStore } from '../../../models/store/store';
import { Table, Input, Button, Icon } from 'antd';
import { Link } from 'react-router-dom';

const { Search } = Input;

function selectAthlete(athlete) {
  GetStore().loadAthlete(athlete.id);
  GetStore().state.activeMenuItem = 'analysis';
}

const AthleteColumns = [
  {
    title: 'Name',
    dataIndex: 'fullName',
    key: 'name',
    render: (text, record, index) => (
      <Link to={`../analysis`} onClick={() => selectAthlete(record)}>
        {text}
      </Link>
    ),

    sorter: (a, b) => (a.lastName > b.lastName ? 1 : -1)
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: 'BodyWeight',
    dataIndex: 'bodyWeight',
    key: 'bodyWeight',
    sorter: (a, b) => a.bodyWeight - b.bodyWeight
  },
  {
    title: 'Select',
    key: 'select',
    width: 45,
    height: 20,
    render: (text, record, index) => {
      return (
        <Link to={`../analysis`} onClick={() => selectAthlete(record)}>
          <Button size="small" type="primary">
            <Icon
              style={{ marginTop: '-5px', marginBottom: '5px' }}
              type="user"
            ></Icon>
            Select
          </Button>
        </Link>
      );
    }
  }
];

const AthleteList = observer(
  class AthleteList extends Component {
    constructor(props) {
      super(props);
      this.state = {
        mounted: false,
        search: ''
      };
      // this.setStateFromProps(props);
      this.athletes = GetStore().athletes;
      this.storeState = GetStore().state;
    }

    setStateFromProps = props => {
      this.setState({}, () => {});
    };

    componentWillReceiveProps = props => {
      this.setStateFromProps(props);
    };

    componentDidMount = () => {
      this.setState({
        mounted: true
      });
    };

    rowSelectionAthlete = {
      onChange: (selectedRowKeys, selectedRows) => {
        if (selectedRows.length === 0) {
          this.setState({ SelectedAthletes: [] });
          return;
        }
        this.setState(
          {
            SelectedAthleteIds: selectedRows
          },
          () => {}
        );
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name
      })
    };

    onRowSelect = (record, selected, selectedRows, nativeEvent) => {};

    render() {
      const { search } = this.state;
      if (search !== '') {
        var filtered = this.athletes.filter(a =>
          a.fullName.toUpperCase().includes(search.toUpperCase())
        );
      } else {
        var filtered = this.athletes;
      }

      return (
        <div>
          <Search
            placeholder="Search..."
            style={{ width: 'calc(45vw)', margin: '5px' }}
            onSearch={value => console.log(value)}
            onChange={e => {
              this.setState({ search: e.target.value });
            }}
            enterButton
          />
          <Table
            style={{ width: 'calc(45vw)', height: 'calc(80vh)', margin: '5px' }}
            // rowSelection={this.rowSelectionAthlete}
            columns={AthleteColumns}
            dataSource={filtered}
            bordered={false}
            size="small"
            pagination={true}
            loading={this.storeState.athletesLoading}
          />
        </div>
      );
    }
  }
);

export default AthleteList;
