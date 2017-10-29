var app = angular.module("app");

app.service('Services', [ '$http', function($http) {

    var services = this;

    services.getData = function() {
        return $http.get('cargaDatos.json').then(function(response) {
            return (response.data);
        });
    };
} ]);