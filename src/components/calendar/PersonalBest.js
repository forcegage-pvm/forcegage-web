import React, { PureComponent } from 'react';
import {
  BarChart,
  Legend,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  LabelList
} from 'recharts';
import { Badge } from 'antd';

export default function PersonalBests(props) {
  const seasonBest = props.seasonBest;
  const periodBest = props.periodBest;
  const exercises = props.exercises;

  return (
    <div>
      {exercises.map(e => {
        var season = seasonBest.filter(best => {
          return best.exercise === e.exercise;
        });
        var period = periodBest.filter(best => {
          return best.exercise === e.exercise;
        });
        if (period.length > 0) {
          return (
            <PersonalBest
              seasonBest={season}
              periodBest={period}
              exercises={exercises}
            ></PersonalBest>
          );
        }
      })}
    </div>
  );
}

function ExerciseHeader(props) {
  const exercise = props.exercise;
  return (
    <div
      style={{
        display: 'flex',
        alignContent: 'center',
        marginLeft: '15px',
        marginTop: '0px',
        marginBottom: '0px'
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '10px 200px' }}>
        {/* <Badge style={{ gridColumn: "1" }} dot color={exercise.color} /> */}
        <div
          style={{
            gridColumn: '2',
            marginTop: '4px',
            fontSize: '0.9em',
            fontWeight: '400',
            color: '#AEB6BF'
          }}
        >
          {exercise.exercise}
        </div>
      </div>
    </div>
  );
}

const containerStyle = {
  display: 'grid',
  gridTemplateRows: '20px 70px',
  marginLeft: '15px',
  marginRight: '15px',
  marginTop: '0px',
  height: '98px',
  padding: '4px'
};
const headerStyle = {
  gridRow: '1',
  margin: '5px'
};

const chartStyle = {
  gridRow: '2',
  marginTop: '15px',
  marginLeft: '10px',
  marginTop: '5px'
};

export function PersonalBest(props) {
  const seasonBest = props.seasonBest;
  const periodBest = props.periodBest;
  const exercises = props.exercises;
  const exercise = exercises.find(e => {
    return e.exercise === periodBest[0].exercise;
  });
  const data = [
    {
      name:
        'Force(' +
        ((periodBest[0].value / seasonBest[0].value) * 100).toFixed(0) +
        '%)',
      season: 100 - (periodBest[0].value / seasonBest[0].value) * 100,
      period: (periodBest[0].value / seasonBest[0].value) * 100,
      seasonLabel: seasonBest[0].value.toFixed(2),
      periodLabel: periodBest[0].value.toFixed(2)
    },
    {
      name:
        'Fmax(' +
        ((periodBest[1].value / seasonBest[1].value) * 100).toFixed(0) +
        '%)',
      season: 100 - (periodBest[1].value / seasonBest[1].value) * 100,
      period: (periodBest[1].value / seasonBest[1].value) * 100,
      seasonLabel: seasonBest[1].value.toFixed(2),
      periodLabel: periodBest[1].value.toFixed(2)
    },
    {
      name:
        'Power(' +
        ((periodBest[2].value / seasonBest[2].value) * 100).toFixed(0) +
        '%)',
      season: 100 - (periodBest[2].value / seasonBest[2].value) * 100,
      period: (periodBest[2].value / seasonBest[2].value) * 100,
      seasonLabel: seasonBest[2].value.toFixed(2),
      periodLabel: periodBest[2].value.toFixed(2)
    }
  ];
  if (periodBest.length === 0) return;
  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <ExerciseHeader exercise={exercise}></ExerciseHeader>
      </div>
      <div style={chartStyle}>
        <div style={{ transform: 'rotate(90deg)', marginLeft: '20px' }}>
          <BarChart
            width={60}
            height={370}
            data={data}
            margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
          >
            <Bar dataKey="period" stackId="a" fill={exercise.color}>
              <LabelList
                dataKey="name"
                angle="270"
                position="center"
                style={{
                  textAnchor: 'middle',
                  fontSize: '80%',
                  fill: '#5D6D7E'
                }}
              ></LabelList>
              />
            </Bar>
            <Bar dataKey="season" stackId="a" fill="#F9E79F">
              <LabelList
                dataKey="seasonLabel"
                angle="270"
                position="insideTopLeft"
                style={{
                  textAnchor: 'middle',
                  fontSize: '80%',
                  fill: '#7B241C',
                  margin: '90px'
                }}
              />
            </Bar>
          </BarChart>
        </div>
      </div>
    </div>
  );
}
