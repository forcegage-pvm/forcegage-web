import React, { Component } from 'react';
import '../athletePage.css';
import { Tabs } from 'antd';
import { observer } from 'mobx-react';
import { GetStore } from '../../../models/store/store';
import ExerciseForDay from './exerciseForDay';
import WeightSummary from './weightSummary';

const { TabPane } = Tabs;

const AthleteContent = observer(
  class AthleteContent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        mounted: false
      };
      this.setStateFromProps(props);
      this.athlete = GetStore().athlete;
      this.storeState = GetStore().state;
    }

    setStateFromProps = props => {
      this.setState({}, () => {});
    };

    componentWillReceiveProps = props => {
      this.setStateFromProps(props);
    };

    componentDidMount = () => {
      this.setState({
        mounted: true
      });
    };

    render() {
      var render = false;
      if (this.storeState.menuParent === 'exercises') {
        var paths = this.storeState.menuChild.split(':');
        var weights = this.athlete.period.summary.exercises[Number(paths[1])]
          .summary.weights;
        // var weights = this.athlete.period.exerciseDays[14].summary.exercises[1].summary.weights;
        render = true;
      }
      // find a weight to test
      return (
        <div>
          {render && (
            <Tabs defaultActiveKey="1" tabPosition="top" size="small">
              <TabPane tab="Overall" key={-1}>
                <div>
                  <WeightSummary weights={weights}></WeightSummary>
                </div>
              </TabPane>
              {this.athlete.exerciseDays.map((e, index) => (
                <TabPane
                  tab={
                    new Date(e.date).getDate() +
                    '/' +
                    Number(new Date(e.date).getMonth() + 1)
                  }
                  key={index}
                >
                  <div>
                    <ExerciseForDay day={e.date}></ExerciseForDay>
                  </div>
                </TabPane>
              ))}
            </Tabs>
          )}
        </div>
      );
    }
  }
);

export default AthleteContent;
