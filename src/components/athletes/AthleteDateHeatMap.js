import React from 'react';
import ReactDOM from 'react-dom';
import CalendarHeatmap from 'react-calendar-heatmap';
import ReactTooltip from 'react-tooltip';

// import 'react-calendar-heatmap/dist/styles.css';
import './athletedateheatmap.css';

const today = new Date();

export default function AthleteDateHeatMap() {
  const randomValues = getRange(500).map(index => {
    return {
      date: shiftDate(today, -index),
      count: getRandomInt(0, 4)
    };
  });
  return (
    <div style={{ width: 800, height: 50 }}>
      <CalendarHeatmap
        startDate="2018-12-31"
        endDate={today}
        values={randomValues}
        classForValue={value => {
          if (!value) {
            return 'color-empty';
          }
          return `color-github-${value.count}`;
        }}
        tooltipDataAttrs={value => {
          if (value.date === null) return '';
          return {
            'data-tip': `${value.date
              .toISOString()
              .slice(0, 10)} has \ncount: ${value.count}`
          };
        }}
        showWeekdayLabels={true}
        showMonthLabels={true}
        transformDayElement={(element, value, index) =>
          React.cloneElement(element, { title: value.date })
        }
        onClick={value => alert(`Clicked on value with count: ${value.count}`)}
      />
      <ReactTooltip />
    </div>
  );
}

function shiftDate(date, numDays) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
}

function getRange(count) {
  return Array.from({ length: count }, (_, i) => i);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
