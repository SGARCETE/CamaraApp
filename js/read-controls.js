var registerComponent = AFRAME.registerComponent;
var THREE = window.THREE;
var DEFAULT_CAMERA_HEIGHT = 1.6;
var bind = AFRAME.utils.bind;

var objeto;
var mover;
var posicionInicial = {};

registerComponent('read-controls', {
	dependencies: ['position'],
	
	schema: {
		
	},
	
	init: function () {
		var sceneEl = this.el.sceneEl;
		objeto = this.el;
		mover = false;
		posicionInicial = objeto.getAttribute('position');
		reestablecer = this.reestablecer;
		this.velocity = new THREE.Vector3();
	},
	
	tick: function (time, delta) {
		if (mover) {
			var newPosition = objeto.getAttribute('position');
			//newPosition['x'] = newPosition['x'] + 0.005;
			//newPosition['y'] = newPosition['y'] + 0.005;
			newPosition['z'] = newPosition['z'] - 0.005;
			//console.log(newPosition);
			objeto.setAttribute('position', newPosition);
		}
	},
	
	getUserHeight: function () {
		var el = this.el;
		return el.hasAttribute('camera') ? el.getAttribute('camera').userHeight : DEFAULT_CAMERA_HEIGHT;
	},
	
	play: function () {
		this.addEventListeners();
	},
	
	addEventListeners: function () {
		var sceneEl = this.el.sceneEl;
		var canvasEl = sceneEl.canvas;
		if (!canvasEl) {
		  sceneEl.addEventListener('render-target-loaded', bind(this.addEventListeners, this));
		  return;
		}
		window.addEventListener('click', this.click, false);		
	},
	
	click: function () {
		mover = mover ? reestablecer() : true;
	},
	
	reestablecer: function () {
		objeto.setAttribute('position', posicionInicial);
		return false;
	}
});