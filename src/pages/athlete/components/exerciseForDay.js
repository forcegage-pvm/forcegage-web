import React, { Component } from 'react';
import '../athletePage.css';
import { Breadcrumb } from 'antd';
import { observer } from 'mobx-react';
import { GetStore } from '../../../models/store/store';

const ExerciseForDay = observer(
  class ExerciseForDay extends Component {
    constructor(props) {
      super(props);
      this.state = {
        mounted: false,
        day: props.day
      };
      this.setStateFromProps(props);
      this.athlete = GetStore().athlete;
      this.storeState = GetStore().state;
    }

    setStateFromProps = props => {
      this.setState(
        {
          day: props.day
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

    onClick = () => {};

    render() {
      const { day } = this.state;

      if (this.athlete.loaded) {
        var dayData = this.athlete.period.exerciseDays.find(
          d => day === d.date.toISOString().slice(0, 10)
        );
      }

      return (
        <div>
          {this.athlete.loaded && (
            <Breadcrumb separator=">">
              {dayData.summary.exercises.map((e, index) => (
                <Breadcrumb.Item>
                  <a onClick={this.onClick}>{e.exercise}</a>
                </Breadcrumb.Item>
              ))}
            </Breadcrumb>
          )}
        </div>
      );
    }
  }
);

export default ExerciseForDay;
