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
var INFINITY = 1 / 0, MAX_SAFE_INTEGER = 9007199254740991;
var isArray = Array.isArray;
var //Symbol = root.Symbol,
	    //propertyIsEnumerable = objectProto.propertyIsEnumerable,
	    spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;


registerComponent('click-object-controls', {
	dependencies: ['position'],
	
	schema: {
		
	},
	
	init: function () {
		raycaster = new THREE.Raycaster();
		mouse = new THREE.Vector2();
		objetosIntersectados = [];
		
		sceneEl = this.el.sceneEl;
		entidad = this.el;
		//console.log(sceneEl.object3D);
		camara = this.buscarLaCamara();
		mover = false;
		mouseDown = false;
		posicionInicial = entidad.getAttribute('position');
		componentesOriginales = this.clonarComponentes();
		reestablecer = this.reestablecer;
		whileClick = this.whileClick;
		this.velocity = new THREE.Vector3();
		
		functionClick = entidad.getAttribute('functionClick');
		functionClickPresionado = entidad.getAttribute('functionClickPresionado');
		functionAlSoltarClick = entidad.getAttribute('functionAlSoltarClick');
		
		//Nuevos para tomar el click
		updateMouse = this.updateMouse;
		getPosition = this.getPosition;
		updateIntersectObject = this.updateIntersectObject;
		getAllChildren = this.getAllChildren;
		getChildren = this.getChildren;
		flattenDeep = this.flattenDeep;
		baseFlatten = this.baseFlatten;
		isFlattenable = this.isFlattenable;
		isArguments = this.isArguments;
		isArrayLikeObject = this.isArrayLikeObject;
		isObjectLike = this.isObjectLike;
		isArrayLike = this.isArrayLike;
		isLength = this.isLength;
		getPosition = this.getPosition;
		canvasSize = sceneEl.canvas.getBoundingClientRect();
		console.log(canvasSize);
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
	
	click: function (evt) {
		this.updateMouse(evt);
		this.updateIntersectObject()
		
		//console.log(this.objetosIntersectados);
		
		if (this.intersectedEl) {
			console.log("Hice click");
			//this.emit('click');
			//console.log(functionClick);
			//eval(functionClick);
		}
	},
	
	reestablecer: function () {
		//entidad.setAttribute('position', posicionInicial);
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
	
	//Nuevos para tomar el click
	
	getPosition: function getPosition(evt) {
		var canvasSize = this.canvasSize,
			w = canvasSize.width,
			h = canvasSize.height,
			offsetW = canvasSize.left,
			offsetH = canvasSize.top;


		var cx = void 0,
			cy = void 0;
		//if (this._isMobile) {
		//	var touches = evt.touches;

		//	if (!touches || touches.length !== 1) {
		//		return;
		//	}
		//	var touch = touches[0];
		//	cx = touch.clientX;
		//	cy = touch.clientY;
		//} else {
			cx = evt.clientX;
			cy = evt.clientY;
		//}

		/* account for the offset if scene is embedded */
		cx = cx - offsetW;
		cy = cy - offsetH;

		if (this._isStereo) {
			cx = cx % (w / 2) * 2;
		}

		var x = cx / w * 2 - 1;
		var y = -(cy / h) * 2 + 1;

		return { x: x, y: y };
	},
	
	updateMouse: function (evt) {
		var pos = this.getPosition(evt);
		if (!pos) {
			return;
		}

		this.mouse.x = pos.x;
		this.mouse.y = pos.y;
		//this.mouse.x = ( evt.clientX / window.innerWidth ) * 2 - 1;
		//this.mouse.y = - ( evt.clientY / window.innerHeight ) * 2 + 1;
	},
	
	updateIntersectObject: function () {

		const { raycaster, sceneEl, _mouse } = this;
		const { object3D: scene } = sceneEl;
		//const camera = this.el.getObject3D('camera')
		this.getAllChildren();
		//Reescribir this.camara
		raycaster.ray.origin.setFromMatrixPosition(this.camara.children[0].object3D.matrixWorld);
		raycaster.ray.direction.set(mouse.x, mouse.y, 0.5).unproject(this.camara.children[0].offsetParent.camera).sub(raycaster.ray.origin).normalize();
		//raycaster.setFromCamera( mouse, this.camara.children[0].offsetParent.camera);//this.camara );
		var children = this.getAllChildren();
		this.objetosIntersectados = raycaster.intersectObjects(children);
		//console.log(sceneEl.object3D.children);
		//var objetosIntersectadosTest = raycaster.intersectObject(entidad.object3D, true);
		console.log(this.objetosIntersectados);
		console.log(raycaster);
	},
	
	buscarLaCamara: function () {
		//Tendria que buscar los a-camera también
		var elementos = document.querySelectorAll('a-entity');
		var elemento = null;
		for ( var i = 0; i < elementos.length; i++ ) {
			//Debería listar las camaras y seleccionar solo la activa.
			if (elementos[i].getAttribute('camera') != null) {
				elemento = elementos[i];
			}
		}
		return elemento;
	},
	
	getChildren (object3D) {
		return object3D.children.map(obj => (obj.type === 'Group')? this.getChildren(obj) : obj);
	},

	getAllChildren () {
		const children = this.getChildren(sceneEl.object3D);
		return flattenDeep(children);
	},
	
	flattenDeep(array) {
	  var length = array ? array.length : 0;
	  return length ? baseFlatten(array, INFINITY) : [];
	},
	
	baseFlatten(array, depth, predicate, isStrict, result) {
	  var index = -1,
	      length = array.length;

	  predicate || (predicate = isFlattenable);
	  result || (result = []);

	  while (++index < length) {
	    var value = array[index];
	    if (depth > 0 && predicate(value)) {
	      if (depth > 1) {
	        // Recursively flatten arrays (susceptible to call stack limits).
	        baseFlatten(value, depth - 1, predicate, isStrict, result);
	      } else {
	        arrayPush(result, value);
	      }
	    } else if (!isStrict) {
	      result[result.length] = value;
	    }
	  }
	  return result;
	},
	
	isFlattenable(value) {
	  return isArray(value) || isArguments(value) ||
	    !!(spreadableSymbol && value && value[spreadableSymbol]);
	},
	
	isArguments(value) {
	  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
	  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
	    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
	},
	
	isArrayLikeObject(value) {
	  return isObjectLike(value) && isArrayLike(value);
	},
	
	isObjectLike(value) {
	  return !!value && typeof value == 'object';
	},
	
	isArrayLike(value) {
	  return value != null && isLength(value.length) && !isFunction(value);
	},
	
	isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}
});