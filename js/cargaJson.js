function cargarJson(src) {
	var sceneEl = document.querySelector('a-marker');
	$.getJSON(src, function(data) {
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
			/*$.each(data[i], function(j, item) {
				console.log(data[i][j]);
			});*/
			sceneEl.appendChild(entityEl);
			console.log(entityEl);
		});
	});
}