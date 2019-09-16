import React from 'react';
import firebase from '../../firebase';
import { Input } from '@rebass/forms';
import { Redirect } from 'react-router-dom';
import { GetStore } from '../../models/store/store';

const styles = {
  facebookBtn: {
    backgroundColor: 'rgb(51, 89, 157)'
  },
  form: {
    textAlign: 'center',
    alignContent: 'center',
    width: 'calc(50vw)'
  }
};

class Login extends React.Component {
  state = {
    email: '',
    password: '',
    error: null
  };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleOnSubmit = event => {
    event.preventDefault();
    const { email, password } = this.state;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        GetStore().state.loggedIn = true;
        GetStore().state.activeMenuItem = 'athletes';
        this.props.history.push('/athletes');
      })
      .catch(error => {
        this.setState({ error: error });
      });
  };

  render() {
    const { email, password, error } = this.state;

    if (GetStore().state.loggedIn === true) {
      return <Redirect to="/athletes" />;
    }

    return (
      <div style={{ textAlign: 'center' }}>
        {error ? (
          <h6 style={{ color: 'red', fontWeight: '300' }}>{error.message}</h6>
        ) : null}
        <form className="login-form" onSubmit={this.handleOnSubmit}>
          <h4>Please login</h4>
          <div className="form-group row">
            <Input
              className="input-login"
              type="text"
              name="email"
              placeholder="Email"
              value={email}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group row">
            <Input
              className="input-login"
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group row">
            <button className="btn-login" type="submit">
              Log In
            </button>
          </div>
        </form>
      </div>
    );
  }
}

class Form extends React.Component {
  render() {
    const { children, title } = this.props;
    return (
      <div className="col-md-6 mx-auto">
        <header>
          <h1>{title}</h1>
        </header>
        {children}
      </div>
    );
  }
}

export default Login;
