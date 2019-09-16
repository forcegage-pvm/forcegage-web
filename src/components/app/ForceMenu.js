import React, { Component } from 'react';
import { Input, Menu, Icon } from 'semantic-ui-react';
import {
  BrowserRouter as Router,
  Route,
  NavLink,
  Redirect
} from 'react-router-dom';
import Athletes from '../athletes/Athletes';
import { observer } from 'mobx-react';
import AthletePage from '../../pages/athlete/athletePage';
import AthleteList from '../../pages/athlete/components/athleteList';
import Login from './Login';
import Home from '../app/Home';
import forceicon from '../../assets/forceicon.png';
import { ReactComponent as WeightLifter } from '../../assets/weightlifter.svg';
import { GetStore } from '../../models/store/store';
import '../app/App.css';

const ForceMenu = observer(
  class ForceMenu extends Component {
    constructor(props) {
      super(props);
      this.athlete = GetStore().athlete;
    }

    handleItemClick = (e, { name }) => (GetStore().state.activeMenuItem = name);

    logOutUser = () => {
      GetStore().logOut();
    };

    render() {
      const athleteInfo = ['body weight: ' + this.athlete.bodyWeight];
      const loggedIn = GetStore().state.loggedIn;

      return (
        <Router>
          <Route
            render={({ location, history }) => (
              <React.Fragment style={{ margin: '0px' }}>
                <Menu
                  style={{ backgroundColor: '#F6FBFF' }}
                  className="Menu"
                  secondary
                >
                  {this.athlete.fullName !== ' ' && loggedIn ? (
                    <div className="athlete-content">
                      <div className="athlete-image">
                        <WeightLifter className="athlete-image-content"></WeightLifter>
                      </div>
                      <div className="athlete-info">
                        <div className="athlete-name">
                          {this.athlete.fullName}
                        </div>
                        <div className="athlete-details">{athleteInfo}</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ width: '250px' }}></div>
                  )}
                  <img
                    className="Menu-image"
                    src={forceicon}
                    alt="forcelogo"
                  ></img>
                  <h4 className="Menu-header">ForceGage</h4>
                  <Menu.Menu position="left">
                    {this.props.authenticated && (
                      <Menu.Item
                        name="athletes"
                        active={GetStore().state.activeMenuItem === 'athletes'}
                        onClick={this.handleItemClick}
                      >
                        <NavLink to="/athletes">Athletes</NavLink>
                      </Menu.Item>
                    )}
                    {this.props.authenticated && (
                      <Menu.Item
                        name="analysis"
                        active={GetStore().state.activeMenuItem === 'analysis'}
                        onClick={this.handleItemClick}
                      >
                        <NavLink to="/analysis">Analysis</NavLink>
                      </Menu.Item>
                    )}
                    {!this.props.authenticated && (
                      <Menu.Item
                        name="login"
                        active={GetStore().state.activeMenuItem === 'login'}
                        onClick={this.handleItemClick}
                      >
                        <NavLink to="/login">Login</NavLink>
                      </Menu.Item>
                    )}
                  </Menu.Menu>
                  {this.props.authenticated && (
                    <Menu.Menu position="right">
                      <Menu.Item>
                        <Input icon="search" placeholder="Search..." />
                      </Menu.Item>
                      <Menu.Item
                        name="logout"
                        active={GetStore().state.activeMenuItem === 'logout'}
                        onClick={this.logOutUser}
                      >
                        <NavLink to="/login">Logout</NavLink>
                      </Menu.Item>
                    </Menu.Menu>
                  )}
                </Menu>
                {this.props.authenticated && <Redirect to="/athletes" />}
                {!this.props.authenticated && <Redirect to="/login" />}
                <main>
                  <Route path="/home" component={props => <Home />} />
                  <Route path="/login" component={props => <Login />} />
                  {this.props.authenticated && (
                    <Route
                      path="/athletes"
                      component={props => <AthleteList />}
                    />
                  )}
                  <Route
                    path="/analysis"
                    component={props => <AthletePage />}
                  />
                </main>
              </React.Fragment>
            )}
          />
        </Router>
      );
    }
  }
);

export default ForceMenu;
