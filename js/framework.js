var app= angular.module('app' ,['LocalStorageModule']);

// CONTROLLER PAG MENU
app.controller("MenuController", ['$scope', 'Services', 'localStorageService', function($scope, Services, localStorageService){

    var localStorage = localStorageService;
    var listFigures = [];

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

        // PARA EL ID
        var contador = 1;
        if(localStorage.get("id") == null){
            localStorage.set("id",contador);
        }else{
            contador = localStorage.get("id")+1;
            localStorage.set("id",contador);
        }

        var form = new Object();
        form.id = localStorage.get("id");
        form.name = $scope.name;
        form.entity= "geometry";
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
debugger;
        localStorage.set("form", form);
        listFigures.push(form);
        $scope.figures = listFigures;
    };

    $scope.nextPage = function() {
        $scope.figures = listFigures;
        localStorage.set("figures", $scope.figures);
        window.location.replace("/CamaraApp/framework.html");
    };
    // OBJ
    $scope.createObj = function() {
        debugger;
        var form = new Object();
        form.id = localStorage.get("id");
        form.entity = "obj";
        form.name = $scope.name;
        form.file = "modelo3D_CCUNGS00_SinFondo001";
        form.position = $scope.positionX+" "+ $scope.positionY+" "+ $scope.positionZ;
        form.scale = "0.3 0.3 0.3";
        form.marker = $scope.marker;

        localStorage.set("form", form);
        window.location.replace("/CamaraApp/framework.html");
    };

}]);

// CONTROLLER PAG FRAMEWOKR
app.controller("ArController", ['$scope', 'localStorageService', function($scope, localStorageService){
debugger;
    var localStorage = localStorageService;
    var form = localStorage.get('form');
    var figures = localStorage.get('figures');

    for(var i in figures){
        appendObject(figures[i]);
    }

    createMenu(form);

    function appendObject(data){
        if(data.entity == 'geometry'){
            appendGeometry(data.id, data.marker, data.type, data.position, data.color);
        }
        else if (data.entity == 'obj'){
            appendObj(data.id, data.file, data.position, data.scale, data.marker);
        }

        if(data.hasOwnProperty('animation')){
//            appendAnimation(data.id, data.animation.attribute, data.animation.duration, "30 30 360", data.animation.repeat, "linear");
            appendAnimationClick(data.id, data.animation.attribute, data.animation.duration, "30 30 360");
        }
    }

    function appendGeometry(id,marker,type, position,color) {
        $('<a-entity/>', {
            id: id,
            geometry: type,
            position: position,
            material: color,
            visible: 'true',
            appendTo : $('#' + marker)
        });
        document.getElementById(id).setAttribute("position", position);
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

    function appendAnimation(id,attribute, dur, to, repeat, easing){
        $('<a-animation/>', {
            attribute: attribute,
            dur: dur,
            to: to,
            repeat: repeat,
            easing : easing,
            appendTo : $('#' + id)
        });
    }

    function appendAnimationClick(id,attribute, dur, to){
        $('<a-animation/>', {
            attribute: attribute,
            begin: "click",
            dur: dur,
            to: to,
            appendTo : $('#' + id)
        });
    }

    function createMenu(data){
        debugger;
        $("#ul" + data.marker).append('<li> <a onclick= "showObject(' + data.id + ');"> <span>' + data.name + '</span> <i class="icon-film"></i> </a> </li>');
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


