import React, { Component } from 'react';
import { Table, Tag, Icon, Radio } from 'antd';
import '../athletePage.css';
import { observer } from 'mobx-react';
import { GetStore } from '../../../models/store/store';

const WeightSummary = observer(
  class WeightSummary extends Component {
    constructor(props) {
      super(props);
      this.state = {
        mounted: false,
        weights: props.weights,
        data: getDataForWeight(props.weights),
        method: 'average'
      };
      this.setStateFromProps(props);
      this.athlete = GetStore().athlete;
      this.storeState = GetStore().state;
    }

    setStateFromProps = props => {
      this.setState(
        {
          weights: props.weights,
          data: getDataForWeight(props.weights)
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

    methodChange = e => {
      this.setState(
        {
          method: e.target.value
        },
        () => {}
      );
    };

    render() {
      const { method, data } = this.state;
      return (
        <div>
          <Radio.Group
            style={{ marginBottom: '10px' }}
            value={method}
            buttonStyle="solid"
            onChange={this.methodChange}
          >
            <Radio.Button value="average">Average</Radio.Button>
            <Radio.Button value="best">Best</Radio.Button>
          </Radio.Group>
          <Table
            columns={this.getWeightColumns()}
            bordered={false}
            dataSource={data}
            size="small"
            loading={false}
            pagination={false}
            indentSize={0}
            className="weight-table"
          />
        </div>
      );
    }

    isMaxValueSet(text, type) {
      if (text === undefined) return text;
      var value = text.split(' ')[0];
      const { data } = this.state;
      var values = [
        ...new Set(
          data.map(record => {
            if (record[type] !== undefined) {
              var parts = record[type].split(' ');
              return Number(parts[0]);
            }
          })
        )
      ];
      var max = values.Max();
      var isMax = value == max[0];
      return (
        <div>
          {isMax ? (
            <Tag className="tag-max-value">{text}</Tag>
          ) : (
            <div>
              {text}
              <span style={{ fontSize: '1.7ex', color: '#D5B598' }}></span>
            </div>
          )}
        </div>
      );
    }

    isMinValueSet(text, type) {
      if (text === undefined) return text;
      var value = text.split(' ')[0];
      const { data } = this.state;
      var values = [
        ...new Set(
          data.map(record => {
            if (record[type] !== undefined) {
              var parts = record[type].split(' ');
              if (Number(parts[0]) > 0 || Number(parts[0]) < 0) {
                return Number(parts[0]);
              }
            }
          })
        )
      ];
      var max = values.Min();
      var isMax = value == max[0];
      return (
        <div>
          {isMax ? (
            <Tag className="tag-max-value">{text}</Tag>
          ) : (
            <div>
              {text}
              <span style={{ fontSize: '1.7ex', color: '#D5B598' }}></span>
            </div>
          )}
        </div>
      );
    }

    getWeightColumns() {
      const { method } = this.state;
      var columns = [];
      columns.push({
        title: 'Weight',
        dataIndex: 'weight',
        key: 'weight',
        align: 'center',
        render: renderWeight,
        className: 'weight-item'
      });
      columns.push({
        title: 'Side',
        dataIndex: 'side',
        key: 'side',
        align: 'center',
        render(text, record) {
          if (text === 'Right') {
            return {
              props: {
                style: defaultRowStyle
              },
              children: (
                <Tag color="#0B296B">
                  <span style={{ color: 'white', fontWeight: '400' }}>
                    {text}
                  </span>
                </Tag>
              )
            };
          } else {
            return {
              props: {
                style: {
                  lineHeight: '1px',
                  height: '1px',
                  margin: '0px',
                  padding: '0px'
                }
              },
              children: (
                <Tag color="#C8E7FF">
                  <span style={{ color: 'black', fontWeight: '400' }}>
                    {text}
                  </span>
                </Tag>
              )
            };
          }
        }
      });
      columns.push({
        title: 'Power to weight',
        dataIndex: 'power-to-weight',
        key: 'power-to-weight',
        align: 'center'
      });
      columns.push({
        title: 'Power',
        dataIndex: method === 'average' ? 'power' : 'best:power',
        key: method === 'average' ? 'power' : 'best:power',
        align: 'center',
        className: 'best-indicator',
        render: value =>
          this.isMaxValueSet(
            value,
            method === 'average' ? 'power' : 'best:power'
          )
      });
      columns.push({
        title: 'Deviation (from Left)',
        dataIndex:
          method === 'average' ? 'power:deviation' : 'best:power:deviation',
        key: method === 'average' ? 'power:deviation' : 'best:power:deviation',
        align: 'center',
        render: renderDeviation
      });
      columns.push({
        title: 'Force',
        dataIndex: method === 'average' ? 'force' : 'best:force',
        key: method === 'average' ? 'force' : 'best:force',
        align: 'center',
        render: value =>
          this.isMaxValueSet(
            value,
            method === 'average' ? 'force' : 'best:force'
          )
      });
      columns.push({
        title: 'Deviation (from Left)',
        dataIndex:
          method === 'average' ? 'force:deviation' : 'best:force:deviation',
        key: method === 'average' ? 'force:deviation' : 'best:force:deviation',
        align: 'center',
        render: renderDeviation
      });
      columns.push({
        title: 'FMax',
        dataIndex: method === 'average' ? 'fmax' : 'best:fmax',
        key: method === 'average' ? 'fmax' : 'best:fmax',
        align: 'center',
        render: value =>
          this.isMaxValueSet(value, method === 'average' ? 'fmax' : 'best:fmax')
      });
      columns.push({
        title: 'Deviation (from Left)',
        dataIndex:
          method === 'average' ? 'fmax:deviation' : 'best:fmax:deviation',
        key: method === 'average' ? 'fmax:deviation' : 'best:fmax:deviation',
        align: 'center',
        render: renderDeviation
      });
      columns.push({
        title: 'Velocity',
        dataIndex: method === 'average' ? 'velocity' : 'best:velocity',
        key: method === 'average' ? 'velocity' : 'fmax:velocity',
        align: 'velocity',
        render: value =>
          this.isMaxValueSet(
            value,
            method === 'average' ? 'velocity' : 'best:velocity'
          )
      });
      columns.push({
        title: 'Contact time',
        dataIndex: method === 'average' ? 'contact-time' : 'best:contact-time',
        key: method === 'average' ? 'contact-time' : 'best:contact-time',
        align: 'center',
        render: value =>
          this.isMinValueSet(
            value,
            method === 'average' ? 'contact-time' : 'best:contact-time'
          )
      });
      columns.push({
        title: 'Displacement-ecc',
        dataIndex:
          method === 'average'
            ? 'displacement-eccentric'
            : 'best:displacement-eccentric',
        key:
          method === 'average'
            ? 'displacement-eccentric'
            : 'best:displacement-eccentric',
        align: 'center',
        render: value =>
          this.isMaxValueSet(
            value,
            method === 'average'
              ? 'displacement-eccentric'
              : 'best:displacement-eccentric'
          )
      });
      columns.push({
        title: 'Displacement-ecc',
        dataIndex:
          method === 'average'
            ? 'displacement-concentric'
            : 'best:displacement-concentric',
        key:
          method === 'average'
            ? 'displacement-concentric'
            : 'best:displacement-concentric',
        align: 'center',
        render: value =>
          this.isMaxValueSet(
            value,
            method === 'average'
              ? 'displacement-concentric'
              : 'best:displacement-concentric'
          )
      });
      return columns;
    }
  }
);

export default WeightSummary;

const defaultRowStyle = {
  lineHeight: '1px',
  height: '1px',
  margin: '1px',
  padding: '1px'
};

function getDataForWeight(weights) {
  // * we flatten the data
  var results = [];
  weights.forEach(weight => {
    weight.sides.forEach(s => {
      var item = {
        weight: weight.weight,
        side: s.side
      };
      s.average.forEach(a => {
        if (a.unit === 's') {
          item[a.name] = (a.value * 1000).toFixed(2) + ' ms';
        } else {
          item[a.name] = a.value.toFixed(2) + ' ' + a.unit;
        }

        if (a['deviation'] !== undefined) {
          item[a.name + ':deviation'] = (a.deviation * 100).toFixed(2) + '%';
        }
      });
      s.best.forEach(a => {
        if (a.unit === 's') {
          item['best:' + a.name] = (a.value * 1000).toFixed(2) + ' ms';
        } else {
          item['best:' + a.name] = a.value.toFixed(2) + ' ' + a.unit;
        }

        if (a['deviation'] !== undefined) {
          item['best:' + a.name + ':deviation'] =
            (a.deviation * 100).toFixed(2) + '%';
        }
      });
      results.push(item);
    });
  });
  return results;
}

function renderDeviation(text, record) {
  if (text === undefined) {
    return <Icon type="caret-down" />;
  } else {
    return {
      props: {
        style: defaultRowStyle
      },
      children: (
        <Tag color="#D0F3FF">
          <span style={{ color: 'black', fontWeight: '400' }}>{text}</span>
        </Tag>
      )
    };
  }
}

function renderWeight(value, row, index) {
  const render = {
    children: value,
    props: { style: defaultRowStyle }
  };
  if (index % 2 === 0) {
    render.props.rowSpan = 2;
    return render;
  } else {
    render.props.rowSpan = 0;
  }
  return render;
}
