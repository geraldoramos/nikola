import '../assets/css/Photon.css';
import '../assets/css/App.css';

import modelImage from  './helpers/model-image'
import unlock from '../assets/img/unlock.svg'
import lock from '../assets/img/lock.svg'
import nofan from '../assets/img/nofan.svg'
import fan from '../assets/img/fan.svg'
import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTemperatureLow, faTachometerAlt, faBed } from '@fortawesome/free-solid-svg-icons'
import Maps from './Maps'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.handleLockClick = this.handleLockClick.bind(this);
    this.handleFanClick = this.handleFanClick.bind(this);
  }

  handleLockClick(event) {
    console.log('olar')
  }

  handleFanClick(event) {
    console.log('olar')
  }


  render() {

    if(this.props.vehicle && this.props.vehicle.state !== 'online'){
        return (
        <div className="container-sleep">
            <div className="exclamation"><FontAwesomeIcon icon={faBed} size="3x" color="#cc0001"/></div>
          <div className="summary">Trying to wake up</div>
          <center><div className="description">Make sure to close other Tesla Apps</div></center>
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
          
          <img src={modelImage(this.props.vehicle.model)} width="100" height="40"/>
          </div>
          <div className="status">
          <div>
            <span className="description"><FontAwesomeIcon icon={faTachometerAlt} size="1x" color="#1BC47D"/><strong> {!this.props.status.speed ? 'Parked' : this.props.status.speed} </strong></span>
              </div>
            <div>
            <span className="description"><FontAwesomeIcon icon={this.props.batteryIcon.type} size="1x" color={this.props.batteryIcon.color}/><strong> {this.props.status.batteryRange} 
            </strong><span className="note"> MI ({this.props.status.chargingState})</span></span>
              </div>
            <div>
            <span className="description"><FontAwesomeIcon icon={faTemperatureLow} size="1x" color="#1BC47D"/><strong> {this.props.status.temperature} </strong><span className="note"> F</span></span>
              </div>
            </div>
            <hr/>
            <div className="controls">
            <div className="summary">Controls</div>
            <div className="controls-items">
            <div onClick={this.handleLockClick}><img src={this.props.status.locked ? lock : unlock}/></div>
            <div onClick={this.handleLockClick}><img src={this.props.status.fan ? fan : nofan}/></div>
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
