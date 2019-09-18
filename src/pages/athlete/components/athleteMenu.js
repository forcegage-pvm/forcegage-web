import React, { Component } from 'react';
import { Message } from 'semantic-ui-react';
import { Menu, Badge, Select } from 'antd';
import '../athletePage.css';
import { observer, Observer } from 'mobx-react';
import { GetStore } from '../../../models/store/store';
import _ from 'lodash';

const { SubMenu } = Menu;
const { Option } = Select;

const styles = {
  width: 250,
  display: 'inline-table',
  marginRight: 10
};

const AthleteMenu = observer(
  class AthleteMenu extends Component {
    constructor(props) {
      super(props);
      this.state = {
        mounted: false
      };
      // this.setStateFromProps(props);
      this.athlete = GetStore().athlete;
      this.exercises = GetStore().athlete.exercises;
      this.athletes = GetStore().athletes;
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

    handleItemClick = item => {
      this.storeState.menuSelectedKeys = item.keyPath;
      this.storeState.menuParent = item.keyPath[item.keyPath.length - 1];
      this.storeState.menuChild = item.keyPath[0];
      this.storeState.menuSelected = true;
      this.storeState.selectedDay = 'overall';
    };

    handleAthleteChange = value => {
      GetStore().loadAthlete(value);
    };

    getAthleteHeader = () => {
      var key = 0;
      return (
        <Select
          style={{ fontWeight: '600', fontSize: '1.3em', color: 'red' }}
          size="large"
          // defaultValue={this.athletes && this.athletes[0].id}
          onChange={this.handleAthleteChange}
          style={{ width: 200 }}
        >
          {this.athletes.map(athlete => {
            key++;
            return <Option key={athlete.id}>{athlete.fullName}</Option>;
          })}
        </Select>
      );
    };

    shouldComponentUpdate = () => {
      return true;
    };

    render() {
      return (
        <div>
          <Menu
            onClick={this.handleItemClick}
            defaultSelectedKeys={'overview'}
            selectedKeys={this.storeState.menuSelectedKeys}
            defaultOpenKeys={['exercises']}
            mode="inline"
          >
            <Menu.Item key="overview">Overview</Menu.Item>
            <SubMenu key="exercises" title="Exercises">
              {this.athlete.exercises.map((e, index) => (
                <Menu.Item key={`exercise:${e}`}>{e}</Menu.Item>
              ))}
            </SubMenu>
            <Menu.Item key={`tests`} title="Tests">
              <Badge
                count={this.athlete.tests.length}
                style={{ backgroundColor: '#E2F1F0', color: 'black' }}
                showZero
                offset={[10, 0]}
              >
                Tests
              </Badge>
            </Menu.Item>
            <Menu.Item key="personal-bests">Personal Bests</Menu.Item>
          </Menu>
        </div>
      );
    }
  }
);

export default AthleteMenu;
