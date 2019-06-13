import modelImage from  './helpers/model-image'
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTemperatureLow, faTachometerAlt, faBed, faPowerOff, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import Maps from './Maps'
const {ipcRenderer, remote} = window.require('electron')
import Actions from './Actions'
import ReactTooltip from 'react-tooltip'
import cToF from './helpers/c-to-f'
import fToC from './helpers/f-to-c'
import mToKm from './helpers/m-to-km'
import Modal from './Modal'
const { shell } = require('electron')

class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      climateTempShowModal: false
  };
    this.handleLockClick = this.handleLockClick.bind(this);
    this.handleFanClick = this.handleFanClick.bind(this);
    this.handleClimateTempClick = this.handleClimateTempClick.bind(this);
    this.handleClimateTempOk = this.handleClimateTempOk.bind(this);
    this.handleClimateTempCancel = this.handleClimateTempCancel.bind(this);
    this.handleOpenMapClick = this.handleOpenMapClick.bind(this);
  }

  handleLockClick(event) {
    ipcRenderer.send('door', event.target.name)
  }

  handleFanClick(event) {
    ipcRenderer.send('climate', event.target.name)
  }

  handleSentryClick(event) {
    ipcRenderer.send('sentryMode', event.target.name)
  }

  handleClimateTempClick(){
    this.setState({climateTempShowModal:true})
  }

  handleOpenMapClick(){
    shell.openExternal(`https://www.google.com/maps/search/?api=1&query=${this.props.status.location.lat},${this.props.status.location.lng}`)
  }

  handleClimateTempOk(temp){
    if(temp.match(/^-{0,1}\d+$/)){
      this.setState({climateTempShowModal:false})
      const temperature = this.props.vehicle.temperatureUnits === 'F' ? fToC(temp) : temp
      ipcRenderer.send('climateTemp', temperature)
      return
    }
    this.setState({climateTempModalError:'Climate temperature needs to be a number'})
    setTimeout(() => {
      this.setState({climateTempModalError:null})
    }, 2000);
    
  }

  handleClimateTempCancel(){
    this.setState({climateTempShowModal:false})
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
      <Modal visible={this.state.climateTempShowModal} onOk={this.handleClimateTempOk} 
        onCancel={this.handleClimateTempCancel} errorMessage={this.state.climateTempModalError}
        title='Desired temperature' info="Set temperature for both passenger and driver"
        type='number' placeholder={`Temperature in ${this.props.vehicle.temperatureUnits}`}/>
      <div className="car-model">
          <div className="title">
            Tesla {this.props.vehicle.model}
          </div>
          <ReactTooltip place="bottom" id='overview'>
          <div className="tooltip">Car version: <span>{this.props.status.carVersion}</span></div>
          <div className="tooltip">Charging state: <span>{this.props.status.chargingState}</span></div>
          <div className="tooltip">Battery level: <span>{`${this.props.status.batteryLevel}%`}</span></div>
          <div className="tooltip">Time to full charge: <span>{`${this.props.status.timetoFullCharge} hours`}</span></div>
          <div className="tooltip">Door: <span>{this.props.status.locked ? 'Locked' : 'Unlocked'}</span></div>
          <div className="tooltip">Climate: <span>{this.props.status.climate ? 'ON' : 'OFF'}</span></div>
          <div className="tooltip">Passenger temp. setting: <span>{this.props.vehicle.temperatureUnits === 'F' ? Math.round(cToF(this.props.status.passengerTempSetting)) + ` ${this.props.vehicle.temperatureUnits}` : Math.round(this.props.status.passengerTempSetting) + ` ${this.props.vehicle.temperatureUnits}`}</span></div>
          <div className="tooltip">Driver temp. setting: <span>{this.props.vehicle.temperatureUnits === 'F' ? Math.round(cToF(this.props.status.driverTempSetting)) + ` ${this.props.vehicle.temperatureUnits}` : Math.round(this.props.status.passengerTempSetting) + ` ${this.props.vehicle.temperatureUnits}` }</span></div>
          <div className="tooltip">Odometer: <span>{this.props.vehicle.distanceUnits.split('/')[0] ==='km' ? Math.round(mToKm(this.props.status.odometer)) : Math.round(this.props.status.odometer) + ` ${this.props.vehicle.distanceUnits.split('/')[0].toUpperCase()}`}</span></div>
          <div className="tooltip">Sentry mode: <span>{this.props.status.sentryMode ? 'ON' : 'OFF'}</span></div>
          <div className="tooltip">Valet mode: <span>{this.props.status.valetMode ? 'ON' : 'OFF' }</span></div>
          </ReactTooltip>
          <a data-tip data-for='overview'><img src={modelImage(this.props.vehicle.model)} width="100" height="40"/></a>
          </div>
          <div className="status">
          <div>
            <span className="description"><FontAwesomeIcon icon={faTachometerAlt} size="1x" color="#1BC47D"/><strong> {!this.props.status.speed ? 'Stopped' : (this.props.vehicle.distanceUnits.split('/')[0] === 'km' ? Math.round(mToKm(this.props.status.speed)) : Math.round(this.props.status.speed))}</strong>
            <span className="note"> {this.props.status.speed ? ` ${this.props.vehicle.distanceUnits}` : '' }</span></span>
              </div>
            <div>
            <span className="description"><FontAwesomeIcon name={this.props.status.chargingState} icon={this.props.batteryIcon.type} size="1x" color={this.props.batteryIcon.color}/><strong> {(this.props.vehicle.distanceUnits.split('/')[0] === 'km' ? Math.round(mToKm(this.props.status.batteryRange)) : Math.round(this.props.status.batteryRange))} 
            </strong><span className="note"> {this.props.vehicle.distanceUnits.split('/')[0]}</span></span>
              </div>
            <div>
            <span className="description"><FontAwesomeIcon icon={faTemperatureLow} size="1x" color="#1BC47D"/><strong> {this.props.vehicle.temperatureUnits === 'F' ? Math.round(cToF(this.props.status.temperature)) : Math.round(this.props.status.temperature) } 
            </strong><span className="note"> {this.props.vehicle.temperatureUnits}</span></span>
              </div>
            </div>
            <hr/>
            <div className="controls">
            <div className="summary">Controls</div>
            <div className="action-error">{this.props.actionError? 'Action Failed': null}</div>
            <div className="controls-items">
            <Actions type='door' loading={this.props.actionLoading} handle={this.handleLockClick} status={this.props.status.locked} />
            <Actions type='climate' loading={this.props.actionLoading} handle={this.handleFanClick} status={this.props.status.climate} />
            {this.props.status.sentryModeAvailable ? <Actions type='sentryMode' loading={this.props.actionLoading} handle={this.handleSentryClick} status={this.props.status.sentryMode} /> : null}
            <Actions type='climateTemp' loading={this.props.actionLoading} handle={this.handleClimateTempClick} status={this.props.status.driverTempSetting} />
            
            </div>
            </div>
            <hr/>
            <div className="location">
            <div className="summary">Location <a onClick={this.handleOpenMapClick}><FontAwesomeIcon title="Open in Google Maps" icon={faExternalLinkAlt} size="xs" color="rgb(124, 124, 124)"/></a></div>
            <Maps center={this.props.status.location} />
            </div>
      </div>
    );
  }
}

export default App;
