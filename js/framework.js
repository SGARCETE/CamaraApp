var app= angular.module('app' ,['LocalStorageModule']);

// CONTROLLER PAG MENU
app.controller("MenuController", ['$scope', 'Services', 'localStorageService', function($scope, Services, localStorageService){

    var localStorage = localStorageService;
    var listFigures = [];
    var listFiguresTemplate = [];

    // FILE OBJ
    $scope.uploadFileObj = function(){
        $scope.fileObj = event.target.files[0].name;
    };

    // FILE OBJ
    $scope.uploadFileMlt = function(){
        $scope.fileMlt = event.target.files[0].name;
    };

    function addFigureToTable(){
debugger;
        var figureTemplate = new Object();

        figureTemplate.name     = $scope.name;
        figureTemplate.marker   = $scope.marker;
        figureTemplate.type     = $scope.type;
        figureTemplate.color    = $scope.color;
        figureTemplate.position = $scope.positionX + " - " + $scope.positionY + " - " + $scope.positionZ;
        figureTemplate.conAnimation = ($scope.conAnimation)? "Si": "No";

        listFiguresTemplate.push(figureTemplate);
        $scope.listFiguresTemplate = listFiguresTemplate;
    };


    function createFormFigure(){

        var form = new Object();

        form.id = localStorage.get("id");
        form.name = $scope.name;
        form.entity= "geometry";
        form.marker = $scope.marker;
        form.type = "primitive: "+$scope.type;
        form.position = $scope.positionX+" "+ $scope.positionY+" "+ $scope.positionZ;
        form.color = "color: "+$scope.color;

        if($scope.conAnimation){
            form.animation = {};
            form.animation.attribute = $scope.attribute;
            form.animation.colorAlternativo = $scope.colorAlternativo;
            form.animation.duration = $scope.duration;

            if($scope.scaleX!=undefined && $scope.scaleY!=undefined && $scope.scaleZ!=undefined){
                form.animation.scale =  $scope.scaleX+" "+ $scope.scaleY+" "+ $scope.scaleZ;
            }

            form.animation.rotation =  $scope.rotationX+" "+ $scope.rotationY+" "+ $scope.rotationZ;
            form.animation.repeat = $scope.repeat;
        }

        listFigures.push(form);
        $scope.figures = listFigures;
    };

    // FIGURE
    $scope.createFigure = function() {

        // GENERADOR DE ID
        var contador = 1;
        if(localStorage.get("id") == null){
            localStorage.set("id",contador);
        }else{
            contador = localStorage.get("id")+1;
            localStorage.set("id",contador);
        }

        // AGREGO LA FIGURA CREADA A LA TABLA
        addFigureToTable();
        //  CREO LA FORM FIGURE Y LO GUARDO EN UNA LISTA PARA ENVIAR A LA SIGUIENTE PAG
        createFormFigure();
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

    var localStorage = localStorageService;

    var figures = localStorage.get('figures');

    // AGREGO CADA FIGURA A LA ESCENA Y SU MENÚ
    for(var i in figures){
        appendObject(figures[i]);
        createMenu(figures[i]);
    }

    function appendObject(data){
        if(data.entity == 'geometry'){
            appendGeometry(data.id, data.marker, data.type, data.position, data.color);
        }
        else if (data.entity == 'obj'){
            appendObj(data.id, data.file, data.position, data.scale, data.marker);
        }

        if(data.hasOwnProperty('animation')){
            if(data.animation.attribute == "rotation"){
                appendAnimationClick(data);
            }
            if(data.animation.colorAlternativo != undefined && data.animation.colorAlternativo != null){
                appendAnimationClickColor(data);
            }
            if(data.animation.scale != undefined && data.animation.scale != null){
                appendAnimationClickScale(data);
            }
        }
    }

    function appendGeometry(id,marker,type, position,color) {
        $('<a-entity/>', {
            id: id,
            geometry:   type,
            position:   position,
            material:   color,
            visible:    'true',
            appendTo:   $('#' + marker)
        });
        document.getElementById(id).setAttribute("position", position);
    }

    function appendObj(id, file, position, scale, marker) {
        console.log(position);
        $('<a-entity />', {
            id:             id,
            position:       position,
            file:           file,
            scale:          scale,
            "obj-model":    "obj: url(assets/obj/" + file + ".obj); mtl: url(assets/obj/" + file + ".mtl)",
            appendTo:       $('#' + marker)
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

    function appendAnimationClick(data){
        $('<a-animation/>', {
            attribute:  data.animation.attribute,
            begin:      "click",
            dur:        data.animation.duration,
            to:         data.animation.rotation,
            appendTo:   $('#' + data.id)
        });
    }

    function appendAnimationClickColor(data){
        var color = data.color.slice(7);
        $('<a-animation/>', {
            attribute:  data.animation.attribute,
            from:       color,
            to:         data.animation.colorAlternativo,
            begin:      "click",
            dur:        data.animation.duration,
            appendTo:   $('#' + data.id)
        });
    }

    function appendAnimationClickScale(data){
        $('<a-animation/>', {
            attribute:  data.animation.attribute,
            to:         data.animation.scale,
            begin:      "click",
            dur:        data.animation.duration,
            appendTo:   $('#' + data.id)
        });
    }

    function createMenu(data){
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


