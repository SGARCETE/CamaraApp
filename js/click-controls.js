var registerComponent = AFRAME.registerComponent;
var THREE = window.THREE;
var DEFAULT_CAMERA_HEIGHT = 1.6;
var bind = AFRAME.utils.bind;

var componentesOriginales;
var entidad;
var mover;
var posicionInicial = {};
var mouseDown;
var functionClick;
var functionClickPresionado;
var functionAlSoltarClick;


registerComponent('click-controls', {
	dependencies: ['position'],
	
	schema: {
		
	},
	
	init: function () {
		var sceneEl = this.el.sceneEl;
		entidad = this.el;
		mover = false;
		mouseDown = false;
		posicionInicial = entidad.getAttribute('position');
		componentesOriginales = this.clonarComponentes();
		//console.log(componentesOriginales);
		reestablecer = this.reestablecer;
		whileClick = this.whileClick;
		this.velocity = new THREE.Vector3();
		
		functionClick = entidad.getAttribute('functionClick');
		functionClickPresionado = entidad.getAttribute('functionClickPresionado');
		functionAlSoltarClick = entidad.getAttribute('functionAlSoltarClick');
		
		//console.log(functionClick);
		//functionClick = eval("var func = " + functionClick);
		//console.log(eval("var func = " + functionClick));
		//functionClick.parseFunction();
	},
	
	tick: function (t) {
		if (mouseDown) {
			whileClick();
		}
	},
	
	getUserHeight: function () {
		var el = this.el;
		return el.hasAttribute('camera') ? el.getAttribute('camera').userHeight : DEFAULT_CAMERA_HEIGHT;
	},
	
	play: function () {
		this.addEventListeners();
	},
	
	bindMethods: function () {
		this.onMouseDown = bind(this.onMouseDown, this);
		this.onMouseMove = bind(this.onMouseMove, this);
		this.onMouseUp = bind(this.onMouseUp, this);
	},
	
	addEventListeners: function () {
		var sceneEl = this.el.sceneEl;
		var canvasEl = sceneEl.canvas;
		if (!canvasEl) {
		  sceneEl.addEventListener('render-target-loaded', bind(this.addEventListeners, this));
		  return;
		}
		window.addEventListener('click', this.click, false);
		window.addEventListener('mousedown', this.onMouseDown, false);
		window.addEventListener('mouseup', this.onMouseUp, false);		
	},
	
	onMouseDown: function (evt) {
		//if (!this.data.enabled) { return; }
		// Handle only primary button.
		//if (evt.button !== 0) { return; }
		this.mouseDown = true;
		//this.previousMouseEvent = evt;
		//document.body.classList.add(GRABBING_CLASS);
	},

	onMouseUp: function () {
		this.mouseDown = false;
		reestablecer();
		//document.body.classList.remove(GRABBING_CLASS);
		var fn = Function(functionAlSoltarClick);
		fn();
	},
	
	click: function () {
		//mover = mover ? reestablecer() : true;
		//console.log(functionClick);
		var fn = Function(functionClick);
		fn();
		//console.log(functionClick);
		//eval(functionClick);
		//functionClick;
	},
	
	reestablecer: function () {
		//entidad.setAttribute('position', posicionInicial);
		//console.log(entidad.components);
		//En proceso, para reestablecer el entidad a su forma original
		entidad.components = componentesOriginales;
	},
	
	whileClick: function () {
		var fn = Function(functionClickPresionado);
		fn();
		//var newPosition = entidad.getAttribute('position');
		//newPosition['x'] = newPosition['x'] + 0.005;
		//newPosition['y'] = newPosition['y'] + 0.005;
		//newPosition['z'] = newPosition['z'] - 0.005;
		//entidad.setAttribute('position', newPosition);
	},
	
	//En proceso, para reestablecer el entidad a su forma original
	clonarComponentes: function () {
		//Una opcion es recorrer el entidad y guardar los componentes, otra es que el usuario diga que atributos quiere reestablecer.
		return entidad.components;
	},
});