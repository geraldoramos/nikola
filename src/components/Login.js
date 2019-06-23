import React, { Component } from 'react'
const { ipcRenderer, remote } = window.require('electron')
import logo from '../assets/img/logo.svg'

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = { username: '', password: '', error: null, loading: false }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    const value = event.target.value
    const name = event.target.name
    this.setState({
      [name]: value
    })
  }

  handleSubmit(event) {
    event.preventDefault()
    ipcRenderer.send('login-attempt', {
      username: this.state.username,
      password: this.state.password
    })
    this.setState({ loading: true })
    ipcRenderer.on(
      'login-failed',
      function(event, store) {
        console.log(store)
        this.setState({
          error: store,
          loading: false
        })
      }.bind(this)
    )
  }

  render() {
    if (this.state.loading) {
      return (
        <div>
          <div className="signal" />
        </div>
      )
    }

    return (
      <div className="container-login">
        <div className="logo-center">
          <img src={logo} width="200px" />
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <div className="login-error">
              {this.state.error ? 'Login Failed' : null}
            </div>
            <label>Email address</label>
            <input
              required
              type="email"
              name="username"
              value={this.state.email}
              onChange={this.handleChange}
              className="form-control"
              placeholder="Enter email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              required
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handleChange}
              className="form-control"
              placeholder="Enter Password"
            />
          </div>
          <div className="col-md-12 text-center ">
            <p className="disclaimer text-center">
              Auth token is stored locally and is not sent anywhere besides
              Tesla servers. To remove the token from this computer, just
              logout.
            </p>
            <button
              type="submit"
              className=" btn btn-block mybtn btn-primary tx-tfm"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default Login
