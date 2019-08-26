import React, { Component } from 'react';
import { Tag, Table } from 'antd';

export default class PeriodSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false,
      aggregation: 'best',
      period: props.period
    };
    this.statsProvider = props.statsProvider;
  }

  setStateFromProps = props => {
    const { mounted } = this.state;

    if (mounted) {
      this.setState(
        {
          aggregation: 'best',
          period: props.period
        },
        () => {}
      );
    } else {
      this.state = {
        aggregation: 'best',
        period: props.period
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

  getSessionColumns = () => {
    var columns = [];
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
      title: 'Fmax',
      dataIndex: 'fmax',
      key: 'fmax',
      align: 'center',
      width: '35px'
    });
    columns.push({
      title: 'Force',
      dataIndex: 'force',
      key: 'force',
      align: 'center',
      width: '35px'
    });
    columns.push({
      title: 'Power',
      dataIndex: 'power',
      key: 'power',
      align: 'center',
      width: '35px'
    });
    columns.push({
      title: 'Rfd',
      dataIndex: 'rfd',
      key: 'rfd',
      align: 'center',
      width: '35px'
    });
    columns.push({
      title: 'Velocity',
      dataIndex: 'velocity',
      key: 'velocity',
      align: 'center',
      width: '35px'
    });
    columns.push({
      title: 'Contact time',
      dataIndex: 'contactTime',
      key: 'contactTime',
      align: 'center',
      width: '65px'
    });
    columns.push({
      title: 'Power to weight',
      dataIndex: 'powerToWeight',
      key: 'powerToWeight',
      align: 'center',
      width: '65px'
    });

    return columns;
  };

  render() {
    const { aggregation, data } = this.state;

    // if (aggregation === "best") var agData = this.getBest()
    // if (aggregation === "avg") var agData = this.getAvg()
    // if (aggregation === "max") var agData = this.getMax()
    // if (aggregation === "ol-avg") var agData = this.getOlympic()

    return (
      <div>
        <Table
          columns={this.getSessionColumns()}
          bordered={false}
          dataSource={data}
          size="small"
          pagination={false}
          indentSize={0}
        />
      </div>
    );
  }
}
