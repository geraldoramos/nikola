import '../assets/css/Photon.css';
import '../assets/css/App.css';
import React, { Component } from 'react';
const {ipcRenderer, remote} = window.require('electron')
import batteryLevelIcon from './helpers/battery-level-icon'
import App from './App';
import Login from './Login';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          firstData: false,
          loading: true,
          error: false,
          auth:false,
        }
      }

      componentDidMount() {

        ipcRenderer.on('login', function (event, loginData) {
          if(loginData){
            this.setState({auth:true})
            return
          }
          this.setState({auth:false})

        }.bind(this))

        ipcRenderer.on('tesla-data-error', function (event,store) {
          if(!this.state.firstData){
            this.setState({
              error:store
            })
          }
    
        }.bind(this))
    
        ipcRenderer.on('tesla-data', function (event,store) {
          this.setState({
            loading:false,
            firstData:true,
            batteryIcon: batteryLevelIcon(store.chargeState.battery_level),
            vehicle:{
              model: store.login.model,
              state: store.login.state
            },
            status:{
              batteryRange:store.chargeState.battery_range,
              batteryLevel:store.chargeState.battery_level,
              locked: true,
              fan: store.climateState.is_climate_on,
              speed: store.driveState.speed,
              chargingState: store.chargeState.charging_state,
              temperature: store.climateState.inside_temp,
              location: {lat: store.driveState.latitude, lng: store.driveState.longitude},
            }
          });
        }.bind(this));
      }

      componentWillUnmount(){
        ipcRenderer.removeAllListeners()
      }

  render() {

    if(!this.state.auth){
      return (
        <div>
        <div className="header-arrow"></div>
        <div className="window">
        <header className="toolbar toolbar-header"/>
        <div className="window-content">
          <div className="pane">
          <Login {...this.state} />
        </div>
        </div>
          </div>
          </div>
    )
  }

        return (
        <div>
          <div className="header-arrow"></div>
          <div className="window">
          <header className="toolbar toolbar-header"/>
          <div className="window-content">
            <div className="pane">
            <App {...this.state} />
          </div>
          </div>
            </div>
            </div>
        )
  }
}

export default Home;
