import React, { Component } from 'react';
import { Message } from 'semantic-ui-react';
import { Menu, Icon, Select } from 'antd';
import '../athletePage.css';
import { observer, Observer } from 'mobx-react';
import { GetStore } from '../../../models/store/store';

const { SubMenu } = Menu;
const { Option } = Select;

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
      console.log(
        'this.storeState.menuSelectedKeys',
        this.storeState.menuSelectedKeys
      );
      console.log('this.storeState.menuParent', this.storeState.menuParent);
      console.log('this.storeState.menuChild', this.storeState.menuChild);
    };

    handleAthleteChange = value => {
      console.log('value', value);
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
      const athleteInfo = ['body weight: ' + this.athlete.bodyWeight];

      return (
        <div>
          <Message
            info
            size="small"
            header={this.athlete.fullName}
            content={athleteInfo}
          />
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
            <SubMenu key="tests" title="Tests">
              <Menu.Item key={`test:${1}`}>Complete</Menu.Item>
              <Menu.Item key={`test:${2}`}>Neuro-muscular</Menu.Item>
            </SubMenu>
            <Menu.Item key="personal-bests">Personal Bests</Menu.Item>
          </Menu>
        </div>
      );
    }
  }
);

export default AthleteMenu;
