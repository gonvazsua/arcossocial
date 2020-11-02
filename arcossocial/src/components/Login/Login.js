import React, { Component } from 'react';
import './Login.css';
import GlobalState from '../../GlobalState';

export default class Login extends Component {

  static contextType = GlobalState;

  constructor(props) {
    super(props);
    this.state = this.initState();

    this.checkKeepConnected();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  initState() {
    const rememberMe = localStorage.getItem("rememberMe") ? localStorage.getItem("rememberMe") === 'true' : false;
    const userCode = localStorage.getItem("userCode") ? localStorage.getItem("userCode") : '';
    const password = localStorage.getItem("password") ? localStorage.getItem("password") : '';
    return {userCode: userCode, password: password, rememberMe: rememberMe, errorMessage: null};
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  }

  handleLogin(event) {
    const userCode = this.state.userCode;
    const password = this.state.password;
    this.login(userCode, password);
    this.setState({errorMessage: null});
    event.preventDefault();
  }

  login(userCode, password) {
    fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userCode: userCode,
        password: btoa(password),
      })
    })
    .then(res => {
      if(!res.ok) {
        throw new Error("Login incorrecto");
      }
      return res.json();
    })
    .then(data => {
      this.props.handleFunction(data.token);
      if(this.state.rememberMe) {
        localStorage.setItem("rememberMe", true);
        localStorage.setItem("userCode", userCode);
        localStorage.setItem("password", password);
      }
    })
    .catch(err => {
      this.setState({errorMessage: err.message});
      localStorage.clear();
    });
  }

  checkKeepConnected() {
    if(this.state.rememberMe) {
      this.login(this.state.userCode, this.state.password);
    }
  }

  render() {
    return (
      <div className="container">
        <div className="section"></div>
        <div className="row mt5">
          <div className="col s4"></div>
          <form className="col s4" onSubmit={this.handleLogin}>
            <div className="row">
              <div className="input-field col s12">
                <input id="userCode" name="userCode" value={this.state.userCode} onChange={this.handleInputChange} type="text" className="validate" />
                <label htmlFor="userCode">Código de usuario</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <input id="password" name="password" value={this.state.password} onChange={this.handleInputChange} type="password" className="validate" />
                <label htmlFor="password">Contraseña</label>
              </div>
            </div>
            <div className="row">
              <div className="col s12 left-align">
                <p>
                  <label>
                    <input type="checkbox" name="rememberMe" checked={this.state.rememberMe} value={this.state.rememberMe} onChange={this.handleInputChange} />
                    <span>Permanecer conectado</span>
                  </label>
                </p>
              </div>
            </div>
            {this.state.errorMessage &&
              <div className="row">
                <div className="col s12">
                  <div className="alert alert-danger" role="alert">
                    {this.state.errorMessage}
                  </div>
                </div>
              </div>
            }
            <div className="row">
              <div className="col s12 right-align">
                <button className="btn waves-effect waves-light" type="submit" name="login">
                  Acceder
                </button>
              </div>
            </div>
          </form>
          <div className="col s4"></div>
        </div>
      </div>
    )
  }

}