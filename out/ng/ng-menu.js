angular.module('geoRender').controller('menuCtrl', [
  '$rootScope', function($scope) {
    var template;
    console.log('Loading Menu...');
    template = [
      {
        label: 'File',
        submenu: [
          {
            label: 'New Canvas',
            click: function() {
              return $plane.primitives = [];
            }
          }
        ]
      }, {
        label: 'View',
        submenu: [
          {
            label: 'Reload',
            accelerator: 'CmdOrCtrl+R',
            click: function(item, focusedWindow) {
              if (focusedWindow) {
                return focusedWindow.reload();
              }
            }
          }, {
            label: 'Toggle Full Screen',
            accelerator: (function() {
              if (process.platform === 'darwin') {
                return 'Ctrl+Command+F';
              } else {
                return 'F11';
              }
            })(),
            click: function(item, focusedWindow) {
              if (focusedWindow) {
                return focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
              }
            }
          }, {
            label: 'Toggle Developer Tools',
            accelerator: (function() {
              if (process.platform === 'darwin') {
                return 'Alt+Command+I';
              } else {
                return 'Ctrl+Shift+I';
              }
            })(),
            click: function(item, focusedWindow) {
              if (focusedWindow) {
                return focusedWindow.toggleDevTools();
              }
            }
          }
        ]
      }
    ];
    return Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  }
]);
