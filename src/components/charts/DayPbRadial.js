import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector } from 'recharts';

const data = [{ name: 'Day', value: 164.65 }, { name: 'Season', value: 11.2 }];

const renderActiveShape = props => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text
        x={cx}
        y={cy - 2}
        dy={8}
        textAnchor="middle"
        fill="#1A5276"
        fontSize="0.9em"
      >
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy + 65}
        dy={8}
        textAnchor="middle"
        fill="#1A5276"
        fontSize="1.2em"
      >
        {' '}
        {`${(percent * 100).toFixed(0)}%`}
      </text>
      <text
        x={cx}
        y={cy + 85}
        dy={8}
        textAnchor="middle"
        fill="#5499C7"
        fontSize="1.0em"
      >
        {' '}
        {`${value.toFixed(2)}`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill="#85C1E9"
      />
    </g>
  );
};

export default class DayPbRadial extends PureComponent {
  state = {
    activeIndex: 0
  };

  onPieEnter = (data, index) => {
    this.setState({
      activeIndex: index
    });
  };

  render() {
    return (
      <PieChart width={100} height={220}>
        <Pie
          activeIndex={this.state.activeIndex}
          activeShape={renderActiveShape}
          data={data}
          //   cx={200}
          //   cy={200}
          labelLine={false}
          innerRadius={25}
          outerRadius={40}
          fill="#2980B9"
          dataKey="value"
          onMouseEnter={this.onPieEnter}
        />
      </PieChart>
    );
  }
}
