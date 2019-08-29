import React, { Component } from 'react';
import { Message } from 'semantic-ui-react';
import { Menu, Icon } from 'antd';
import '../athletePage.css';
import { observer } from 'mobx-react';
import { GetStore } from '../../../models/store/store';

const { SubMenu } = Menu;

const AthleteMenu = observer(
  class AthleteMenu extends Component {
    constructor(props) {
      super(props);
      this.state = {
        mounted: false
      };
      this.setStateFromProps(props);
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

    handleItemClick = (item, key, keyPath, domEvent) => {
      this.storeState.menuParent = item.keyPath[item.keyPath.length - 1];
      this.storeState.menuChild = item.keyPath[0];
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
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
          >
            <Menu.Item key="overview">Overview</Menu.Item>
            <SubMenu key="exercises" title="Exercises">
              {this.athlete.loaded &&
                this.athlete.period.summary.exercises.map((e, index) => (
                  <Menu.Item key={`exercise:${index}`}>{e.exercise}</Menu.Item>
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
