const tjs = require('teslajs');
const log = require('electron-log');

module.exports = {
    login({username, password}) {
        log.debug('API: Logging in')
        return tjs.loginAsync(username, password)
        .then((result) => result.authToken)
    },
    vehicle(authToken) {
        const options = { authToken }
        log.debug('API: Getting vehicle')
        return tjs.vehicleAsync(options)
        .then((vehicle) => {
            return {
                vehicleID: vehicle.id_s,
                model: tjs.getModel(vehicle),
                state: vehicle.state
            }
        })
    },
    vehicles(authToken) {
        const options = { authToken }
        log.debug('API: Getting all vehicles')
        return tjs.vehiclesAsync(options)
        .then((vehicles) => {
            return vehicles.map((vehicle) => ({
                vehicleID: vehicle.id_s,
                model: tjs.getModel(vehicle),
                state: vehicle.state
            }))
        })
    },
    wakeUp(authToken, vehicleID) {
        log.debug('API: Waking up')
        const vehicleOptions = { authToken, vehicleID }
        return tjs.wakeUpAsync(vehicleOptions)
    },
    vehicleData(authToken, vehicleID) {
        log.debug(`API: Getting data for vehicle id ${vehicleID}`)
        const vehicleOptions = { authToken, vehicleID }
        return tjs.vehicleDataAsync(vehicleOptions)
    },
    lockDoor(authToken, vehicleID) {
        log.debug(`API: Locking door for vehicle id ${vehicleID}`)
        const vehicleOptions = { authToken, vehicleID }
        return tjs.doorLockAsync(vehicleOptions)
    },
    unlockDoor(authToken, vehicleID) {
        log.debug(`API: Unlocking door for vehicle id ${vehicleID}`)
        const vehicleOptions = { authToken, vehicleID }
        return tjs.doorUnlockAsync(vehicleOptions)
    },
    climateStart(authToken, vehicleID) {
        log.debug(`API: Climate start for vehicle id ${vehicleID}`)
        const vehicleOptions = { authToken, vehicleID }
        return tjs.climateStartAsync(vehicleOptions)
    },
    climateStop(authToken, vehicleID) {
        log.debug(`API: Climate stop for vehicle id ${vehicleID}`)
        const vehicleOptions = { authToken, vehicleID }
        return tjs.climateStopAsync(vehicleOptions)
    },
    setSentryMode(authToken, vehicleID, onoff) {
        log.debug(`API: Turning Sentry mode ${onoff ? 'on' : 'off'} for vehicle id ${vehicleID}`)
        const vehicleOptions = { authToken, vehicleID }
        return tjs.setSentryModeAsync(vehicleOptions, onoff)
    },
    setTemps(authToken, vehicleID, temp) {
        log.debug(`API: Setting temp to ${temp} for vehicle id ${vehicleID}`)
        const vehicleOptions = { authToken, vehicleID }
        return tjs.setTempsAsync(vehicleOptions, temp, null)
    }
}

// Add error logger. Log & rethrow.
for (const methodName of Object.keys(module.exports)) {
    const fn = module.exports[methodName];
    module.exports[methodName] = function(...args) {
        return fn(...args).catch((err) => {
            log.error(`API: Error executing "${methodName}": ${err.message}`)
            throw err;
        });
    }
}