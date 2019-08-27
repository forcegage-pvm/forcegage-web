export class Stats {
  constructor(stats, bodyWeight, aggregation, statsProvider) {
    var stats = this.getStats(stats, bodyWeight, aggregation, statsProvider);
    this.max = [];
    this.avg = [];
    stats.forEach(stat => {
      var max = stat.values.Max('value')[0];
      if (!isNaN(max)) {
        this.max.push({
          value: max,
          name: stat.name,
          unit: stat.unit,
          best: stat.best
        });
      }
      var avg = stat.values.Avg('value')[0];
      if (!isNaN(avg)) {
        this.avg.push({
          value: avg,
          name: stat.name,
          unit: stat.unit,
          best: stat.best
        });
      }
    });
  }

  getStats(stats, bodyWeight, aggregation, statsProvider) {
    var summary = [];
    summary.push({
      values: statsProvider.filterStats(stats, 'Total', 'force', 'tm'),
      name: 'force',
      unit: 'kgf',
      best: 'highest'
    });
    summary.push({
      values: statsProvider.filterStats(stats, 'Total', 'power', 'tm'),
      name: 'power',
      unit: 'W',
      best: 'highest'
    });
    summary.push({
      values: statsProvider.filterStats(stats, 'Total', 'fmax', 'avg'),
      name: 'fmax',
      unit: 'kgf',
      best: 'highest'
    });
    summary.push({
      values: statsProvider.filterStats(stats, 'Total', 'rfd', 'avg'),
      name: 'rfd',
      unit: 'kgf/s',
      best: 'highest'
    });
    summary.push({
      values: statsProvider.filterStats(stats, 'Total', 'time-to-fmax', 'avg'),
      name: 'time to fmax',
      unit: 's',
      best: 'lowest'
    });
    summary.push({
      values: statsProvider.filterStats(stats, 'Total', 'velocity', 'avg'),
      name: 'velocity',
      unit: 'm/s',
      best: 'highest'
    });
    summary.push({
      values: statsProvider.filterStats(
        stats,
        'Total',
        'power-to-weight',
        'avg'
      ),
      name: 'power-to-weight',
      unit: 'W/kg',
      best: 'highest'
    });
    summary.push({
      values: statsProvider.filterStats(stats, 'Total', 'acceleration', 'avg'),
      name: 'acceleration',
      unit: 'm/s^2',
      best: 'highest'
    });
    summary.push({
      values: statsProvider.filterStats(
        stats,
        'Eccentric',
        'displacement',
        'avg'
      ),
      name: 'displacement-eccentric',
      unit: 'deg',
      best: 'highest'
    });
    summary.push({
      values: statsProvider.filterStats(
        stats,
        'Concentric',
        'displacement',
        'avg'
      ),
      name: 'displacement-concentric',
      unit: 'deg',
      best: 'highest'
    });
    summary.push({
      values: statsProvider.filterStats(stats, 'Total', 'contact-time', 'avg'),
      name: 'contact-time',
      unit: 's',
      best: 'highest'
    });
    summary.push({
      values: statsProvider.filterStats(
        stats,
        'Total',
        'catch-release-rel',
        'avg'
      ),
      name: 'catch-release-relative',
      unit: '%',
      best: 'highest'
    });
    summary.push({
      values: statsProvider.filterStats(
        stats,
        'Total',
        'catch-release-abs',
        'avg'
      ),
      name: 'catch-release',
      unit: 'ms',
      best: 'highest'
    });
    summary.push({
      values: statsProvider.filterStats(
        stats,
        'Total',
        'time-to-fmax-ec-switchover',
        'avg'
      ),
      name: 'time-to-fmax-ec-switchover',
      unit: 's',
      best: 'highest'
    });
    return summary;
  }
}
