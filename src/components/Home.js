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
          actionLoading: null,
          error: false,
          actionError: null,
          auth:false,
          
        }
      }

      componentDidMount() {

        ipcRenderer.once('platform', function (event, platform) {
          if(platform==='win32'){
            document.querySelector('.header-arrow').style = 'display: none'
            document.querySelector('.toolbar').style = '-webkit-app-region: drag;min-height: 10px'
          }
        })

        ipcRenderer.on('login', function (event, isLogged) {
          if(isLogged){
            this.setState({auth:true})
            return
          }
          this.setState({auth:false})

        }.bind(this))

        ipcRenderer.on('action-loading', function (event, actionLoading) {
            this.setState({actionLoading})
        }.bind(this))

        ipcRenderer.on('action-error', function (event, actionError) {
          this.setState({actionError})
          setTimeout(() => {
            this.setState({actionError:null})
          }, 3000);
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
            batteryIcon: batteryLevelIcon(store.chargeState ? store.chargeState.battery_level : 'default'),
            vehicle:{
              model: store.vehicle.model,
              state: store.vehicle.state
            },
            status:{
              batteryRange: store.chargeState ? store.chargeState.battery_range: null,
              batteryLevel: store.chargeState ? store.chargeState.battery_level: null,
              locked: store.vehicleState? store.vehicleState.locked : null,
              odometer:store.vehicleState? store.vehicleState.odometer : null,
              sentryMode:store.vehicleState? store.vehicleState.sentry_mode : null,
              valetMode:store.vehicleState? store.vehicleState.valet_mode : null,
              climate: store.climateState ? store.climateState.is_climate_on : null,
              speed: store.driveState? store.driveState.speed : null,
              chargingState: store.chargeState ? store.chargeState.charging_state : null,
              timetoFullCharge:store.chargeState ? store.chargeState.time_to_full_charge : null,
              temperature: store.climateState ? store.climateState.inside_temp: null,
              location: {lat: store.driveState?store.driveState.latitude:null, lng: store.driveState? store.driveState.longitude : null},
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
