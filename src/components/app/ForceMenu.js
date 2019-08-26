import React, { Component } from 'react';
import { Input, Menu } from 'semantic-ui-react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Athletes from '../athletes/Athletes';
import MonthCalendar from '../calendar/MonthCalendar';
import MonthCalendarContainer from '../calendar/MonthCalendarContainer';
import Home from '../app/Home';
import forceicon from '../../assets/forceicon.png';
import '../app/App.css';

export default class ForceMenu extends Component {
  state = { activeItem: 'athletes' };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <Router>
        <Route
          render={({ location, history }) => (
            <React.Fragment>
              <Menu className="Menu" secondary>
                <img
                  className="Menu-image"
                  src={forceicon}
                  alt="forcelogo"
                ></img>
                <h4 className="Menu-header">ForceGage</h4>
                <Menu.Menu position="left">
                  <Menu.Item
                    name="athletes"
                    active={activeItem === 'athletes'}
                    onClick={this.handleItemClick}
                  >
                    <Link to="/athlete">Athlete</Link>
                  </Menu.Item>
                  <Menu.Item
                    name="analysis"
                    active={activeItem === 'analysis'}
                    onClick={this.handleItemClick}
                  >
                    <Link to="/analysis">Analysis</Link>
                  </Menu.Item>
                  <Menu.Item
                    name="setup"
                    active={activeItem === 'setup'}
                    onClick={this.handleItemClick}
                  />
                </Menu.Menu>
                <Menu.Menu position="right">
                  <Menu.Item>
                    <Input icon="search" placeholder="Search..." />
                  </Menu.Item>
                  <Menu.Item
                    name="logout"
                    active={activeItem === 'logout'}
                    onClick={this.handleItemClick}
                  />
                </Menu.Menu>
              </Menu>
              <main>
                <Route path="/home" component={props => <Home />} />
                <Route path="/athlete" component={props => <Athletes />} />
                <Route
                  path="/analysis"
                  component={props => <MonthCalendarContainer />}
                />
              </main>
            </React.Fragment>
          )}
        />
      </Router>
    );
  }
}
