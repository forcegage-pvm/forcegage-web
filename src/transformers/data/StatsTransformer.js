const emptyStatRecord = {
  total: 0.0,
  concentric: 0.0,
  eccentric: 0.0
};

export function statsTransformer(data, key, type) {
  var result = [];
  let index = 0;
  data.map(data => {
    var curStat = result.find(function(stat) {
      return stat.timestamp == data.timestamp;
    });
    if (curStat == undefined) {
      var date = new Date(data.date);
      curStat = {
        key: index,
        timestamp: data.timestamp,
        name: data.weight,
        weight: data.weight,
        both: {
          total: 0.0,
          concentric: 0.0,
          eccentric: 0.0,
          max: false,
          min: false
        },
        left: {
          total: 0.0,
          concentric: 0.0,
          eccentric: 0.0,
          devFromMax: 0.0,
          max: false,
          min: false
        },
        right: {
          total: 0.0,
          concentric: 0.0,
          eccentric: 0.0,
          max: false,
          min: false
        },
        devSide: 0,
        maxDevSide: false,
        devSideMax: 0,
        maxDevSideMax: false,
        devFromMax: 0,
        maxDevFromMax: false,
        devDown: 0,
        devDownMax: false,
        dayOfYear: data.dayOfYear,
        date: data.date,
        displayDate: new Date(data.date).toISOString().slice(0, 10)
      };
      result.push(curStat);
      index += 1;
    }
    if (data.type == key && data.aggregation == type) {
      if (data.side == 'Left') {
        if (data.class == 'Total') {
          curStat.left.total = Number(data.value);
        }
        if (data.class == 'Concentric') {
          curStat.left.concentric = Number(data.value);
        }
        if (data.class == 'Eccentric') {
          curStat.left.eccentric = Number(data.value);
        }
      }
      if (data.side == 'Right') {
        if (data.class == 'Total') {
          curStat.right.total = Number(data.value);
        }
        if (data.class == 'Concentric') {
          curStat.right.concentric = Number(data.value);
        }
        if (data.class == 'Eccentric') {
          curStat.right.eccentric = Number(data.value);
        }
      }
      if (data.side == 'Both') {
        if (data.class == 'Total') {
          curStat.both.total = Number(data.value);
        }
        if (data.class == 'Concentric') {
          curStat.both.concentric = Number(data.value);
        }
        if (data.class == 'Eccentric') {
          curStat.both.eccentric = Number(data.value);
        }
      }
    }
  });
  result.sort(function(a, b) {
    return a.name - b.name;
  });
  var combined = combineData(result);
  getDeviations(combined);
  return combined;
}

function getDeviations(data) {
  const { LeftMax, RightMax, BothMax } = getMaxValues(data);
  for (var id in data) {
    var current = data[id];
    current.devSide = 1 - current.right.total / current.left.total;
    current.right.total = Number(current.right.total);
    current.left.total = Number(current.left.total);
    current.both.total = Number(current.both.total);
    current.both.devFromMax = 1 - current.both.total / BothMax.value;
    current.devFromMax =
      1 -
      (current.right.total + current.left.total + current.both.total) /
        (RightMax.value + LeftMax.value + BothMax.value);
    if (id == 0) continue;
    var previous = data[id - 1];
    current.devDown =
      1 -
      (previous.right.total + previous.left.total + previous.both.total) /
        (current.right.total + current.left.total + current.both.total);
  }
  getDevMaxValues(data);
}

function getDevMaxValues(data) {
  var leftMax = { value: 0.0, id: -1 };
  var rightMax = { value: 0.0, id: -1 };
  var bothMax = { value: 0.0, id: -1 };
  var allMax = { value: 0.0, id: -1 };
  var downMax = { value: 0.0, id: -1, absValue: 0.0 };
  var sideMax = { value: 0.0, id: -1, absValue: 0.0 };
  for (var id in data) {
    var record = data[id];
    if (record.both.devFromMax > bothMax.value) {
      bothMax.value = record.both.devFromMax;
      bothMax.id = id;
    }
    if (record.devFromMax > allMax.value) {
      allMax.value = record.devFromMax;
      allMax.id = id;
    }
    if (Math.abs(record.devSide) > sideMax.absValue) {
      sideMax.absValue = Math.abs(record.devSide);
      sideMax.value = record.devSide;
      sideMax.id = id;
    }
    if (record.devDown > downMax.value) {
      downMax.absValue = Math.abs(record.devDown);
      downMax.value = record.devDown;
      downMax.id = id;
    }
  }
  if (leftMax.id >= 0) {
    data[leftMax.id].left.maxDevFromMax = true;
  }
  if (rightMax.id >= 0) {
    data[rightMax.id].right.maxDevFromMax = true;
  }
  if (bothMax.id >= 0) {
    data[bothMax.id].both.maxDevFromMax = true;
  }
  if (allMax.id >= 0) {
    data[allMax.id].maxDevFromMax = true;
  }
  if (sideMax.id >= 0) {
    data[sideMax.id].maxDevSide = true;
  }
  if (downMax.id >= 0) {
    data[downMax.id].devDownMax = true;
  }
  data.forEach((record, index) => {
    record.devSideMax = 1 - record.devSide / sideMax.value;
  });
  sideMax = { value: 0.0, id: -1 };
  data.forEach((record, index) => {
    if (record.devSideMax > sideMax.value) {
      sideMax.value = record.devSideMax;
      sideMax.id = index;
    }
  });
  if (sideMax.id >= 0) {
    data[sideMax.id].maxDevSideMax = true;
  }
}

