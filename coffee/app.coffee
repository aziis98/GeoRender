geoRender = angular.module 'geoRender', []

geoRender.controller 'mainController', ($scope) ->
    $scope.tools = [
        {
            group: 'point'
            img: 'assets/tools/point.png'
        }
        {
            group: 'line'
            img: 'assets/tools/line.png'
        }
    ]

    $scope.menus = {
        'point': [
            {
                label: 'Point'
                info: 'Draw point'
                img: 'assets/tools/point.png'
            }
            {
                label: 'Centroid'
                info: 'The centroid of a set of points'
                img: 'assets/tools/point.png'
            }
        ]
        'line': [
            {
                label: 'Line'
                info: 'Draw a line from two points'
                img: 'assets/tools/line.png'
            }
        ]
    }
