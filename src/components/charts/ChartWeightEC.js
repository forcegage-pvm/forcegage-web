import React from 'react';
import 'antd/dist/antd.css';
import { Table, Tag } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Label,
  ResponsiveContainer
} from 'recharts';
import { Icon } from 'semantic-ui-react';
import '../app/App.css';
import './charts.css';

const classStates = ['Total', 'Concentric', 'Eccentric'];
const { CheckableTag } = Tag;

export default class ChartWeightEC extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      title: props.title,
      unit: props.unit,
      selectedClassStates: ['Total'],
      mode: 'Total',
      showEC: props.showEC
    };
  }

  shouldComponentUpdate(nextProps) {
    var sameProps = nextProps == this.props;
    if (!sameProps) {
      this.setState({ data: nextProps.data });
    }
    return !sameProps;
  }

  handleModeChange = e => {
    const mode = e.target.value;
    this.setState({ mode });
  };

  handleClassStateChange = (tag, checked) => {
    const { selectedClassStates } = this.state;
    const nextSelectedTags = checked
      ? [...selectedClassStates, tag]
      : selectedClassStates.filter(t => t !== tag);
    this.setState(
      {
        selectedClassStates: nextSelectedTags
      },
      () => {
        this.forceUpdate();
      }
    );
  };

  GetClassStateTag(tag) {
    const { selectedClassStates } = this.state;
    var isChecked = selectedClassStates.indexOf(tag) > -1;
    if (isChecked) {
      return (
        <CheckableTag
          style={{
            background: '#E74B15',
            paddingLeft: '10px',
            paddingRight: '10px',
            marginLeft: '2px',
            marginRight: '2px',
            size: '40px'
          }}
          key={tag}
          checked={isChecked}
          onChange={checked => this.handleClassStateChange(tag, checked)}
        >
          {tag}
        </CheckableTag>
      );
    } else {
      return (
        <CheckableTag
          style={{
            background: '#f1ebed',
            paddingLeft: '10px',
            paddingRight: '10px',
            marginLeft: '2px',
            marginRight: '2px'
          }}
          key={tag}
          checked={isChecked}
          onChange={checked => this.handleClassStateChange(tag, checked)}
        >
          {tag}
        </CheckableTag>
      );
    }
  }

  isMaxValue(value, side) {
    const { data, unit } = this.state;
    var record = data.find(function(record) {
      return record[side].total == value;
    });
    if (record !== undefined) {
      return (
        <div>
          {record[side].max ? (
            <Tag className="tag-max-value">
              {Number(value).toFixed(2) + ' ' + unit}
            </Tag>
          ) : (
            <div>
              {Number(value).toFixed(2) + ' '}
              <span style={{ fontSize: '1.7ex', color: '#D5B598' }}>
                {unit}
              </span>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div>
          {Number(value).toFixed(2) + ' '}
          <span style={{ fontSize: '1.7ex', color: '#D5B598' }}>{unit}</span>
        </div>
      );
    }
  }
  isValuevsMax(value, side) {
    const { data } = this.state;
    var record = data.find(function(record) {
      return record[side].devFromMax == value;
    });
    if (record !== undefined) {
      return (
        <div>
          {record[side].maxDevFromMax ? (
            <Tag className="tag-max-value">
              {Number(Number(value) * 100).toFixed(2) + '%'}
            </Tag>
          ) : (
            Number(Number(value) * 100).toFixed(2) + '%'
          )}
        </div>
      );
    } else {
      return Number(Number(value) * 100).toFixed(2) + '%';
    }
  }

  isLvsRMax(value) {
    const { data } = this.state;
    var record = data.find(function(record) {
      return record.devSide == value;
    });
    return (
      <div>
        {record.maxDevSide ? (
          <Tag className="tag-max-value">
            {Number(Number(value) * 100).toFixed(2) + '%'}
          </Tag>
        ) : (
          Number(Number(value) * 100).toFixed(2) + '%'
        )}
      </div>
    );
  }

  isDownMax(value) {
    const { data } = this.state;
    var record = data.find(function(record) {
      return record.devDown == value;
    });
    if (record !== undefined) {
      return (
        <div>
          {record.devDownMax ? (
            <Tag className="tag-max-value">
              {Number(Number(value) * 100).toFixed(2) + '%'}
            </Tag>
          ) : (
            Number(Number(value) * 100).toFixed(2) + '%'
          )}
        </div>
      );
    } else {
      return Number(Number(value) * 100).toFixed(2) + '%';
    }
  }

  isdevLvsRMax(value) {
    const { data } = this.state;
    var record = data.find(function(record) {
      return record.devSideMax == value;
    });
    return (
      <div>
        {record.maxDevSideMax ? (
          <Tag className="tag-max-value">
            {Number(Number(value) * 100).toFixed(2) + '%'}
          </Tag>
        ) : (
          Number(Number(value) * 100).toFixed(2) + '%'
        )}
      </div>
    );
  }

  devWeight(value) {
    if (value == undefined || value == 0) return;
    return (
      <Tag className={value > 0 ? 'tag-dev-max-more' : 'tag-dev-max-less'}>
        {(value * 100).toFixed(2) + '%'}
      </Tag>
    );
  }

  devMax(value) {
    if (value == undefined || value == 0) return;
    return (
      <Tag className={value < 0.2 ? 'tag-dev-max-more' : 'tag-dev-max-less'}>
        {(value * 100).toFixed(2) + '%'}
      </Tag>
    );
  }

  ChartColumns = () => {
    const { Left, Right, Both, Xlabel } = this.prepareChartData();

    var columns = [];
    columns.push({
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
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
      title: 'Weight',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: '20px',
      render: text => <a href="javascript:;">{text}</a>,
      sorter: (a, b) => a.name - b.name
    });
    if (Left.Available) {
      columns.push({
        title: 'Left',
        dataIndex: 'left.total',
        key: 'left.total',
        align: 'center',
        render: value => this.isMaxValue(value, 'left')
      });
    }
    if (Right.Available) {
      columns.push({
        title: 'Right',
        dataIndex: 'right.total',
        key: 'right.total',
        align: 'center',
        render: value => this.isMaxValue(value, 'right')
      });
    }
    if (Both.Available) {
      columns.push({
        title: 'Both',
        dataIndex: 'both.total',
        key: 'both.total',
        align: 'center',
        render: value => this.isMaxValue(value, 'both')
      });
    }

    var deviations = [];
    if (Left.Available && Right.Available) {
      deviations.push({
        title: 'L vs R',
        dataIndex: 'devSide',
        key: 'devSide',
        align: 'center',
        render: (value, record) => {
          return {
            props: {
              style: { backgroundColor: '#FEF9E7' }
            },
            children: this.isLvsRMax(value)
          };
        }
      });
      deviations.push({
        title: 'vs Max',
        dataIndex: 'devSideMax',
        key: 'devSideMax',
        align: 'center',
        render: (value, record) => {
          return {
            props: {
              style: { backgroundColor: '#F8F9F9' }
            },
            children: this.isdevLvsRMax(value)
          };
        }
      });
    }
    if (Both.Available) {
      deviations.push({
        title: 'vs Max',
        dataIndex: 'devFromMax',
        key: 'devFromMax',
        align: 'center',
        render: (value, record) => {
          return {
            props: {
              style: { backgroundColor: '#F8F9F9' }
            },
            children: this.isValuevsMax(value, 'both')
          };
        }
      });
    }
    deviations.push({
      title: (
        <Icon
          name="sort amount down"
          style={{
            fontSize: '3ex',
            marginBottom: '-20px',
            color: '#0B2746',
            verticalAlign: 'middle'
          }}
        ></Icon>
      ),
      dataIndex: 'devDown',
      key: 'devDown',
      align: 'center',
      render: (value, record) => {
        if (record.key === 0) return;
        return {
          props: {
            style: { backgroundColor: '#F8F9F9' }
          },
          children: this.isDownMax(value)
        };
      }
    });
    columns.push({
      title: 'Deviations',
      children: deviations
    });
    return columns;
  };

  prepareChartData() {
    const { data } = this.state;
    var Left = {
      YMax: 0.0,
      YMin: 0,
      XMax: '',
      Available: false
    };
    var Right = {
      YMax: 0.0,
      YMin: 0,
      XMax: '',
      Available: false
    };
    var Both = {
      YMax: 0.0,
      YMin: 0,
      XMax: '',
      Available: false
    };

    var dayCount = {};
    data.forEach(function(x) {
      dayCount[x.date] = (dayCount[x.date] || 0) + 1;
    });
    var weightCount = {};
    data.forEach(function(x) {
      weightCount[x.weight] = (weightCount[x.weight] || 0) + 1;
    });
    var Xlabel = 'weight';
    if (Object.keys(dayCount).length > Object.keys(weightCount).length) {
      Xlabel = 'date';
    }
    var recordRM = data.find(function(record) {
      return record.right.max === true;
    });
    if (recordRM !== undefined) {
      Right.YMax = recordRM.right.total;
      Right.XMax = recordRM[Xlabel];
      Right.Available = true;
    }
    var recordLM = data.find(function(record) {
      return record.left.max === true;
    });
    if (recordLM !== undefined) {
      Left.YMax = recordLM.left.total;
      Left.XMax = recordLM[Xlabel];
      Left.Available = true;
    }
    var recordBM = data.find(function(record) {
      return record.both.max === true;
    });
    if (recordBM !== undefined) {
      Both.YMax = recordBM.both.total;
      Both.XMax = recordBM[Xlabel];
      Both.Available = true;
    }
    recordRM = data.find(function(record) {
      return record.right.min === true;
    });
    if (recordRM !== undefined) {
      Right.YMin = recordRM.right.total;
    }
    recordLM = data.find(function(record) {
      return record.left.min === true;
    });
    if (recordLM !== undefined) {
      Left.YMin = recordLM.left.total;
    }
    recordBM = data.find(function(record) {
      return record.both.min === true;
    });
    if (recordBM !== undefined) {
      Both.YMin = recordBM.both.total;
    }

    data.forEach((item, index) => {
      item.left.total = Number(Number(item.left.total).toFixed(2));
      item.left.concentric = Number(Number(item.left.concentric).toFixed(2));
      item.left.eccentric = Number(Number(item.left.eccentric).toFixed(2));
      item.right.total = Number(Number(item.right.total).toFixed(2));
      item.right.concentric = Number(Number(item.right.concentric).toFixed(2));
      item.right.eccentric = Number(Number(item.right.eccentric).toFixed(2));
      item.both.total = Number(Number(item.both.total).toFixed(2));
      item.both.concentric = Number(Number(item.both.concentric).toFixed(2));
      item.both.eccentric = Number(Number(item.both.eccentric).toFixed(2));
    });

    Left.YMax = Number(Number(Left.YMax).toFixed(2));
    Right.YMax = Number(Number(Right.YMax).toFixed(2));
    Both.YMax = Number(Number(Both.YMax).toFixed(2));
    Left.YMin = Number(Number(Left.YMin).toFixed(2));
    Right.YMin = Number(Number(Right.YMin).toFixed(2));
    Both.YMin = Number(Number(Both.YMin).toFixed(2));
    return {
      Left,
      Right,
      Both,
      Xlabel: Xlabel
    };
  }

  render() {
    const { data, title, unit, selectedClassStates, showEC } = this.state;
    const { Left, Right, Both, Xlabel } = this.prepareChartData();
    var conChecked = selectedClassStates.indexOf('Concentric') > -1;
    var eccChecked = selectedClassStates.indexOf('Eccentric') > -1;
    var totalChecked = selectedClassStates.indexOf('Total') > -1;
    var YMax = Math.max(Left.YMax, Right.YMax, Both.YMax);
    var YMin = Math.min(Left.YMin, Right.YMin, Both.YMin);
    YMax = (YMax + YMax * 0.8).toFixed(1);
    YMin = (YMin - YMin * 0.8).toFixed(1);
    return (
      <div style={{ height: '100%', width: '100%', marginBottom: '20px' }}>
        {showEC && (
          <div style={{ paddingLeft: '5px', paddingTop: '2px' }}>
            {classStates.map(tag => {
              return this.GetClassStateTag(tag);
            })}
          </div>
        )}
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{
              top: 2,
              right: 10,
              left: 5,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={Xlabel}
              type="category"
              padding={{ left: 30, right: 30 }}
              tick={{ stroke: 'black', strokeWidth: 1 }}
            >
              <Label offset={5} position="bottom">
                (kg) weight
              </Label>
            </XAxis>
            <YAxis
              hide={false}
              type="number"
              domain={[YMin, YMax]}
              padding={{ top: 10, bottom: 10 }}
              tickSize={5}
              interval={0}
              allowDecimals={false}
              unit=""
            >
              <Label
                offset={1}
                value={'(' + unit + ') ' + title}
                angle={-90}
                position="insideLeft"
              />
            </YAxis>
            <Tooltip />
            <Legend verticalAlign="top" height={35} iconSize={30} />
            {Left.Available && <ReferenceLine x={Left.XMax} stroke="#5DADE2" />}
            {Left.Available && <ReferenceLine y={Left.YMax} stroke="#5DADE2" />}
            {Right.Available && (
              <ReferenceLine x={Right.XMax} stroke="#D35400" />
            )}
            {Right.Available && (
              <ReferenceLine y={Right.YMax} stroke="#D35400" />
            )}
            {Both.Available && <ReferenceLine x={Both.XMax} stroke="#D35400" />}
            {Both.Available && <ReferenceLine y={Both.YMax} stroke="#D35400" />}

            {Left.Available && totalChecked && (
              <Line
                type="natural"
                dataKey="left.total"
                name="Left"
                stroke="#5DADE2"
                animationDuration={800}
              />
            )}
            {Right.Available && totalChecked && (
              <Line
                type="natural"
                dataKey="right.total"
                name="Right"
                stroke="#D35400"
                animationDuration={800}
              />
            )}
            {Both.Available && totalChecked && (
              <Line
                type="natural"
                dataKey="both.total"
                name="Both"
                stroke="#D35400"
                animationDuration={800}
              />
            )}

            {conChecked && (
              <Line
                type="natural"
                dataKey="left.concentric"
                name="Left(Con)"
                stroke="#AED6F1"
                animationDuration={800}
                strokeDasharray="2 2 2 2"
              />
            )}
            {conChecked && (
              <Line
                type="natural"
                dataKey="right.concentric"
                name="Right(Con)"
                stroke="#EDBB99"
                animationDuration={800}
                strokeDasharray="2 2 2 2"
              />
            )}
            {eccChecked && (
              <Line
                type="natural"
                dataKey="left.eccentric"
                name="Left(Ecc)"
                stroke="#82E0AA"
                animationDuration={800}
                strokeDasharray="2 2 2 2"
              />
            )}
            {eccChecked && (
              <Line
                type="natural"
                dataKey="right.eccentric"
                name="Right(Ecc)"
                stroke="#85929E"
                animationDuration={800}
                strokeDasharray="2 2 2 2"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
        <div
          style={{
            paddingLeft: '0px',
            paddingRight: '0px',
            borderStyle: 'none'
          }}
        >
          <Table
            columns={this.ChartColumns()}
            bordered={false}
            dataSource={data}
            size="middle"
            pagination={false}
            indentSize={0}
          />
        </div>
      </div>
    );
  }
}
