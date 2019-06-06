<p align="center">
  <img src="https://firebasestorage.googleapis.com/v0/b/nikola-ffeaf.appspot.com/o/logonovo.svg?alt=media&token=0370731f-6240-41bb-bb30-db1db4947655" height="64">
  <p align="center"><strong>⚡Unofficial cross-platform desktop app to monitor and control Tesla vehicles, powered by Electron & React</strong><p>
<img src="https://firebasestorage.googleapis.com/v0/b/nikola-ffeaf.appspot.com/o/newbg.png?alt=media&token=57f736b0-59e7-44b4-968f-915e44e5c4f8">

## Get Nikola

> Currently available for MacOS and Windows.

Download [last release](https://github.com/geraldoramos/nikola/releases/latest)

*PS: Tesla Auth token is stored locally uppon login and is not sent anywhere besides Tesla servers. To remove the token from your computer, just logout.*

## Features

* Real-time location tracking
* Track of several statuses (Speed, battery, temperature, etc...)
* Remote locking/unlocking
* Remote climate control
* Auto-update
* Custom images for all Tesla models
* Dynamic icon for battery level
* Tesla AuthKey stored locally



## Contributing

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2. Install the dependencies: `yarn`
3. Build the code, start the app, and watch for changes: `GOOGLE_MAPS=YOURKEY yarn run dev`

To make sure that your code works in the finished app, you can generate the binary using:

```
$ yarn run build
```

Make sure to include your google maps key in the `../components/Maps.js` file.

After that, you'll see the binaries in the `packed` folder.

