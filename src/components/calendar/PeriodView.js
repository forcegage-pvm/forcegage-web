import React from 'react';
import AliceCarousel from 'react-alice-carousel';
import { Button, Icon } from 'antd';
import _ from 'lodash';
import 'react-alice-carousel/lib/alice-carousel.css';
import Day from './Day';
import styles from './style.css';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

function DayItem(props) {
  const day = props.day;
  const data = props.data;
  const index = props.index;
  const selected = props.selected;

  const exercises = [...new Set(data.exercises.map(s => s.exercise))];
  var sessionCount = 0;
  data.exercises.map(s => s.sessions.length).forEach(l => (sessionCount += l));

  const dayClick = e => {
    props.onClick(e, index);
  };

  return (
    <div
      className={selected ? 'main-day-item-selected' : 'main-day-item'}
      onClick={dayClick}
    >
      <div className="main-day-day-day">{day.getDate()}</div>
      <div className="main-day-day-month">{monthNames[day.getMonth()]}</div>
      <div className="main-day-day-weekday">{dayNames[day.getDay()]}</div>
      <div className="main-day-day-sessions-count">{sessionCount}</div>
      <div className="main-day-day-sessions">sessions</div>
      <ul className="main-day-day-exercise">
        {exercises.map(e => (
          <li>{e}</li>
        ))}
      </ul>
    </div>
  );
}

export default class PeriodView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      period: {},
      currentIndex: 0,
      mounted: false
    };
    this.athlete = props.athlete;
    this.setStateFromProps(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setStateFromProps(nextProps);
  }

  componentDidMount = () => {
    this.setState({ mounted: true });
  };

  setStateFromProps = props => {
    const { period, mounted } = this.state;
    var same = _.isEqual(props.days, period);
    if (same) return;
    var count = Object.keys(props.days).length;
    var maxCount = Math.min(count, 5);
    var width = Math.min(count * 200, 1000);
    var responsive = {};
    for (let c = 0; c < maxCount; c++) {
      responsive[c * 200] = { items: c + 1 };
    }
    if (mounted) {
      this.setState({
        period: props.days,
        width: width,
        responsive: responsive,
        currentIndex: 0,
        galleryItems: this.galleryItems(props.days, 0)
      });
    } else {
      this.state = {
        period: props.days,
        width: width,
        responsive: responsive,
        currentIndex: 0,
        galleryItems: this.galleryItems(props.days, 0)
      };
    }
  };

  shouldComponentUpdate = (nextProps, nextState, nextContext) => {
    const { period } = this.state;
    const newPeriod = nextProps.days.date;
    var same =
      _.isEqual(newPeriod, period) &&
      _.isEqual(nextState.period, this.state.period) &&
      nextState.currentIndex === this.state.currentIndex;
    return !same;
  };

  slideTo = i => this.setState({ currentIndex: i });

  onSlideChanged = e => {
    // console.log(e)
    this.setState({ currentIndex: e.item });
  };

  slideNext = () => {
    // this.Carousel.slideNext()
    this.setState({ currentIndex: this.state.currentIndex + 1 });
  };

  slidePrev = () => {
    // this.Carousel.slidePrev()
    this.setState({ currentIndex: this.state.currentIndex - 1 });
  };

  dayClick = (e, index) => {
    const { period } = this.state;
    this.setState({
      galleryItems: this.galleryItems(period, index),
      currentIndex: index
    });
    this.Carousel.slideTo(index);
  };

  galleryItems = (days, selected) => {
    var items = [];
    var index = 0;
    days.forEach(day => {
      items.push(
        <DayItem
          onClick={this.dayClick}
          index={index}
          day={new Date(day.date)}
          selected={index === selected ? true : false}
          data={day}
        />
      );
      index++;
    });
    return items;
  };

  render() {
    const {
      galleryItems,
      responsive,
      currentIndex,
      width,
      period
    } = this.state;
    var currentDay = undefined;

    var index = 0;
    period.forEach(day => {
      if (index === currentIndex) {
        currentDay = day.date;
      }
      index++;
    });

    return (
      <div className="main-day">
        <div className="main-day-header">Days</div>
        <div
          className="main-day-content"
          width={width}
          style={{ width: width }}
        >
          <AliceCarousel
            dotsDisabled={true}
            buttonsDisabled={true}
            items={galleryItems}
            infinite={true}
            responsive={responsive}
            slideToIndex={currentIndex}
            startIndex={currentIndex}
            onSlideChanged={this.onSlideChanged}
            ref={el => (this.Carousel = el)}
          />
        </div>
        <div className="main-day-left">
          <Button
            className="main-day-button-navigate"
            type="primary"
            icon="arrow-left"
            ghost
            onClick={() => this.slidePrev()}
          />
        </div>
        <div className="main-day-right">
          <Button
            className="main-day-button-navigate"
            type="primary"
            icon="arrow-right"
            ghost
            onClick={() => this.slideNext()}
          />
        </div>
        <div className="main-day-sessions-list">
          <Day date={currentDay} athlete={this.athlete} period={period}></Day>
        </div>
      </div>
    );
  }
}
