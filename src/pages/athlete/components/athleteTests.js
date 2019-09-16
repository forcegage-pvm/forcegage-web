import React, { Component } from 'react';
import { Breadcrumb } from 'antd';
import { observer } from 'mobx-react';
import { GetStore } from '../../../models/store/store';
import { Timeline, Icon as IconAnt } from 'antd';
import { Header, Icon } from 'semantic-ui-react';
import _ from 'lodash';

const AthleteTests = observer(
  class AthleteTests extends Component {
    constructor(props) {
      super(props);
      this.state = {
        mounted: false
      };
      this.athlete = GetStore().athlete;
      this.storeState = GetStore().state;
    }

    setStateFromProps = props => {
      this.setState({}, () => {});
    };

    componentWillReceiveProps = props => {
      this.setStateFromProps(props);
    };

    componentDidMount = () => {
      this.setState({
        mounted: true
      });
    };

    onClick = e => {
      e.preventDefault();
    };

    render() {
      return (
        <div>
          <Header as="h3">
            <Icon name="heartbeat" color="green" />
            <Header.Content>Tests</Header.Content>
          </Header>
          <Timeline mode="alternate" style={{ width: '450px' }}>
            {this.athlete.tests.map(test => {
              if (test.complete === false) {
                return (
                  <Timeline.Item onClick={this.selectTest} position="right">
                    <a href="" onClick={this.onClick}>
                      <span>
                        <span style={{ fontWeight: '600' }}>{test.test}</span>
                        <span style={{ fontWeight: '200' }}>
                          {' ' + test.class + ' (' + test.group + ')'}
                        </span>
                      </span>
                    </a>
                  </Timeline.Item>
                );
              } else {
                return (
                  <Timeline.Item
                    dot={<Icon name="heart" style={{ fontSize: '16px' }} />}
                    color="red"
                  >
                    <a href="" onClick={this.onClick}>
                      <span>
                        <span style={{ fontWeight: '600' }}>{test.test}</span>
                        <span style={{ fontWeight: '200' }}>
                          {' ' + test.class + ' (' + test.group + ')'}
                        </span>
                      </span>
                    </a>
                  </Timeline.Item>
                );
              }
            })}
            {/* <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                    <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
                    <Timeline.Item dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />} color="red">Technical testing 2015-09-01</Timeline.Item>
                    <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item> */}
          </Timeline>
          ,
        </div>
      );
    }
  }
);

export default AthleteTests;
