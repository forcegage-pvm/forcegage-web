export default function expander(data) {
  var dataPerson = data.person;
  var person = {
    id: dataPerson.id,
    sessions: [],
    reps: [],
    sets: [],
    stats: []
  };
  var dataSessions = dataPerson.sessions;
  // extract all sessions and expand them
  var sessionId = 0;
  dataSessions.forEach((s, index) => {
    var date = new Date(s.timestamp);
    var session = {
      sessionId: sessionId,
      exercise: s.exercise,
      weight: s.weight,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      dayOfYear: getDayOfTheYear(date),
      dayOfWeek: date.getDay(),
      weekOfYear: date.getWeekNumber(),
      date: date.toISOString().slice(0, 10),
      fullDate: date,
      timestamp: s.timestamp
    };
    s.id = sessionId;
    // extract all sets and expand them
    var dataSets = s.exerciseSets;
    var setId = 0;
    dataSets.forEach((st, index) => {
      var set = {
        setId: setId,
        sessionId: sessionId,
        side: st.side,
        timestamp: st.timestamp
      };
      var dataReps = st.exerciseReps;
      var repId = 0;
      dataReps.forEach(r => {
        var rep = {
          repId: repId,
          setId: setId,
          sessionId: sessionId,
          side: r.side,
          timestamp: r.timestamp
        };
        var dataStats = r.statistics;
        var statId = 0;
        dataStats.forEach(sc => {
          var stat = {
            repId: repId,
            setId: setId,
            sessionId: sessionId,
            statId: statId,
            class: sc.class,
            aggregation: sc.aggregation,
            type: sc.type,
            value: sc.value
          };
          // push stat
          person.stats.push(stat);
          // increment ids
          statId += 1;
        });
        // push rep
        person.reps.push(rep);
        // increment ids
        repId += 1;
      });
      // push set
      person.sets.push(set);
      // increment ids
      setId += 1;
    });
    // push session
    person.sessions.push(session);
    // increment ids
    sessionId += 1;
  });
  person.sessions.sort((x, y) => (x.timestamp > y.timestamp ? 1 : -1));
  person.sets.sort((x, y) => (x.timestamp > y.timestamp ? 1 : -1));
  person.reps.sort((x, y) => (x.timestamp > y.timestamp ? 1 : -1));
  return person;
}

function getDayOfTheYear(date) {
  var start = new Date(date.getFullYear(), 0, 0);
  var diff =
    date -
    start +
    (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  return day;
}
