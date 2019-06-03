const tesla = require('./tesla-api')
var username = "geraldorneto@gmail.com";
var password = "ramos992tesla";

(async () => {
    const login = await tesla.login({username, password})
    const driveState = await tesla.driveState(login.authToken, login.vehicleID)
    const chargeState = await tesla.chargeState(login.authToken, login.vehicleID)
    console.log({login:{...login},driveState:{...driveState}, chargeState:{...chargeState}})
})();