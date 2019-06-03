const tjs = require('teslajs');

module.exports = {
    login: ({
        username,
        password
    }) => {
        return new Promise((resolve, reject) => {
            tjs.login(username, password, function (err, result) {
                if (err) {
                    reject(err)
                }
                const options = {
                    authToken: result.authToken
                };
                tjs.vehicle(options, function (err, vehicle) {
                    console.log('run login ' + new Date())
                    if (err) {
                        console.log(err)
                        reject(err)
                        return
                    }
                    resolve({
                        authToken: result.authToken,
                        vehicleID: vehicle.id_s,
                        model: tjs.getModel(vehicle),
                        state: vehicle.state
                    })

                });
            })
        })
    },
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
    driveState: (authToken, vehicleID) => {
        return new Promise((resolve, reject) => {
            const vehicleOptions = {
                authToken,
                vehicleID
            };
            tjs.driveState(vehicleOptions, function (err, data) {
                if (err) {
                    reject(err)
                }
                resolve(data)
            });
        })
    },
    chargeState: (authToken, vehicleID) => {
        return new Promise((resolve, reject) => {
            const vehicleOptions = {
                authToken,
                vehicleID
            };
            tjs.chargeState(vehicleOptions, function (err, data) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(data)
            });
        })
    },
    climateState: (authToken, vehicleID) => {
        return new Promise((resolve, reject) => {
            const vehicleOptions = {
                authToken,
                vehicleID
            };
            tjs.climateState(vehicleOptions, function (err, data) {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                resolve(data)
            });
        })
    }
}
