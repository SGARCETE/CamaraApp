/*function cargarJson(src) {
	$.getJSON(src, function(data) {
		console.log(data);
	});
}*/

function cargarJson(src) {
	var sceneElHiro = document.getElementById('escenarioHiro');
	var sceneElKanji = document.getElementById('escenarioKanji');
	vaciarEscena(sceneElHiro);
	vaciarEscena(sceneElKanji);
	$.getJSON(src, function(data) {
		//console.log("Entra aca");
		$.each(data, function(i, item) {
			var jsonData = item;
			var entidad = item["primitiva"] == null ? "a-entity" : "a-" + item["primitiva"];
			var entityEl = document.createElement(entidad);
			//console.log(entityEl);
			for(var i in jsonData){
				var key = i;
				var val = jsonData[i];
				switch (key) {
					case "position":
					case "rotation":
						var triplete = {};
						var arreglo = val.split(',');
						triplete.x = parseInt(arreglo[0]);
						triplete.y = parseInt(arreglo[1]);
						triplete.z = parseInt(arreglo[2]);
						entityEl.setAttribute(key, triplete);
						break;
					default:
						entityEl.setAttribute(key, val);
						break;
				}
			}
			switch (item["marker"]) {
				case "hiro":
					sceneElHiro.appendChild(entityEl);
					break;
				case "kanji":
					sceneElKanji.appendChild(entityEl);
					break;
			}
			
			console.log(entityEl);
		});
	});
}

function vaciarEscena(escena) {
	var hijos = escena.getChildren();
	$.each(hijos, function(i, item) {
		escena.removeChild(item);
	});
	
}