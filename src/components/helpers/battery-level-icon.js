import {
  faBatteryFull,
  faBatteryEmpty,
  faBatteryQuarter,
  faBatteryHalf,
  faBatteryThreeQuarters
} from '@fortawesome/free-solid-svg-icons'

const levels = {
  10: { type: faBatteryEmpty, color: '#cc0001' },
  40: { type: faBatteryQuarter, color: '#cc0001' },
  70: { type: faBatteryHalf, color: '#1BC47D' },
  90: { type: faBatteryThreeQuarters, color: '#1BC47D' },
  100: { type: faBatteryFull, color: '#1BC47D' },
}

export default function batteryLevelIcon(thisLevel) {
  for (const levelThresh of Object.keys(levels)) {
    if (thisLevel <= Number(levelThresh)) return levels[levelThresh]
  }
  // Over 100?
  return levels[100]
}
