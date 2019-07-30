import React from 'react';
import 'antd/dist/antd.css';
import '../../index.css';
import '../app/App.css';
import { Table, Tag } from 'antd';
import ApolloClient, { gql } from 'apollo-boost';
import { Button, Icon } from 'antd';
import { Row } from 'antd';

const client = new ApolloClient({
  uri: 'https://forcegage-gcp.appspot.com/graphql/'
});

const AthleteColumns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <a href="javascript:;">{text}</a>,
    sorter: (a, b) => a.name.length - b.name.length
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: 'BodyWeight',
    dataIndex: 'bodyweight',
    key: 'bodyweight',
    sorter: (a, b) => a.bodyweight - b.bodyweight
  },
  {
    title: 'Gender',
    key: 'tags',
    dataIndex: 'tags',
    render: tags => (
      <span>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </span>
    )
  }
];

export default class SelectAthlete extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      athleteData: [],
      SelectedAthletes: []
    };

    client
      .query({
        headers: { 'Content-Type': 'application/json' },
        query: gql`
          {
            people {
              id
              name
              surname
              age
              gender
              bodyweight
            }
          }
        `
      })
      .then(data => {
        var rowdata = [];
        for (var item in data) {
          var people = data[item];
          for (var person in people.people) {
            var per = people.people[person];
            var athlete = {
              key: per.id,
              name: per.name + ' ' + per.surname,
              age: per.age,
              bodyweight: per.bodyweight,
              tags: [`'` + per.gender + `'`]
            };

            rowdata.push(athlete);
          }
        }
        this.setState({ athleteData: rowdata });
      })
      .catch(error => console.error(error));
  }

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
    const { athleteData, SelectedAthleteIds } = this.state;

    return (
      <React.Fragment>
        <div style={{ marginLeft: '15px', width: '800px' }}>
          <Row>
            <Table
              style={{ width: '700px' }}
              rowSelection={this.rowSelectionAthlete}
              columns={AthleteColumns}
              dataSource={athleteData}
              bordered={false}
              pagination={true}
            />
          </Row>
          <Row style={{ display: 'flex' }}>
            <Button
              type="primary"
              style={{ marginLeft: '550px' }}
              onClick={() => {
                this.props.onSelected(SelectedAthleteIds);
              }}
            >
              Select sessions
              <Icon type="right" />
            </Button>
          </Row>
        </div>
      </React.Fragment>
    );
  }
}
