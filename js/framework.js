var app= angular.module('app' ,['LocalStorageModule']);

app.controller("MenuController", ['$scope', 'Services', 'localStorageService', function($scope, Services, localStorageService){

    var localStorage = localStorageService;

        debugger;
        var form = new Object();

        form.marker = $scope.marker;
        form.type = "primitive: "+$scope.type;
        form.position = $scope.positionX+" "+ $scope.positionY+" "+ $scope.positionZ;

        localStorage.set("form", form);
        window.location.replace("/CamaraApp/framework.html");
    };

}]);

app.controller("ArController", ['$scope', 'localStorageService', function($scope, localStorageService){

    var localStorage = localStorageService;
    debugger;

    var form = localStorage.get('form');


        $('<a-entity />', {
            geometry: type,
            position: position,
            material: color,
        });
    }

}]);


