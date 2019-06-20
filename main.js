'use strict';
const { autoUpdater } = require("electron-updater");
const log = require('electron-log');
const { app, BrowserWindow, systemPreferences, Tray, ipcMain, shell} = require('electron');
const path = require('path')
const url = require('url')
const Positioner = require('electron-positioner')
const tesla = require('./tesla-api')
const Store = require('electron-store');
const store = new Store();
const Poller = require('./poller');
const contextMenu = require('electron-context-menu');

// Logging
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('Nikola App starting...');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// Keep a reference for dev mode
let dev = false;
if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
  dev = true;
}

function createWindow() {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 300,
    height: 450,
    show: true,
    frame: false,
    title: "Nikola",
    fullscreenable: false,
    resizable: false,
    transparent: true,
    titleBarStyle: 'customButtonsOnHover',
    webPreferences: {
      // Prevents renderer process code from not running when window is
      // hidden
      backgroundThrottling: false,
      nodeIntegration: true,
    }
  })

  // tray stuff
  let tray;

  if (process.platform === 'darwin') {
    if (systemPreferences.isDarkMode()) {
      tray = new Tray(path.join(__dirname, 'src', 'assets', 'img', 'dark.png'))
    } else {
      tray = new Tray(path.join(__dirname, 'src', 'assets', 'img', 'white.png'))
    }
    tray.setToolTip('Nikola')
  }

  if (process.platform !== 'darwin') {
    tray = new Tray(path.join(__dirname, 'src', 'assets', 'img', 'win_tray.png'))
  }


  // Don't show the app in the dock
  if (process.platform === 'darwin') {
    app.dock.hide()
    // Main window behavior
        mainWindow.on('blur', () => {
          mainWindow.hide()
        })
  }


  // Show detached devtools (for development)
  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    mainWindow.openDevTools({
      mode: 'detach'
    })
  }

  const positioner = new Positioner(mainWindow)
  let bounds = tray.getBounds()

  mainWindow.webContents.on('did-finish-load', () => {

    autoUpdater.checkForUpdatesAndNotify();

    setInterval(() => {
      autoUpdater.checkForUpdatesAndNotify();
    }, 300000);

    if (process.platform === 'darwin') {
      bounds = tray.getBounds()
      positioner.move('trayCenter', bounds)
    }

    mainWindow.webContents.send('platform', process.platform)
    mainWindow.show()
    // start login and init sequence
    const startLogin = async (authToken, loginEmailPw) => {
      try {
        if (!authToken) {
          authToken = await tesla.login(loginEmailPw)
          store.set('authToken', authToken)
        }
        mainWindow.webContents.send('login', true)
        await getTeslaData()
        startPoller()
      } catch (error) {
        log.error(error)
        store.delete('authToken')
        mainWindow.webContents.send('login-failed', JSON.stringify(error))
      }
    }

    // get tesla Data
    let authToken;
    const getTeslaData = async () => {
      authToken = store.get('authToken')

      if (mainWindow.isVisible() && authToken) {
        try {
          let vehicle;
          try {
            vehicle = await tesla.vehicle(authToken)
          } catch (error) {
            log.error(error)
            store.delete('authToken')
            store.delete('vehicleId')
            poller ? poller.removeAllListeners() : null
            mainWindow.webContents.send('login', false)
            return
          }

          store.set('vehicleId', vehicle.vehicleID)
          if (vehicle.state !== 'online') {
            await tesla.wakeUp(authToken, vehicle.vehicleID)
            mainWindow.webContents.send('tesla-data', {
              vehicle
            })
            return
          }
          const vehicleData = await tesla.vehicleData(authToken, vehicle.vehicleID)
          mainWindow.webContents.send('tesla-data', {
            model: vehicle.model,
            ...vehicleData
          })
          mainWindow.webContents.send('tesla-data-error', false)
        } catch (error) {
          log.error(error)
          mainWindow.webContents.send('tesla-data-error', true)
        }
      }
    }

    // Polling function
    let poller;
    const startPoller = () => {
      // Set 10s timeout between polls
      poller = new Poller(10000);
      // Wait till the timeout sent our event to the EventEmitter
      poller.onPoll(async () => {
        await getTeslaData()
        poller.poll();
      });
      // Initial start
      if (store.get('authToken')) {
        poller.poll();
      }
    }

    // Error in Renderer
    ipcMain.on('errorInWindow', async (event, error) => {
      log.error('Window error', error)
    })

    // Actions

    ipcMain.on('login-attempt', async (event, loginEmailPw) => {
      startLogin(false, loginEmailPw)
    })

    // wait function
    async function wait(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    }

    ipcMain.on('door', async (event, action) => {
      mainWindow.webContents.send('action-loading', action)
      try {
        if (action === 'door-unlock') {
          await tesla.unLockDoor(store.get('authToken'), store.get('vehicleId'))
        } else {
          await tesla.lockDoor(store.get('authToken'), store.get('vehicleId'))
        }
        await wait(500)
        await getTeslaData()

        mainWindow.webContents.send('action-loading', null)
      } catch (error) {
        log.error(error)
        mainWindow.webContents.send('action-error', `Error with ${action}`)
        mainWindow.webContents.send('action-loading', null)
      }
    })

    ipcMain.on('climate', async (event, action) => {
      mainWindow.webContents.send('action-loading', action)
      try {
        if (action === 'climate-on') {
          log.info('triggered climate start')
          await tesla.climateStart(store.get('authToken'), store.get('vehicleId'))
        } else {
          log.info('triggering climate stop')
          await tesla.climateStop(store.get('authToken'), store.get('vehicleId'))
        }
        await wait(500)
        await getTeslaData()

        mainWindow.webContents.send('action-loading', null)
      } catch (error) {
        log.error(error)
        mainWindow.webContents.send('action-error', `Error with ${action}`)
        mainWindow.webContents.send('action-loading', null)
      }
    })

    ipcMain.on('sentryMode', async (event, action) => {
      mainWindow.webContents.send('action-loading', action)
      try {
        if (action === 'sentry-on') {
          log.info('triggering Sentry On')
          await tesla.setSentryMode(store.get('authToken'), store.get('vehicleId'), true)
        } else {
          log.info('triggering Sentry Off')
          await tesla.setSentryMode(store.get('authToken'), store.get('vehicleId'), false)
        }
        await wait(500)
        await getTeslaData()

        mainWindow.webContents.send('action-loading', null)
      } catch (error) {
        log.error(error)
        mainWindow.webContents.send('action-error', `Error with ${action}`)
        mainWindow.webContents.send('action-loading', null)
      }
    })

    ipcMain.on('climateTemp', async (event, temp) => {
      mainWindow.webContents.send('action-loading', 'climate-temp')
      try {
        log.info('Changing temperature')
        await tesla.setTemps(store.get('authToken'), store.get('vehicleId'), temp)
        await wait(500)
        await getTeslaData()
        mainWindow.webContents.send('action-loading', null)
      } catch (error) {
        log.error(error)
        mainWindow.webContents.send('action-error', `Error with climate-temp`)
        mainWindow.webContents.send('action-loading', null)
      }
    })


    const setMenu = () => {
      contextMenu({
        menu: actions => [{
            label: `Nikola ${app.getVersion()}`,
            click() {
              shell.openExternal('https://github.com/geraldoramos/nikola')
            }
          },
          actions.separator(),
          {
            label: 'Logout',
            enabled: store.get('authToken') ? true : false,
            click() {
              store.delete('authToken')
              store.delete('vehicleId')
              poller ? poller.removeAllListeners() : null
              mainWindow.webContents.send('login', false)
            }
          },
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click() {
              app.quit()
            }
          }
        ]
      });
    }
    setMenu()

    const currentLogin = store.get('authToken')
    if (currentLogin) {
      startLogin(currentLogin, false)
    }

    let firstshow = true
    mainWindow.on('show', async () => {
      if (firstshow) {
        firstshow = false
        return
      }
      getTeslaData()
    })

  })

  // position window to the tray area
  tray.setIgnoreDoubleClickEvents(true)
  tray.on('click', (event) => {
    log.info('click tray event')
    if (process.platform === 'darwin') {
      bounds = tray.getBounds()
      positioner.move('trayCenter', bounds)
    }
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })

  // and load the index.html of the app.
  let indexPath;
  if (dev && process.argv.indexOf('--noDevServer') === -1) {
    indexPath = url.format({
      protocol: 'http:',
      host: 'localhost:8080',
      pathname: 'index.html',
      slashes: true
    });
  } else {
    indexPath = url.format({
      protocol: 'file:',
      pathname: path.join(__dirname, 'dist', 'index.html'),
      slashes: true
    });
  }
  mainWindow.loadURL(indexPath);

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    log.info('window closed event')
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  log.info('window-all-closed event')
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  log.info('app on activate event')
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
})
