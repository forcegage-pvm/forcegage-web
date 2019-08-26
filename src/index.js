import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './components/app/App';
import * as serviceWorker from './serviceWorker';
import MonthCalendar from './components/calendar/MonthCalendar';
import Array from './extensions/Array';
import AthleteTransformer from './transformers/data/athleteTransformer';
import Expander from './transformers/data/DataExpander';
import StatsProvider from './providers/data/StatsProvider';

Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

async function getData() {
  const transformer = new AthleteTransformer();
  var data = await transformer.getData(1);
  var expanded = Expander(data);

  console.log('expanded', expanded);

  const statsProvider = new StatsProvider(expanded);
  // console.log("years", statsProvider.getYears())
  // console.log("weeks", statsProvider.getWeeks(2019))
  // console.log("months", statsProvider.getMonths(2019))
  // console.log("getExercises()", statsProvider.getExercises())
  // console.log("getWeights()", statsProvider.getWeights(2019))
  const filter = {
    // weight: 50,
    year: {
      filter: false,
      value: 2019,
      compare: '='
    },
    fullDate: {
      filter: true,
      value: new Date(2019, 8, 1),
      compare: '<='
    }
  };
  // statsProvider.filterStatsBy(filter, true, true, true)
  // console.log("filterStatsBy(filter)", statsProvider.filterStatsBy(filter, true, true, true))
  const group = {
    fullDate: {
      filter: true,
      values: [new Date(2019, 6, 1), new Date(2019, 6, 30)],
      group: false,
      compare: 'between'
    },
    date: {
      group: true
    }
  };
  // console.log("group", group)
  console.log('groupSessionsBy(filter)', statsProvider.groupSessionsBy(group));
}

//  getData()
