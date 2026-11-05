// It's very important that all error-handling code here be as minimal and
// self contained as possible to ensure that the error handling does not
// itself have errors.

const {app, dialog} = require('electron');

// 显式固定应用名：dev 模式下 Electron 只读 package.json 的 name 字段
// （neowarp-solo），打包后用 productName，两端不一致会导致 userData 漂移。
// 统一为与 productName 一致的名字，userData 固定在 %APPDATA%/NeoWarp SOLO。
app.setName('NeoWarp SOLO');

const APP_NAME = 'NeoWarp SOLO';
const stringifyError = (error) => (error && error.stack) ? error.stack : error;

try {
  process.on('unhandledRejection', (error) => {
    console.error('Error in promise:', error);
    app.whenReady().then(() => {
      dialog.showMessageBoxSync({
        type: 'error',
        title: APP_NAME,
        message: `Error in promise: ${stringifyError(error)}`,
        noLink: true
      });
    });
  });

  require('./index');
} catch (error) {
  console.error('Error starting main process:', error);
  app.whenReady().then(() => {
    dialog.showMessageBoxSync({
      type: 'error',
      title: APP_NAME,
      message: `Error starting main process: ${stringifyError(error)}`,
      noLink: true
    });
    app.exit(1);
  });
}
