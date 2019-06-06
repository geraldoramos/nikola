import React, { Component } from 'react';
import unlock from '../assets/img/unlock.svg'
import lock from '../assets/img/lock.svg'
import nofan from '../assets/img/nofan.svg'
import fan from '../assets/img/fan.svg'

class Actions extends React.Component {

  render() {

      if(this.props.type === 'door'){
        return (
          <div>
        { this.props.loading === 'lock-door' || this.props.loading === 'unlock-door' ?
          <div className="lds-dual-ring"></div>
          :
          <div onClick={this.props.handle}><img 
          title={`Currently ${this.props.status? 'Locked, click to unlock':'Unlocked, click to lock'}`} 
          name={this.props.status ? 'unlock-door' : 'lock-door'} 
          src={this.props.status ? lock : unlock}/></div>
          }
          </div>
        )
      }

      if(this.props.type === 'climate'){
        return (
          <div>
        { this.props.loading === 'climate-on' || this.props.loading === 'climate-off'?
          <div className="lds-dual-ring"></div>
          :
          <div onClick={this.props.handle}><img 
          title={`Climate ${this.props.status? 'is on, click to turn off':'is off, click to turn on'}`} 
          name={this.props.status ? 'climate-off' : 'climate-on'} 
          src={this.props.status ? fan : nofan}/></div>
          }
          </div>
        )
      }
  }
}

export default Actions;