function getMaxValues(data) {
  var leftMax = { value: 0.0, id: -1 };
  var rightMax = { value: 0.0, id: -1 };
  var bothMax = { value: 0.0, id: -1 };
  var leftMin = { value: 100000000.0, id: -1 };
  var rightMin = { value: 100000000.0, id: -1 };
  var bothMin = { value: 100000000.0, id: -1 };
  for (var id in data) {
    var record = data[id];
    if (record.left.total > leftMax.value) {
      leftMax.value = record.left.total;
      leftMax.id = id;
    }
    if (record.right.total > rightMax.value) {
      rightMax.value = record.right.total;
      rightMax.id = id;
    }
    if (record.both.total > bothMax.value) {
      bothMax.value = record.both.total;
      bothMax.id = id;
    }
    if (record.left.total < leftMin.value) {
      leftMin.value = record.left.total;
      leftMin.id = id;
    }
    if (record.right.total < rightMin.value) {
      rightMin.value = record.right.total;
      rightMin.id = id;
    }
    if (record.both.total < bothMin.value) {
      bothMin.value = record.both.total;
      bothMin.id = id;
    }
  }
  if (leftMax.id >= 0) {
    data[leftMax.id].left.max = true;
  }
  if (rightMax.id >= 0) {
    data[rightMax.id].right.max = true;
  }
  if (bothMax.id >= 0) {
    data[bothMax.id].both.max = true;
  }
  if (leftMin.id >= 0) {
    data[leftMin.id].left.min = true;
  }
  if (rightMin.id >= 0) {
    data[rightMin.id].right.min = true;
  }
  if (bothMin.id >= 0) {
    data[bothMin.id].both.min = true;
  }
  return {
    LeftMax: leftMax,
    RightMax: rightMax,
    BothMax: bothMax
  };
}

function combineData(data) {
  var result = [];
  data.forEach((record, index) => {
    var records = data.filter(function(stat) {
      return stat.date === record.date && stat.weight === record.weight;
    });
    var curStat = {
      key: record.key,
      timestamp: record.timestamp,
      name: record.name,
      weight: record.weight,
      both: {
        total: Number(0.0),
        concentric: Number(0.0),
        eccentric: Number(0.0),
        max: record.both.max,
        min: record.both.min
      },
      left: {
        total: Number(0.0),
        concentric: Number(0.0),
        eccentric: Number(0.0),
        max: record.left.max,
        min: record.left.min
      },
      right: {
        total: Number(0.0),
        concentric: Number(0.0),
        eccentric: Number(0.0),
        max: record.right.max,
        min: record.right.min
      },
      devSide: record.devSide,
      devDown: record.devDown,
      dayOfYear: record.dayOfYear,
      date: record.date,
      displayDate: record.displayDate,
      maxDevSide: record.maxDevSide,
      devFromMax: record.devFromMax,
      maxDevFromMax: record.maxDevFromMax,
      devSideMax: record.devSideMax,
      maxDevSideMax: record.maxDevSideMax
    };
    records.forEach(dupRecord => {
      curStat.left.total += Number(dupRecord.left.total);
      curStat.left.concentric += Number(dupRecord.left.concentric);
      curStat.left.eccentric += Number(dupRecord.left.eccentric);
      curStat.right.total += Number(dupRecord.right.total);
      curStat.right.concentric += Number(dupRecord.right.concentric);
      curStat.right.eccentric += Number(dupRecord.right.eccentric);
      curStat.both.total += Number(dupRecord.both.total);
      curStat.both.concentric += Number(dupRecord.both.concentric);
      curStat.both.eccentric += Number(dupRecord.both.eccentric);
    });
    var exist = result.find(function(stat) {
      return stat.date === record.date && stat.weight === record.weight;
    });
    if (exist === undefined) {
      result.push(curStat);
    }
  });
  return result;
}
