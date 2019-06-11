<p align="center">
  <img src="https://firebasestorage.googleapis.com/v0/b/nikola-ffeaf.appspot.com/o/logonovo.svg?alt=media&token=0370731f-6240-41bb-bb30-db1db4947655" height="80"><br><br>
  <a href="https://github.com/geraldoramos/nikola/issues"><img src=https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat></a> <a href="https://github.com/geraldoramos/nikola/releases/latest"><img src=https://img.shields.io/github/downloads/geraldoramos/nikola/total.svg?style=flat></a>
  <p align="center"><strong>⚡Unofficial cross-platform desktop app to monitor and control Tesla vehicles, powered by Electron & React</strong><p>
<img src="https://firebasestorage.googleapis.com/v0/b/nikola-ffeaf.appspot.com/o/bg1.png?alt=media&token=f2bbad8d-bd75-4b94-9134-a523f8278e24">

## Get Nikola

> Currently available for MacOS, Windows and Linux.

Download [last release](https://github.com/geraldoramos/nikola/releases/latest)

*PS: Tesla Auth token is stored locally upon login and is not sent anywhere besides Tesla servers. To remove the token from your computer, just logout.*

## Features

* Real-time location tracking
* Track of several statuses (Speed, battery, temperature, etc...)
* Remote locking/unlocking
* Remote climate control
* Remote sentry mode toggle
* Remote temperature target set
* Auto-update (of the app, not the car)
* Custom images for all Tesla models
* Dynamic icon for battery level
* Tesla AuthKey stored locally 


## Contributing

1. Check work backlog [here](https://github.com/geraldoramos/nikola/projects)
2. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
3. Install the dependencies: `yarn`
4. Acquire a key from [google maps javascript api](https://developers.google.com/maps/documentation/javascript/get-api-key)
4. Build the code, start the app, and watch for changes: `GOOGLE_MAPS=YOURKEY yarn run dev`

To make sure that your code works in the finished app, you can generate the binary using:

```
$ yarn run build
```

Make sure to include your google maps key in the `../components/Maps.js` file before building and remember to not commit it. I will do a way to use it as `ENV` but it doesn't work for the build, just for dev environment for now.

After that, you'll see the binaries in the `packed` folder.

## Todo

Check [Projects](https://github.com/geraldoramos/nikola/projects) for details.


## License
MIT License

## DISCLAIMER
This software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, title and non-infringement. Use at Your Own Risk. The distributed software tracks anonimized data for statistics purposes (Google Analytics). If you prefer a version without this, feel free to download the code and build your own.

