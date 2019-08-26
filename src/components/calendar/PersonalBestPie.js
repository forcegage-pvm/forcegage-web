import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell } from 'recharts';
import styles from './style.css';

export default function PersonalBestPie(props) {
  const data = props.data;
  const title = props.title;
  const color = props.color;
  return (
    <div className="personal-best">
      <div className="personal-best-label">{data[0].name}</div>
      <PieChart className="personal-best-chart" width={85} height={95}>
        <Pie
          data={data}
          animationDuration={0}
          isAnimationActive={false}
          cx={37.5}
          cy={47.5}
          innerRadius={21}
          outerRadius={40}
          fill="#D4EFDF"
          paddingAngle={2}
          dataKey="value"
        >
          <Cell key={1} fill={color} />
          <Cell key={1} fill="#5D6D7E" />
        </Pie>
      </PieChart>
      <div className="personal-best-heading">{title}</div>
      <div className="personal-best-value">{data[0].value.toFixed(2)}</div>
    </div>
  );
}
