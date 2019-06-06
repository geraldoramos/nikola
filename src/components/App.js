import modelImage from  './helpers/model-image'
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTemperatureLow, faTachometerAlt, faBed, faPowerOff } from '@fortawesome/free-solid-svg-icons'
import Maps from './Maps'
const {ipcRenderer, remote} = window.require('electron')
import Actions from './Actions'
import ReactTooltip from 'react-tooltip'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.handleLockClick = this.handleLockClick.bind(this);
    this.handleFanClick = this.handleFanClick.bind(this);
  }

  handleLockClick(event) {
    ipcRenderer.send('door', event.target.name)
  }

  handleFanClick(event) {
    ipcRenderer.send('climate', event.target.name)
  }


  render() {

    if(this.props.vehicle && this.props.vehicle.state === 'asleep'){
        return (
        <div className="container-sleep">
            <div className="exclamation"><FontAwesomeIcon icon={faBed} size="3x" color="#cc0001"/></div>
          <div className="summary">Trying to wake up</div>
          <center><div className="description">Make sure to close other Tesla Apps</div></center>
          <div className="signal"/>
          </div>
        )
    }

    if(this.props.vehicle && this.props.vehicle.state === 'offline'){
      return (
      <div className="container-sleep">
          <div className="exclamation"><FontAwesomeIcon icon={faPowerOff} size="3x" color="#cc0001"/></div>
        <div className="summary">Vehicle is Offline</div>
        <center><div className="description">Internet connection in the car is down</div></center>
        <div className="signal"/>
        </div>
      )
  }

    if(this.props.loading){
      return (
      <div>
        <div className="signal"/>
      </div>
      )
    }

    return (
    <div>
          <div className="car-model">
          <div className="title">
            Tesla {this.props.vehicle.model}
          </div>
          <ReactTooltip place="bottom" id='overview'>
          <div className="tooltip">Charging State: <span>{this.props.status ? this.props.status.chargingState : null }</span></div>
          <div className="tooltip">Battery Level: <span>{this.props.status ? `${this.props.status.batteryLevel}%` : null }</span></div>
          <div className="tooltip">Time to full charge: <span>{this.props.status ? `${this.props.status.timetoFullCharge} hours` : null }</span></div>
          <div className="tooltip">Door: <span>{this.props.status ? this.props.status.locked ? 'Locked' : 'Unlocked': null }</span></div>
          <div className="tooltip">Climate: <span>{this.props.status ? this.props.status.climate ? 'ON' : 'OFF': null }</span></div>
          <div className="tooltip">Odometer: <span>{this.props.status ? this.props.status.odometer : null }</span></div>
          <div className="tooltip">Sentry Mode: <span>{this.props.status ? this.props.status.sentryMode ? 'ON' : 'OFF': null }</span></div>
          <div className="tooltip">Valet Mode: <span>{this.props.status ? this.props.status.valetMode ? 'ON' : 'OFF': null }</span></div>
          </ReactTooltip>
          <a data-tip data-for='overview'><img src={modelImage(this.props.vehicle.model)} width="100" height="40"/></a>
          </div>
          <div className="status">
          <div>
            <span className="description"><FontAwesomeIcon icon={faTachometerAlt} size="1x" color="#1BC47D"/><strong> {!this.props.status.speed ? 'Stopped' : `${this.props.status.speed} mph`} </strong></span>
              </div>
            <div>
            <span className="description"><FontAwesomeIcon name={this.props.status.chargingState} icon={this.props.batteryIcon.type} size="1x" color={this.props.batteryIcon.color}/><strong> {this.props.status.batteryRange} 
            </strong><span className="note"> MI</span></span>
              </div>
            <div>
            <span className="description"><FontAwesomeIcon icon={faTemperatureLow} size="1x" color="#1BC47D"/><strong> {this.props.status.temperature} </strong><span className="note"> F</span></span>
              </div>
            </div>
            <hr/>
            <div className="controls">
            <div className="summary">Controls</div>
            <div className="action-error">{this.props.actionError? 'Action Failed': null}</div>
            <div className="controls-items">
            <Actions type='door' loading={this.props.actionLoading} handle={this.handleLockClick} status={this.props.status.locked} />
            <Actions type='climate' loading={this.props.actionLoading} handle={this.handleFanClick} status={this.props.status.climate} />
            </div>
            </div>
            <hr/>
            <div className="location">
            <div className="summary">Location</div>
            {/* <div className="description">Location as of </div> */}
            <Maps center={this.props.status.location} />
            </div>
      </div>
    );
  }
}

export default App;
