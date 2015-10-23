angular.module('geoRender').controller('menuCtrl',['$rootScope', ($scope) ->
    console.log 'Loading Menu...'

    template = [
        {
            label: 'File'
            submenu: [
                {
                    label: 'New Canvas'
                    click: ->
                        $plane.primitives = []
                }
            ]
        }
        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload'
                    accelerator: 'CmdOrCtrl+R'
                    click: (item, focusedWindow) ->
                        if (focusedWindow)
                            focusedWindow.reload()
                }
                {
                    label: 'Toggle Full Screen'
                    accelerator: ( ->
                        if (process.platform == 'darwin')
                            return 'Ctrl+Command+F'
                        else
                            return 'F11'
                            )()
                    click: (item, focusedWindow) ->
                        if (focusedWindow)
                            focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator: ( ->
                        if (process.platform == 'darwin')
                            return 'Alt+Command+I'
                        else
                            return 'Ctrl+Shift+I'
                            )()
                    click: (item, focusedWindow) ->
                        if (focusedWindow)
                            focusedWindow.toggleDevTools()
                }
            ]
        }
    ]

    Menu.setApplicationMenu Menu.buildFromTemplate template
])












#
