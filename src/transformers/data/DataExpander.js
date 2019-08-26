export default function Expander(data) {
  console.log('data', data);
  // var dataPerson = data.person;
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
  console.log('dataSessions', dataSessions);
  dataSessions.forEach((s, index) => {
    sessionId = s.id;
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
      timestamp: s.timestamp,
      hour: date.getHours(),
      time: date.toLocaleTimeString(),
      timeOfDay: date.getHours() < 12 ? 'AM' : 'PM'
    };
    s.id = sessionId;
    console.log('session', session);
    // extract all sets and expand them
    var dataSets = s.exerciseSets;
    dataSets.forEach((st, index) => {
      var set = {
        setId: st.id,
        sessionId: sessionId,
        side: st.side,
        timestamp: st.timestamp
      };
      var dataReps = st.exerciseReps;
      dataReps.forEach(r => {
        var rep = {
          repId: r.id,
          setId: st.id,
          sessionId: sessionId,
          side: r.side,
          timestamp: r.timestamp
        };
        var dataStats = r.statistics;
        dataStats.forEach(sc => {
          var stat = {
            repId: r.id,
            setId: st.id,
            sessionId: sessionId,
            statId: sc.id,
            class: sc.class,
            aggregation: sc.aggregation,
            type: sc.type,
            value: sc.value
          };
          // push stat
          person.stats.push(stat);
        });
        // push rep
        person.reps.push(rep);
      });
      // push set
      person.sets.push(set);
    });
    // push session
    person.sessions.push(session);
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
