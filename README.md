# Shadow Installer

Note: use ```preview-frame.html``` for App preview/devel (simulates standalone window for devel purposes).

## Pre-reqs for development

* `npm install electron-packager -g`
* `npm install electron-packager --save-dev`

## TODO

- Install Tor properly, the windows executable provides command line arguments to install it as a service but it seems to be very buggy. We might have to use the start up registry to make it work properly on boot.
- Ideally the first page would allow you to select your operating system too, this would give us a bit more information to work upon and also allow us to extend the configuration to OS'es such as Tails, QubesOS and Subgraph (which often come with Tor support built in). There are a few tricks to detect Tails etc but those are not very reliable.
- Download checksums (over HTTPS) and verify files against them
- Verify _signed_ checksums against a GPG key
- It would also be nice to have an updater, I envisioned the installer and the updater to be one and the same. Where it would just copy itself into the directory under the name "updater.exe" or something like that, asking the user if they want to update in the GUI is fine too.


## Pages

1. intro
2. index
3. tor
4. blockchain
5. setup


# electron-quick-start

**Clone and run for a quick way to see an Electron in action.**

This is a minimal Electron application based on the [Quick Start Guide](http://electron.atom.io/docs/latest/tutorial/quick-start) within the Electron documentation.

A basic Electron application needs just these files:

- `index.html` - A web page to render.
- `main.js` - Starts the app and creates a browser window to render HTML.
- `package.json` - Points to the app's main file and lists its details and dependencies.

You can learn more about each of these components within the [Quick Start Guide](http://electron.atom.io/docs/latest/tutorial/quick-start).

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/kewde/installer.git
# Go into the repository
cd installer
# Install dependencies and run the app
npm install && npm start
```

Learn more about Electron and its API in the [documentation](http://electron.atom.io/docs/latest).

#### License [CC0 (Public Domain)](LICENSE.md)
