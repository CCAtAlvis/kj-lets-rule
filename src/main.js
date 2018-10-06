const electron = require('electron');
const { app, BrowserWindow } = electron;
const path = require('path');
const url = require('url');

let win;

// create the browser window option
let bwOption = {
	// transparent makes the title bar transparent
	// other wise title bar will take system default color
	// transparent: true,
	width: 1000,
	minWidth: 300,
	// maxWidth: 300,

	height: 900,
	minHeight: 450,
	// maxHeight: 450,
	// useContentSize: true,
	fullscreen : true,
	// skipTaskbar: true,
	autoHideMenuBar: true,
};

function createWindow() {
	// Create the browser window.
	win = new BrowserWindow(bwOption);

	// and load the index.html of the app.
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));

	// Emitted when the window is closed.
	win.on('closed', () => {
		win = null
	});
}

// This method will be called when Electron has finished initialization.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
});

app.on('activate', () => {
	if (win === null)
		createWindow();
});

// set the menu bar to null when the browser window is created
// so we have a simless effect
app.on('browser-window-created', (e, window) => {
	// window.setMenu(null);
});
