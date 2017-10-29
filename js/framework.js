var app= angular.module('app' ,[]);

app.controller("SeguroController", ['$scope','Services', function($scope,Services){
    var services = Services;

    services.getData().then(function(response) {
        var primity = "primitive: ";
        $scope.sphere = response[0];
        $scope.sphere.type = primity+$scope.sphere.type;
        $scope.box = response[1];
        $scope.cylinder= response[2];

    }, function(error) {
        console.log(error);
    });
}]);

