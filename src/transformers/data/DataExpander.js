export default function Expander(data) {
  // var dataPerson = data.person;
  var dataPerson = data;
  var person = {
    id: dataPerson.id,
    sessions: [],
    reps: [],
    sets: [],
    stats: []
  };
  var dataSessions = dataPerson.sessions;
  // extract all sessions and expand them
  var sessionId = -1;
  var setId = -1;
  var repId = -1;
  var statId = -1;
  dataSessions.forEach((s, index) => {
    sessionId++;
    var date = new Date(s.timestamp);
    var session = {
      sessionId: sessionId,
      exercise: s.exercise,
      weight: Number(s.weight),
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
      timeOfDay: date.getHours() < 12 ? 'AM' : 'PM',
      sessionType: s.sessionType,
      testSession: s.testSession
    };
    if (session.sessionType === 'test') {
      var dateIndex = session.testSession.indexOf(')') + 1;
      session.testDate = new Date(
        session.testSession.slice(dateIndex + 1, dateIndex + 11)
      );
      session.testId = Number(session.testSession.slice(1, dateIndex - 1));
    }
    s.id = sessionId;
    // extract all sets and expand them
    var dataSets = s.sets;
    dataSets.forEach((st, index) => {
      setId++;
      var set = {
        setId: setId,
        sessionId: sessionId,
        side: st.side,
        timestamp: s.timestamp
      };
      var dataReps = st.reps;
      dataReps.forEach(r => {
        repId++;
        var rep = {
          repId: repId,
          setId: setId,
          sessionId: sessionId,
          side: r.side,
          timestamp: s.timestamp
        };
        Object.keys(r).forEach(function(type, index) {
          if (typeof r[type] === 'object') {
            statId++;
            var sc = r[type];
            Object.keys(sc).forEach(function(cls, index) {
              if (
                cls === 'avg' ||
                cls === 'max' ||
                cls === 'tm' ||
                cls === 'min'
              ) {
                var stat = {
                  repId: repId,
                  setId: setId,
                  sessionId: sessionId,
                  statId: statId,
                  class: 'Total',
                  aggregation: cls,
                  type: type,
                  value: sc[cls]
                };
                person.stats.push(stat);
              } else {
                Object.keys(sc[cls]).forEach(function(agr, index) {
                  var stat = {
                    repId: repId,
                    setId: setId,
                    sessionId: sessionId,
                    statId: statId,
                    class: cls,
                    aggregation: agr,
                    type: type,
                    value: sc[cls][agr]
                  };
                  person.stats.push(stat);
                });
              }
            });
          }
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
