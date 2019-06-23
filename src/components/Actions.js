import React, { Component } from 'react'
import unlock from '../assets/img/unlock.svg'
import lock from '../assets/img/lock.svg'
import nofan from '../assets/img/nofan.svg'
import fan from '../assets/img/fan.svg'
import sentryOn from '../assets/img/sentry-on.svg'
import sentryOff from '../assets/img/sentry-off.svg'
import temp from '../assets/img/temp.svg'

class Actions extends React.Component {
  render() {
    if (this.props.type === 'door') {
      return (
        <div>
          {this.props.loading === 'door-lock' ||
          this.props.loading === 'door-unlock' ? (
            <div className="lds-dual-ring"></div>
          ) : (
            <div onClick={this.props.handle}>
              <img
                title={`Currently ${
                  this.props.status
                    ? 'Locked, click to unlock'
                    : 'Unlocked, click to lock'
                }`}
                name={this.props.status ? 'door-unlock' : 'door-lock'}
                src={this.props.status ? lock : unlock}
              />
            </div>
          )}
        </div>
      )
    }

    if (this.props.type === 'climate') {
      return (
        <div>
          {this.props.loading === 'climate-on' ||
          this.props.loading === 'climate-off' ? (
            <div className="lds-dual-ring"></div>
          ) : (
            <div onClick={this.props.handle}>
              <img
                title={`Climate ${
                  this.props.status
                    ? 'is on, click to turn off'
                    : 'is off, click to turn on'
                }`}
                name={this.props.status ? 'climate-off' : 'climate-on'}
                src={this.props.status ? fan : nofan}
              />
            </div>
          )}
        </div>
      )
    }

    if (this.props.type === 'sentryMode') {
      return (
        <div>
          {this.props.loading === 'sentry-on' ||
          this.props.loading === 'sentry-off' ? (
            <div className="lds-dual-ring"></div>
          ) : (
            <div onClick={this.props.handle}>
              <img
                title={`Sentry mode ${
                  this.props.status
                    ? 'is on, click to turn off'
                    : 'is off, click to turn on'
                }`}
                name={this.props.status ? 'sentry-off' : 'sentry-on'}
                src={this.props.status ? sentryOn : sentryOff}
              />
            </div>
          )}
        </div>
      )
    }

    if (this.props.type === 'climateTemp') {
      return (
        <div>
          {this.props.loading === 'climate-temp' ? (
            <div className="lds-dual-ring"></div>
          ) : (
            <div onClick={this.props.handle}>
              <img
                title={`Set desired temperature`}
                name="climate-temp"
                src={temp}
              />
            </div>
          )}
        </div>
      )
    }
  }
}

export default Actions
