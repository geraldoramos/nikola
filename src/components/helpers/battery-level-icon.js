import {
  faBatteryFull,
  faBatteryEmpty,
  faBatteryQuarter,
  faBatteryHalf,
  faBatteryThreeQuarters
} from '@fortawesome/free-solid-svg-icons'

export default level => {
  let battery
  switch (true) {
    case 0 <= level && level <= 9:
      battery = { type: faBatteryEmpty, color: '#cc0001' }
      break
    case 10 <= level && level <= 39:
      battery = { type: faBatteryQuarter, color: '#cc0001' }
      break
    case 40 <= level && level <= 69:
      battery = { type: faBatteryHalf, color: '#1BC47D' }
      break
    case 70 <= level && level <= 90:
      battery = { type: faBatteryThreeQuarters, color: '#1BC47D' }
      break
    default:
      battery = { type: faBatteryFull, color: '#1BC47D' }
  }
  return battery
}
