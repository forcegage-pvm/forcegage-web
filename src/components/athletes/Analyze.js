import React, { Component } from 'react';
// import PropTypes from 'prop-types'
import { Tabs, useTabState, Panel } from '@bumaga/tabs';
import ChartWeightEC from '../../components/charts/ChartWeightEC';
import { statsTransformer } from '../../transformers/data/StatsTransformer';
import { motion, AnimatePresence } from 'framer-motion';

import './Analyze.css';

const cn = (...args) => args.filter(Boolean).join(' ');

const Tab = ({ children }) => {
  const { isActive, onClick } = useTabState();

  return (
    <button className={cn('tab', isActive && 'active')} onClick={onClick}>
      {children}
    </button>
  );
};

export default class Analyze extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Statistics: props.statistics
    };
  }

  getStatistics() {
    const { Statistics } = this.state;
    var fmax = statsTransformer(Statistics, 'fmax', 'avg');
    var power = statsTransformer(Statistics, 'power', 'avg');
    var force = statsTransformer(Statistics, 'force', 'avg');
    var velocity = statsTransformer(Statistics, 'velocity', 'avg');
    var contactTime = statsTransformer(Statistics, 'contact-time', 'avg');
    var switchOver = statsTransformer(
      Statistics,
      'time-to-fmax-ec-switchover',
      'avg'
    );

    this.setState(
      {
        Fmax: fmax,
        Power: power,
        Force: force,
        Velocity: velocity,
        ContactTime: contactTime,
        SwitchOver: switchOver
      },
      () => {}
    );
  }

  getFmaxChart() {
    const { Fmax } = this.state;
    return (
      <ChartWeightEC
        data={Fmax}
        title="Fmax"
        unit="s"
        showEC={false}
      ></ChartWeightEC>
    );
  }

  render() {
    const { Statistics } = this.state;
    const Fmax = statsTransformer(Statistics, 'fmax', 'avg');
    const Power = statsTransformer(Statistics, 'power', 'avg');
    const Force = statsTransformer(Statistics, 'force', 'avg');
    const Velocity = statsTransformer(Statistics, 'velocity', 'avg');
    const ContactTime = statsTransformer(Statistics, 'contact-time', 'avg');
    const SwitchOver = statsTransformer(
      Statistics,
      'time-to-fmax-ec-switchover',
      'avg'
    );
    const Acceleration = statsTransformer(Statistics, 'acceleration', 'avg');

    return (
      <Tabs>
        <div className="tabs">
          <div className="tab-list">
            <Tab>Fmax</Tab>
            <Tab>Power</Tab>
            <Tab>Force</Tab>
            <Tab>Contact Time</Tab>
            <Tab>Velocity</Tab>
            <Tab>EC SwitchOver</Tab>
            <Tab>Acceleration</Tab>
          </div>

          <div className="tab-progress" />

          <Panel>
            <p>
              <ChartWeightEC
                data={Fmax}
                title="Fmax"
                unit="kgf"
                showEC={false}
              ></ChartWeightEC>
            </p>
          </Panel>

          <Panel>
            <p>
              <ChartWeightEC
                data={Power}
                title="Power"
                unit="W"
                showEC={true}
              ></ChartWeightEC>
            </p>
          </Panel>
          <Panel>
            <p>
              <ChartWeightEC
                data={Force}
                title="Force"
                unit="kgf"
                showEC={true}
              ></ChartWeightEC>
            </p>
          </Panel>
          <Panel>
            <p>
              <ChartWeightEC
                data={ContactTime}
                title="Contact Time"
                unit="s"
                showEC={false}
              ></ChartWeightEC>
            </p>
          </Panel>
          <Panel>
            <p>
              <ChartWeightEC
                data={Velocity}
                title="Velocity"
                unit="deg/s"
                showEC={false}
              ></ChartWeightEC>
            </p>
          </Panel>
          <Panel>
            <p>
              <ChartWeightEC
                data={SwitchOver}
                title="Switch Over"
                unit="s"
                showEC={false}
              ></ChartWeightEC>
            </p>
          </Panel>
          <Panel>
            <p>
              <ChartWeightEC
                data={Acceleration}
                title="Acceleration"
                unit="m/s"
                showEC={false}
              ></ChartWeightEC>
            </p>
          </Panel>
        </div>
      </Tabs>
    );
  }
}
