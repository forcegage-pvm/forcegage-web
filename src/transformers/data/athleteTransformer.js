import ApolloClient, { gql } from 'apollo-boost';
import { filterData, countData } from './filterTransformer';

const client = new ApolloClient({
  uri: 'https://forcegage-gcp.appspot.com/graphql/'
});

export default class AthleteTransformer {
  athleteData = [];

  async filterData(filters) {
    return filterData(this.athleteData, filters);
  }

  async count(filteredData, filters) {
    return countData(this.athleteData, filteredData, filters);
  }

  async getTopLevelData(id) {
    await this.getData(id);
    let result = {
      years: [],
      days: [],
      exercises: [],
      weights: [],
      sides: []
    };
    var timeStamps = this.getProp(this.athleteData.person, 'timestamp', 2);
    timeStamps.forEach((item, index) => {
      var sessionDate = new Date(item.timestamp);
      var day = {
        year: sessionDate.getFullYear(),
        month: sessionDate.getMonth() + 1,
        day: sessionDate.getDate(),
        date: sessionDate.toISOString().slice(0, 10),
        fullDate: sessionDate,
        display: sessionDate.toISOString().slice(0, 10),
        timestamp: item.timestamp,
        count: 0
      };
      var found = result.days.find(function(element) {
        return element.date === day.date;
      });
      if (found === undefined) {
        result.days.push(day);
      }
    });
    result.days.forEach((item, index) => {
      var year = {
        year: item.year,
        count: 0
      };
      var found = result.years.find(function(element) {
        return element.year === year.year;
      });
      if (found === undefined) {
        result.years.push(year);
      }
    });
    this.athleteData.person.sessions.forEach((session, index) => {
      var exercise = {
        exercise: session.exercise,
        count: 0
      };
      var foundExercise = result.exercises.find(function(element) {
        return element.exercise === exercise.exercise;
      });
      if (foundExercise === undefined) {
        result.exercises.push(exercise);
      }
      var weight = {
        weight: session.weight,
        count: 0
      };
      var foundWeight = result.weights.find(function(element) {
        return element.weight === weight.weight;
      });
      if (foundWeight === undefined) {
        result.weights.push(weight);
      }
      session.exerciseSets.forEach((rep, index) => {
        var side = {
          side: rep.side,
          count: 0
        };
        var foundSide = result.sides.find(function(element) {
          return element.side === rep.side;
        });
        if (foundSide === undefined) {
          result.sides.push(side);
        }
      });
    });
    result.days.sort((a, b) => (a.date > b.date ? 1 : -1));
    result.weights.sort((a, b) => (a.weight > b.weight ? 1 : -1));
    return result;
  }

  async getDays(id) {
    var data = await this.getData(id);
    let result = {
      days: [],
      exercises: [],
      weights: []
    };
    var timeStamps = this.getProp(data.person, 'timestamp', 2);
    timeStamps.forEach((item, index) => {
      var date = new Date(Date.parse(item.timestamp));
      var day = {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDay()
      };
      var found = result.days.find(function(element) {
        return element.day === day.day;
      });
      if (found === undefined) {
        result.days.push(day);
      }
    });
    data.person.sessions.forEach((item, index) => {
      var exercise = {
        exercise: item.exercise,
        weights: []
      };
      var foundExercise = result.exercises.find(function(element) {
        return element.exercise === exercise.exercise;
      });
      if (foundExercise === undefined) {
        if (index === 0) {
          exercise.weights.push(item.weight);
        }
        result.exercises.push(exercise);
      } else {
        var foundWeight = foundExercise.weights.find(function(element) {
          return element === item.weight;
        });
        if (foundWeight === undefined) {
          foundExercise.weights.push(item.weight);
        }
      }
      var weight = {
        weight: item.weight,
        exercises: []
      };
      foundWeight = result.weights.find(function(element) {
        return element.weight === weight.weight;
      });
      if (foundWeight === undefined) {
        if (weight.exercises.length <= 0) {
          weight.exercises.push(item.exercise);
        }
        result.weights.push(weight);
      } else {
        foundExercise = foundWeight.exercises.find(function(element) {
          return element === item.exercise;
        });
        if (foundExercise === undefined) {
          foundWeight.exercises.push(item.exercise);
        }
      }
    });
    return result;
  }

  getProp(object, prop, recurseLevel = 0) {
    var result = [];
    for (var item in object) {
      if (item === prop) {
        result.push({ [prop]: object[item] });
      }
      if (recurseLevel > 0 && typeof object[item] === 'object') {
        var recurse = this.getProp(object[item], prop, recurseLevel - 1);
        recurse.forEach((item, index) => result.push(item));
      }
    }
    return result;
  }

  async getData(id) {
    if (this.athleteData.length > 0) {
      return this.athleteData;
    }
    var result = await client.query({
      headers: { 'Content-Type': 'application/json' },
      query: gql`
        {
          person(id: ${id}) {
            id
            sessions {
              timestamp
              exercise
              weight
              year
              exerciseSets {
                setNo
                side
                timestamp
                exerciseReps {
                  repNo
                  id
                  side
                  timestamp
                  statistics {
                    class
                    aggregation
                    value
                    type
                  }
                }
              }
            }
          }
        }
      `
    });
    this.athleteData = result.data;
    return this.athleteData;
  }
}
