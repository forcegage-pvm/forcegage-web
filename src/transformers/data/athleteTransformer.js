import ApolloClient, { gql } from 'apollo-boost';

const client = new ApolloClient({
  uri: 'https://forcegage-gcp.appspot.com/graphql/'
});

export default class AthleteTransformer {
  //           Athlete
  // --------------------------
  //   |         |         |
  //  Days    Weights  Exercises
  //   |
  //  -----------------
  //   |          |
  // Weights  Exercises
  //              |
  //             Side
  async getDays() {
    var data = await this.getData(7);
    //person.person
    //person.id
    //person.sessions
    //sessions[0..15]
    //session.exercise
    //session.timestamp
    //session.weight
    //session.year
    //session.exerciseSets[0..2]
    //exerciseSet.setNo
    //exerciseSet.side
    //exerciseSet.timestamp
    //exerciseSet.exerciseReps[0..5]
    //exerciseRep.id
    //exerciseRep.repNo
    //exerciseRep.timeStamp
    //exerciseRep.statistics[0..50]
    //statistic.class
    //statistic.aggregation
    //statistic.type
    //statistic.value
  }

  getProps(object) {}

  async getData(id) {
    var data = await client.query({
      headers: { 'Content-Type': 'application/json' },
      query: gql`
        {
          person(id: 7) {
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
    return data.data;
  }
}
