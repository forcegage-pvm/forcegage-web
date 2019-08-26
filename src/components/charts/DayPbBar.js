import React, { PureComponent } from 'react';
import { BarChart, Bar, LabelList } from 'recharts';
import { Tooltip } from 'antd';
import styles from './charts.css';

export default function DayPbBar(props) {
  const data = [
    {
      name: 'Day',
      day: props.day,
      season: props.season
    }
  ];

  const perc = ((props.day / props.season) * 100).toFixed(0) + '%';
  var fill = '#EBF5FB';
  if (Number(props.day / props.season) >= 0.85) {
    fill = '#EBF5FB';
  }
  if (Number(props.day / props.season) >= 0.96) {
    fill = '#F6DDCC';
  }

  return (
    <div className="daypb-container">
      <BarChart
        className="daypb-chart"
        width={100}
        height={180}
        data={data}
        isAnimationActive={true}
        animationDuration={2500}
        margin={{ top: 5, bottom: 5, left: 5 }}
      >
        <Bar dataKey="day" fill={fill}></Bar>
      </BarChart>
      <div className="daypb-percentage">{perc}</div>
      <div className="daypb-label">season best</div>
      <div className="daypb-season">
        <Tooltip
          placement="topLeft"
          arrowPointAtCenter
          title={props.seasoBestDate.toLocaleString()}
        >
          <span>{props.season}</span>
        </Tooltip>
      </div>
    </div>
  );
}
