import React, { Component } from 'react';
import ScrollMenu from 'react-horizontal-scrolling-menu';
import { Icon } from 'semantic-ui-react';
import { GetStore } from '../../../models/store/store';
import { ReactComponent as Exercise } from '../../../assets/exercises.svg';
import '../athletePage.css';

// selected prop will be passed
const MenuItem = ({ date, year, type, text, selected }) => {
  if (type === 'date') {
    return (
      <div className={`menu-item ${selected ? 'active' : ''}`}>
        <div className="menu-item-day">{date}</div>
        <div className="menu-item-year">{year}</div>
      </div>
    );
  } else {
    return (
      <div className={`menu-item ${selected ? 'active' : ''}`}>
        <div>{text}</div>
      </div>
    );
  }
};

// All items component
// Important! add unique key
export const Menu = (list, selected) =>
  list.map(el => {
    const { type, day, year, text, key } = el;
    return (
      <MenuItem
        date={day}
        year={year}
        type={type}
        text={text}
        key={key}
        selected={selected}
      />
    );
  });

const ArrowLeft = <Icon name="caret left" size="big" color="grey"></Icon>;
const ArrowRight = <Icon name="caret right" size="big" color="grey"></Icon>;

const selected = '22 Aug2019';

export default class DayBrowser extends Component {
  constructor(props) {
    super(props);
    // call it again if items count changes
    this.state = {
      onChange: props.onChange,
      exercise: props.exercise,
      menuItems: Menu(props.days, props.days[0].key)
    };
    this.storeState = GetStore().state;
  }

  setStateFromProps = props => {
    this.setState(
      {
        onChange: props.onChange,
        exercise: props.exercise,
        menuItems: Menu(props.days, props.days[0].key)
      },
      () => {}
    );
  };

  componentWillReceiveProps = props => {
    this.setStateFromProps(props);
  };

  onSelect = key => {
    const { onChange } = this.state;
    console.log('selected key:', key);
    this.storeState.selectedDay = key;
    onChange(key);
  };

  render() {
    const { menuItems, exercise } = this.state;
    const { selectedDay } = this.storeState;

    return (
      <div className="header-exercise">
        <div className="header-exercise-content">
          <div className="header-exercise-image">
            <Exercise className="header-exercise-image-content"></Exercise>
          </div>
          <div className="header-exercise-description">{exercise}</div>
        </div>
        <div className="header-exercise-day">
          <ScrollMenu
            className="header-exercise-day"
            data={menuItems}
            arrowLeft={ArrowLeft}
            arrowRight={ArrowRight}
            selected={selectedDay}
            onSelect={this.onSelect}
            hideArrows={false}
            hideSingleArrow={false}
            transition={+0.4}
            alignCenter={false}
            scrollToSelected={true}
            dragging={true}
            wheel={false}
          />
        </div>
      </div>
    );
  }
}
