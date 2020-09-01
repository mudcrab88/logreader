// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, dialog} = require('electron');
const path = require('path');
const fs = require('fs');

function appMenu(app, mainWindow) {
  return (
    [
      {
        label: 'File',
        submenu: [
          {
            label: 'Select log directory',
            click() {
                let dir = dialog.showOpenDialogSync(mainWindow, { properties: ['openDirectory'] });
                fs.writeFileSync("settings.txt", dir);
             },
          },
          {
            label: 'Save file',
            click() {
                let activeWindow = BrowserWindow.getFocusedWindow();
                let dir = dialog.showSaveDialogSync(activeWindow, { properties: ['createDirectory'] });
                activeWindow.webContents.savePage( dir, 'HTMLComplete').then(() => {
                    console.log('Page was saved successfully.')
                }).catch(err => {
                   console.log(err)
                });
             },
          },
          {
            label: 'Quit',
            click() {
                mainWindow.close(); 
             },
          },
        ],
      },
    ]
  );
}

function createWindow () {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        backgroundColor: '#FFFFE0',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    const template = appMenu(app, mainWindow);
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    // and load the index.html of the app.
    mainWindow.loadFile('index.html');

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
