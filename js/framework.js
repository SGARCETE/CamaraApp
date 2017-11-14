var app= angular.module('app' ,['LocalStorageModule']);

// CONTROLLER PAG MENU
app.controller("MenuController", ['$scope', 'Services', 'localStorageService', function($scope, Services, localStorageService){

    var localStorage = localStorageService;

    // FILE OBJ
    $scope.uploadFileObj = function(){
        $scope.fileObj = event.target.files[0].name;
    };

    // FILE OBJ
    $scope.uploadFileMlt = function(){
        $scope.fileMlt = event.target.files[0].name;
    };

    // FIGURE
    $scope.createFigure = function() {
        debugger;
        var form = new Object();
        form.marker = $scope.marker;
        form.type = "primitive: "+$scope.type;
        form.radio = $scope.radio;
        form.position = $scope.positionX+" "+ $scope.positionY+" "+ $scope.positionZ;
        form.color = "color: "+$scope.color;

        if($scope.conAnimation){
            form.animation = {};
            form.animation.attribute = $scope.attribute;
            form.animation.duration = $scope.duration;
            form.animation.repeat = $scope.repeat;
        }

        localStorage.set("form", form);
        window.location.replace("/CamaraApp/framework.html");
    };

    // OBJ
    $scope.createObj = function() {
        debugger;
        var form = new Object();
        form.marker = $scope.marker;
        form.fileObj = $scope.fileObj;
        form.fileMlt = $scope.fileMlt;

        localStorage.set("form", form);
        window.location.replace("/CamaraApp/framework.html");
    };

}]);

// CONTROLLER PAG FRAMEWOKR
app.controller("ArController", ['$scope', 'localStorageService', function($scope, localStorageService){
debugger;
    var localStorage = localStorageService;
    var form = localStorage.get('form');

    appendObject(form.marker,form.type, form.position, form.color);

    function appendObject(marker,type, position,color) {
        $('<a-entity />', {
            geometry: type,
            position: position,
            material: color,
            appendTo : $('#' + marker)
        });
    }

    function appendObj(id, file, position, scale, marker) {
        console.log(position);
        $('<a-entity />', {
            id: id,
            position: position,
            file: file,
            scale: scale,
            "obj-model": "obj: url(assets/obj/" + file + ".obj); mtl: url(assets/obj/" + file + ".mtl)",
            appendTo : $('#' + marker)
        });
        document.getElementById(id).setAttribute("position", position);
    }

}]);

// DIRECTIVE FILE
app.directive('customOnChange', function() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeFunc = scope.$eval(attrs.customOnChange);
            element.bind('change', onChangeFunc);
        }
    };
});


