import _ from 'lodash';

export default class StatsProvider {
  constructor(expandedData) {
    this.expandedData = expandedData;
  }
  // returns the distinct years in the dataset
  getYears = () => {
    const distinctYears = [
      ...new Set(this.expandedData.sessions.map(x => x.year))
    ];
    distinctYears.sort((x, y) => (x > y ? 1 : -1));
    return distinctYears;
  };
  // returns the distinct week of the years in the dataset
  // for the year provided
  getWeeks = year => {
    const sessionsForYear = this.expandedData.sessions.filter(session => {
      return session.year === year;
    });
    const distinctWeeks = [...new Set(sessionsForYear.map(x => x.weekOfYear))];
    distinctWeeks.sort((x, y) => (x > y ? 1 : -1));
    return distinctWeeks;
  };
  // returns the distinct month of the years in the dataset
  // for the year provided
  getMonths = year => {
    const sessionsForYear = this.expandedData.sessions.filter(session => {
      return session.year === year;
    });
    const distinctMonths = [...new Set(sessionsForYear.map(x => x.month))];
    distinctMonths.sort((x, y) => (x > y ? 1 : -1));
    return distinctMonths;
  };
  // returns the distinct exercises in the dataset for the year provided.
  // if years is not provided, all exercises
  getExercises = year => {
    var sessionsForYear = this.expandedData.sessions;
    if (year !== undefined) {
      sessionsForYear = this.expandedData.sessions.filter(session => {
        return session.year === year;
      });
    }
    const distinctExercises = [
      ...new Set(sessionsForYear.map(x => x.exercise))
    ];
    distinctExercises.sort((x, y) => (x > y ? 1 : -1));
    return distinctExercises;
  };
  // returns the distinct weights in the dataset for the year provided.
  // if years is not provided, all weights
  getWeights = year => {
    var sessionsForYear = this.expandedData.sessions;
    if (year !== undefined) {
      sessionsForYear = this.expandedData.sessions.filter(session => {
        return session.year === year;
      });
    }
    const distinctWeights = [...new Set(sessionsForYear.map(x => x.weight))];
    distinctWeights.sort((x, y) => (x > y ? 1 : -1));
    return distinctWeights;
  };
  // returns the stats filtered by the filter provided
  filterStatsBy = (filter, returnSessions, returnSets, returnReps) => {
    const sessionIds = this.getSessionIdsForFilter(filter);
    const statsForFilter = this.expandedData.stats.filter(stat => {
      return sessionIds.includes(stat.sessionId);
    });
    var result = {
      stats: statsForFilter
    };
    if (returnSessions === true) {
      const sessionsForFilter = this.expandedData.sessions.filter(stat => {
        return sessionIds.includes(stat.sessionId);
      });
      result.sessions = sessionsForFilter;
    }
    if (returnSets === true) {
      const setsForFilter = this.expandedData.sets.filter(stat => {
        return sessionIds.includes(stat.sessionId);
      });
      result.sets = setsForFilter;
    }
    if (returnReps === true) {
      const repsForFilter = this.expandedData.reps.filter(stat => {
        return sessionIds.includes(stat.sessionId);
      });
      result.reps = repsForFilter;
    }
    result.filter = filter;
    return result;
  };
  // returns the session filtered by the filter provided
  filterSessionsBy = filter => {
    const sessionIds = this.getSessionIdsForFilter(filter);
    const sessionsForFilter = this.expandedData.sessions.filter(session => {
      return sessionIds.includes(session.sessionId);
    });
    return sessionsForFilter;
  };
  // filter the supplied states by the parameters
  filterStats = (stats, statClass, type, aggregation) => {
    const statsFor = stats.filter(stat => {
      return (
        stat.class === statClass &&
        stat.type === type &&
        stat.aggregation === aggregation
      );
    });
    return statsFor;
  };

  personalBestForPeriod = (filter, type) => {
    var stats = this.filterStatsBy(filter, false, false, true);
    const filteredStats = this.filterStats(stats.stats, 'Total', type, 'avg');
    var max = filteredStats.Max('value');
  };

  personalBestsForPeriod = filter => {
    filter.exercise = {
      filter: false,
      group: true
    };
    var result = [];
    const maxTypes = ['force', 'fmax', 'power', 'velocity'];
    var grouped = this.groupSessionsBy(filter);
    for (var index in grouped.exercise) {
      var exercise = grouped.exercise[index];
      maxTypes.forEach(type => {
        var filteredStats = this.filterStats(
          exercise.stats,
          'Total',
          type,
          'avg'
        );
        var max = filteredStats.Max('value');
        result.push({
          exercise: index,
          type: type,
          value: max[0]
        });
      });
    }
    var stats = this.filterStatsBy(filter, false, false, true);

    return result;
  };

  // get the sessionIds for the provided filter
  getSessionIdsForFilter = filter => {
    var checkSides = false;
    const sessions = this.expandedData.sessions.filter(session => {
      var found = true;
      Object.keys(filter).forEach(key => {
        // exclude side, as it is in set level
        if (filter[key].filter === true) {
          if (key !== 'side') {
            if (filter[key].compare === '=') {
              found = found && session[key] === filter[key].values[0];
            } else if (filter[key].compare === '>=') {
              found = found && session[key] >= filter[key].values[0];
            } else if (filter[key].compare === '<=') {
              found = found && session[key] <= filter[key].values[0];
            } else if (filter[key].compare === 'between') {
              found =
                found &&
                (session[key] >= filter[key].values[0] &&
                  session[key] <= filter[key].values[1]);
            } else {
              found = false;
            }
          } else {
            checkSides = true;
          }
        }
      });
      return found;
    });
    var sessionIds = sessions.map(x => x.sessionId);
    if (checkSides) {
      var repsForSession = this.expandedData.sets.filter(rep => {
        return sessionIds.includes(rep.sessionId) && rep.side === filter.side;
      });
      sessionIds = [...new Set(repsForSession.map(x => x.sessionId))];
    }
    return sessionIds;
  };
  // returns the distinct month of the years in the dataset
  // for the year provided
  groupSessionsBy = groupFilter => {
    const filter = {};
    // get the filters
    Object.keys(groupFilter).forEach(key => {
      if (groupFilter[key].filter === true) {
        filter[key] = groupFilter[key].value;
      }
    });
    const groups = [];
    // get the groupings
    Object.keys(groupFilter).forEach(key => {
      if (groupFilter[key].group === true) {
        groups.push(key);
      }
    });
    const stats = this.filterStatsBy(groupFilter, true, true, true);
    const results = [];
    groups.forEach(group => {
      var grouped = this.groupArrBy(stats.sessions, group);
      results[group] = {};
      for (var key in grouped) {
        var item = grouped[key];
        var sessionIds = [...new Set(item.map(x => x.sessionId))];
        results[group][key] = {
          sessions: item,
          reps: stats.reps.filter(rep => {
            return sessionIds.includes(rep.sessionId);
          }),
          stats: stats.stats.filter(rep => {
            return sessionIds.includes(rep.sessionId);
          })
        };
      }
    });
    results.filter = groupFilter;
    return results;
  };

  groupArrBy = (items, key) =>
    items.reduce(
      (result, item) => ({
        ...result,
        [item[key]]: [...(result[item[key]] || []), item]
      }),
      {}
    );
}
