import { DataProvider } from '../../providers/data/dataProvider';

var store = (function() {
  var instance;

  function createInstance() {
    var store = new Store();
    return store;
  }

  return {
    getInstance: function() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

export function GetStore() {
  return store.getInstance();
}

class Store {
  constructor(brand) {
    this.initStore();
  }

  async initStore() {
    var provider = new DataProvider();
    this.athlete = await provider.loadAthlete('Glwok6yOD5CgxJJ8x3aq');
    await this.athlete.loadSessionData();
    this.athlete.getPeriodData(new Date(2018, 5, 1), new Date(2019, 9, 31));
  }
}
