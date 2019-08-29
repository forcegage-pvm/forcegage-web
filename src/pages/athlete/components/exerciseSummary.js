import React, { Component } from 'react';
import '../athletePage.css';
import { Breadcrumb } from 'antd';
import { observer } from 'mobx-react';
import { GetStore } from '../../../models/store/store';

const ExerciseSummary = observer(
  class ExerciseSummary extends Component {
    constructor(props) {
      super(props);
      this.state = {
        mounted: false,
        exercise: props.exercise
      };
      this.setStateFromProps(props);
      this.athlete = GetStore().athlete;
      this.storeState = GetStore().state;
    }

    setStateFromProps = props => {
      this.setState(
        {
          exercise: props.exercise
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
      const { exercise } = this.state;

      return <div></div>;
    }
  }
);

export default ExerciseSummary;
