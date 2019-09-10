import React, { Component } from 'react';
import '../athletePage.css';
import { observer, Observer } from 'mobx-react';
import { GetStore } from '../../../models/store/store';
import { Table, Input } from 'antd';
import { Link } from 'react-router-dom';

const { Search } = Input;

function selectAthlete(athlete) {
  console.log('athlete', athlete);
  GetStore().loadAthlete(athlete.id);
}

const AthleteColumns = [
  {
    title: 'Name',
    dataIndex: 'fullName',
    key: 'name',
    // render: (text, record, index) => <a href="javascript:;" onClick={() => selectAthlete(record)}>{text}</a>,
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
  }
  // {
  //     title: 'Select',
  //     key: 'select',
  //     width: 45,
  //     render: (text, record) => (
  //         <Button type="primary" onClick={() => selectAthlete(record)}>Select</Button>
  //     )
  // },
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
            rowSelection={this.rowSelectionAthlete}
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
