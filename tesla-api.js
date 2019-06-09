const tjs = require('teslajs');

module.exports = {
    login: ({ username, password}) => {
        return new Promise((resolve, reject) => {
            tjs.login(username, password, function (err, result) {                
                if (err) {
                    reject(err)
                    return
                }
                resolve(result.authToken)
            })
        })
    },
    vehicle: (authToken) => {
        return new Promise((resolve, reject) => {
        const options = {
            authToken: authToken
        };

        tjs.vehicle(options, function (err, vehicle) {
            console.log('run login ' + new Date())
            if (err) {
                console.log(err)
                reject(err)
                return
            }
            resolve({
                authToken: authToken,
                vehicleID: vehicle.id_s,
                model: tjs.getModel(vehicle),
                state: vehicle.state
            })
        });
    })},
    wakeUp: (authToken, vehicleID) => {
        return new Promise((resolve, reject) => {
            const vehicleOptions = {
                authToken,
                vehicleID
            };
            tjs.wakeUp(vehicleOptions, function (err, data) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(data)
            });
        })
    },
    vehicleData: (authToken, vehicleID) => {
        return new Promise((resolve, reject) => {
            const vehicleOptions = {
                authToken,
                vehicleID
            };
            tjs.vehicleData(vehicleOptions, function (err, data) {
                if (err) {
                    reject(err)
                }
                resolve(data)
            });
        })
    },
    lockDoor: (authToken, vehicleID) => {
        return new Promise((resolve, reject) => {
            const vehicleOptions = {
                authToken,
                vehicleID
            };
            tjs.doorLock(vehicleOptions, function (err, data) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(data)
            });
        })
    },
    unLockDoor: (authToken, vehicleID) => {
        return new Promise((resolve, reject) => {
            const vehicleOptions = {
                authToken,
                vehicleID
            };
            tjs.doorUnlock(vehicleOptions, function (err, data) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(data)
            });
        })
    },
    climateStart: (authToken, vehicleID) => {
        return new Promise((resolve, reject) => {
            const vehicleOptions = {
                authToken,
                vehicleID
            };
            tjs.climateStart(vehicleOptions, function (err, data) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(data)
            });
        })
    },
    climateStop: (authToken, vehicleID) => {
        return new Promise((resolve, reject) => {
            const vehicleOptions = {
                authToken,
                vehicleID
            };
            tjs.climateStop(vehicleOptions, function (err, data) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(data)
            });
        })
    },
    setSentryMode: (authToken, vehicleID, onoff) => {
        return new Promise((resolve, reject) => {
            const vehicleOptions = {
                authToken,
                vehicleID
            };
            tjs.setSentryMode(vehicleOptions, onoff, function (err, done) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(done)
            });
        })
    },
    setTemps: (authToken, vehicleID, temp) => {
        return new Promise((resolve, reject) => {
            const vehicleOptions = {
                authToken,
                vehicleID
            };
            tjs.setTemps(vehicleOptions, temp, null, function (err, done) {
                if (done.result && !done.err) {
                    resolve(done.result)
                    return
                }
                console.log(done.reason, err)
                reject(done.reason)
            });
        })
    }
}
