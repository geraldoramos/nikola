import '../assets/css/Photon.css';
import '../assets/css/App.css';
import React, { Component } from 'react';
const {ipcRenderer, remote} = window.require('electron')
import batteryLevelIcon from './helpers/battery-level-icon'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWifi } from '@fortawesome/free-solid-svg-icons'
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
          online: true,
        }
        this.alertOnlineStatus = this.alertOnlineStatus.bind(this);
      }

      alertOnlineStatus() {
        this.setState({online:navigator.onLine})
      }

      componentDidMount() {
      
        window.addEventListener('online',  this.alertOnlineStatus)
        window.addEventListener('offline',  this.alertOnlineStatus)
      
        this.alertOnlineStatus()

        ipcRenderer.once('platform', function (event, platform) {
          if(platform!=='darwin'){
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
            batteryIcon: batteryLevelIcon(store.charge_state ? store.charge_state.battery_level : 'default'),
            vehicle:{
              model: store.model,
              state: store.state,
              temperatureUnits: store.gui_settings? store.gui_settings.gui_temperature_units : null,
              distanceUnits: store.gui_settings? store.gui_settings.gui_distance_units : '',
              chargeRateUnits: store.gui_settings? store.gui_settings.gui_charge_rate_units : null

            },
            status:{
              driverTempSetting: store.climate_state ? store.climate_state.driver_temp_setting: null,
              passengerTempSetting: store.climate_state ? store.climate_state.passenger_temp_setting: null,
              carVersion: store.vehicle_state? store.vehicle_state.car_version: null,
              batteryRange: store.charge_state ? store.charge_state.battery_range: null,
              batteryLevel: store.charge_state ? store.charge_state.battery_level: null,
              locked: store.vehicle_state? store.vehicle_state.locked : null,
              odometer:store.vehicle_state? store.vehicle_state.odometer : null,
              sentryMode:store.vehicle_state? store.vehicle_state.sentry_mode : null,
              sentryModeAvailable:store.vehicle_state? store.vehicle_state.sentry_mode_available : null,
              valetMode:store.vehicle_state? store.vehicle_state.valet_mode : null,
              climate: store.climate_state ? store.climate_state.is_climate_on : null,
              speed: store.drive_state? store.drive_state.speed : null,
              chargingState: store.charge_state ? store.charge_state.charging_state : null,
              timetoFullCharge:store.charge_state ? store.charge_state.time_to_full_charge : null,
              temperature: store.climate_state ? store.climate_state.inside_temp: null,
              location: {lat: store.drive_state?store.drive_state.latitude:null, lng: store.drive_state? store.drive_state.longitude : null},
              locationAsOf: store.drive_state? store.drive_state.gps_as_of : null
            }
          });
        }.bind(this));
      }

      componentWillUnmount(){
        ipcRenderer.removeAllListeners()
        window.removeEventListener('online',  this.alertOnlineStatus)
        window.removeEventListener('offline',  this.alertOnlineStatus)
      }

  render() {

    if(!this.state.online){
      return (
        <div>
        <div className="header-arrow"></div>
        <div className="window">
        <header className="toolbar toolbar-header"/>
        <div className="window-content">
          <div className="pane">
          <div className="container-sleep">
            <div className="exclamation"><FontAwesomeIcon icon={faWifi} size="3x" color="#cc0001"/></div>
          <div className="summary">No Internet Connection</div>
          <div className="signal"/>
          </div>
        </div>
        </div>
          </div>
          </div>
    )}

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
