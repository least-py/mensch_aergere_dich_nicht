 var scene;
    var camera;
    var cube;
    var renderer;
    var raycaster;
    var mouse = new THREE.Vector2(), INTERSECTED;
    var radius = 100, theta = 0;
    var figures = [];
    var selectedPlayer;
	var dice;
	var occupied;
	
	//figures
	var blue = [];
	var red = [];
	var yellow = [];
	var green = [];
	
	
	//x and y coordinates of the fields
	
	var fields = [];
		
	var startingFields_red = [];
	var startingFields_blue = [];
	var startingFields_yellow = [];
	var startingFields_green = [];
		
	var targetFields_red = [];
	var targetFields_blue = [];
	var targetFields_yellow = [];
	var targetFields_green = [];
	
	throwTheDice();
	
    function onLoad() {
		
        var container = document.getElementById("container");

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild(renderer.domElement);

        scene = new THREE.Scene();
        raycaster = new THREE.Raycaster();

        camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 1, 4000);
        scene.add(camera);
        camera.position.set(0, -17, 15);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
		
		
		scene.add( new THREE.AmbientLight( 0x212222) );
      
		var light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.x = 0;
		light.position.y = -5;
		light.position.z = 10;
		scene.add(light);
		

		createBoard();


        initialPosition();
		
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('mousedown', onDocumentMouseDown, false);

        run();

		function run() {

			renderer.render(scene, camera);
			
			if (selectedPlayer !== undefined  && dice === 6 && selectedPlayer.start === true ) {
				var f = selectedPlayer.entryField;
				selectedPlayer.start = false;
				moveTo(f);
				
				selectedPlayer = undefined;
				
			}
			else if(selectedPlayer !== undefined && selectedPlayer.target === true){
				var f = selectedPlayer.currentField + dice;
				//is the player able to move within its target fields?
				if(f <= selectedPlayer.targetField && whoOccupiesField(f) === undefined){
					moveTo(f);
				}
				
				selectedPlayer = undefined;
			}
			else{
				
				if (selectedPlayer !== undefined && selectedPlayer.start === false ) {
					var f = selectedPlayer.currentField + dice;
					
					//the player must occupy a target field and reach another unoccupied target field
					
					//is the player able to enter its target fields?
					if(selectedPlayer.currentField <= selectedPlayer.lastField && f > selectedPlayer.lastField){
						//the desired target field (tarf)
						var tarf = dice - (selectedPlayer.lastField - selectedPlayer.currentField) + selectedPlayer.targetField - 4 ;
						//does the field belong to the corresponding color and is it occupied?
					    if (tarf <= selectedPlayer.targetField && whoOccupiesField(tarf) === undefined ){
							selectedPlayer.target = true;
							moveTo(tarf);
						}
						//the player can not enter the target fields
						else{
							//the fields are in the range from 0 to 39 
							//if the player chose red, f is above 39
							if(f > 39){
								f = f-40;
							}
							moveTo(f);
						}
					}
				
					else{
					//f may also increase above 39 due to colours other than red
					if(f > 39){
						f = f-40;
					}
					moveTo(f);
					}
					
					if (isGameWon()){
							var c;
							if (selectedPlayer.col ===  0x0000ff){ 
								c = "blau";
							}
							else if(selectedPlayer.col === 0xff0000) {
								c = "rot";
							}
							else if(selectedPlayer.col === 0xffff00) {
								c = "gelb";
							}
							else{
								c = "grün";
							}
							alert(c+" hat gewonnen");
							window.location.href = window.location.href;
					}
				}
				selectedPlayer = undefined;
			}
			
			requestAnimationFrame(run);
			
		}
		function onDocumentMouseDown(event) {
			raycaster.setFromCamera(mouse, camera);
			var intersects = raycaster.intersectObjects(figures, true);
			if (intersects.length > 0) {
				for (let a = 0; a < intersects.length; a++) {
					INTERSECTED = intersects[a];
					if (figures.includes(intersects[a].object.parent)) {
						selectedPlayer = INTERSECTED.object.parent;
					}
				}
			}	
        }

		function onDocumentMouseMove(event) {
			event.preventDefault();
			mouse.x = ( event.clientX / 1200 ) * 2 - 1;
			mouse.y = -( event.clientY / 500 ) * 2 + 1;
		}
		
	}
    onLoad();
	
	function moveTo(f){
		if(selectedPlayer !== undefined){
			throwOut(f);
			selectedPlayer.position.x = fields[f][0];
			selectedPlayer.position.y = fields[f][1];
			selectedPlayer.currentField = f;
		}
		
	}
	
	
	function throwTheDice() {
            dice = Math.floor(1 + Math.random() * 6);
            textchange("d-output", "dice: " + dice);
            document.getElementById("d-output").style.display = "block";
    }
	
	function textchange(id, value) {
            document.getElementById(id).innerHTML = value;
    }	
		
	function whoOccupiesField(f){
		for (i = 0; i < 4; i++) {
			if (f === red[i].currentField ){
				return red[i];
			}
			if(f === blue[i].currentField ){
				return blue[i];
			}
			if(f === green[i].currentField ){
				return green[i];
			}
			if(f === yellow[i].currentField ){
				return yellow[i];
			}
		}
		return undefined;
	}
	
	function throwOut(f) {
		var throwout = whoOccupiesField(f);
		if(throwout !== undefined) {
			//blau
			if (throwout.col === 0x0000ff) {
				for(var i = 0; i < 4; i++){
				//at least one field has to be not occupied
					if(whoOccupiesField(i+44) === undefined){
						throwout.position.x = fields[i+44][0];
						throwout.position.y = fields[i+44][1];
						throwout.start = true;
						throwout.target = false;
						throwout.currentField = i+44;
						break;
					}
				}
			}
			//rot
			if (throwout.col === 0xff0000) {
				for(var i = 0; i < 4; i++){
				//at least one field has to be not occupied
					if(whoOccupiesField(i+40) === undefined){
						throwout.position.x = fields[i+40][0];
						throwout.position.y = fields[i+40][1];
						throwout.start = true;
						throwout.target = false;
						throwout.currentField = i+40;
						break;
					}
				}
			} 
			//gelb
			if (throwout.col === 0xffff00) {
				for(var i = 0; i < 4; i++){
				//at least one field has to be not occupied
					if(whoOccupiesField(i+52) === undefined){
						throwout.position.x = fields[i+52][0];
						throwout.position.y = fields[i+52][1];
						throwout.start = true;
						throwout.target = false;
						throwout.currentField = i+52;
						break;
					}
				}
			} 
			//grün
			if (throwout.col === 0x00ff00) {
				for(var i = 0; i < 4; i++){
				//at least one field has to be not occupied
					if(whoOccupiesField(i+48) === undefined){
						throwout.position.x = fields[i+48][0];
						throwout.position.y = fields[i+48][1];
						throwout.start = true;
						throwout.target = false;
						throwout.currentField = i+48;
						break;
					}
				}
			} 
		}
	}
	function isGameWon() {
	
		if(blue[0].target && blue[1].target && blue[2].target && blue[3].target){
			return true;
		}
		else if(red[0].target && red[1].target && red[2].target && red[3].target){
			return true;
		}
		else if(yellow[0].target && yellow[1].target && yellow[2].target && yellow[3].target){
			return true;
		}
		else if(green[0].target && green[1].target && green[2].target && green[3].target){
			return true;
		}
		else{
			return false;
		}
	}
		
	
	function createField(col, x, y){
		cg = new THREE.CircleGeometry(0.5, 32);
        cm = new THREE.MeshPhongMaterial({color: col});
		var circle = new THREE.Mesh(cg, cm);
		scene.add(circle);
		circle.position.set(x,y,1);
	}
	
	
	function rotateNcreate(col, coordinates, alpha){
		//the rotation matrix (rotate around the z-axis)
		var m = [[Math.cos(alpha), Math.sin(alpha)*(-1)], 
				 [Math.sin(alpha), Math.cos(alpha)]];
		var x = coordinates[0];
		var y = coordinates[1];
		var xr = m[0][0]*x + m[0][1]*y;
		var yr = m[1][0]*x + m[1][1]*y;
		createField(col, xr, yr);
		return [xr, yr];
	}
	
	function createBoard(){
	
		//the 18x18 board 
        var geometry = new THREE.BoxGeometry(18, 18, 1);
        var material = new THREE.MeshPhongMaterial({color: "brown"});
        cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
		
		//orientation for the coordinates 
		//constant distance of 1.5 between every field
		var crdn = [-1.5, -3, -4.5, -6, -7.5];
		
		
		//Here the coordinates of the playing fields of a quarter
		//of the board are collected and then rotated 
		//to obtain and create the remaining playing fields
		//it does not include starting fields and target fields
		var rotatingcrdn = [];
		
		//the x-coordinate is always 0
		for(var i = 0; i < crdn.length; i++){
			//add targetFields:
			if(i < 4){
				targetFields_red.push([0, crdn[i]]);
				createField("red", 0, crdn[i]);
			}
			else{
				//this field belongs to the playing fields
				createField("white", 0, crdn[i]);
			}
			
		}
		
		//the x-coordinate is always -1.5
		//the maintenance of the game order
		//requires an iteration of the list from behind.
		for(var i = crdn.length-1; i >= 0; i--){
			rotatingcrdn.push([-1.5, crdn[i]]);
			fields.push([-1.5, crdn[i]])
			createField("white", -1.5, crdn[i]);
		}
		
		//the y-coordinate is always -1.5
		//start iteration with 1, because for i=0 a field has already been defined
		for(var i = 1; i <= crdn.length-1; i++){
			rotatingcrdn.push([crdn[i], -1.5]);
			fields.push([crdn[i], -1.5]);
			createField("white", crdn[i], -1.5);
		}
		//field 9
		rotatingcrdn.push([-7.5, 0]);
		fields.push([-7.5, 0]);
		createField("white", -7.5, 0);
		
		
		//the starting fields
		startingFields_red[0] = [-7.5, -7.5];
		createField("red", -7.5, -7.5);
		startingFields_red[1] = [-6, -7.5];
		createField("red", -6, -7.5);
		startingFields_red[2] = [-6, -6];
		createField("red",-6, -6);
		startingFields_red[3] = [-7.5, -6];
		createField("red",-7.5, -6);
		
		//rotate and create the other fields
		//playing fields
		//n changes the angle
		for(var n = 1; n < 4; n++){
			for(var i = 0; i < rotatingcrdn.length; i++){
				var coordinates = [];
				coordinates = rotateNcreate("white", rotatingcrdn[i], (-1)*(Math.PI/2) * n);
				fields.push(coordinates);
			}
		}
		//starting and target fields
		for(var i = 0; i < 4; i++){
			var coordinates = [];
			//blue -> 90°
			coordinates = rotateNcreate("blue", startingFields_red[i], Math.PI/2);
			startingFields_blue.push(coordinates);
			coordinates = rotateNcreate("blue", targetFields_red[i], Math.PI/2);
			targetFields_blue.push(coordinates);
			
			//green -> 180°
			coordinates = rotateNcreate("green", startingFields_red[i], Math.PI);
			startingFields_green.push(coordinates);
			coordinates = rotateNcreate("green", targetFields_red[i], Math.PI);
			targetFields_green.push(coordinates);
			
			//yellow -> -90°
			coordinates = rotateNcreate("yellow", startingFields_red[i], -Math.PI/2);
			startingFields_yellow.push(coordinates);
			coordinates = rotateNcreate("yellow", targetFields_red[i], -Math.PI/2);
			targetFields_yellow.push(coordinates);
		}
		
		//add starting fields to fields
		//41-43
		for(var i = 0; i < 4; i++){
			fields.push(startingFields_red[i]);
		}
		//44-47
		for(var i = 0; i < 4; i++){
			fields.push(startingFields_blue[i]);
		}
		//48-51
		for(var i = 0; i < 4; i++){
			fields.push(startingFields_green[i]);
		}
		//52-55
		for(var i = 0; i < 4; i++){
			fields.push(startingFields_yellow[i]);
		}
		
		//add target fields to fields
		for(var i = 3; i >= 0; i--){
			fields.push(targetFields_red[i]);
		}
		for(var i = 3; i >= 0; i--){
			fields.push(targetFields_blue[i]);
		}
		for(var i = 3; i >= 0; i--){
			fields.push(targetFields_green[i]);
		}
		for(var i = 3; i >= 0; i--){
			fields.push(targetFields_yellow[i]);
		}
		
	}
	
	function initialPosition() {
			
			//create figure -> set position -> add it to its corresponding list
			for(var i = 0; i < 4; i++){
				var r = figure(0.3, 1, 32, 0.3, 10, 132, 0xff0000);
				figures.push(r);
				r.position.x = startingFields_red[i][0];
				r.position.y = startingFields_red[i][1];
				r.currentField = i+40;
				red.push(r);
				
				var b = figure(0.3, 1, 32, 0.3, 10, 132, 0x0000ff);
				figures.push(b);
				b.position.x = startingFields_blue[i][0];
				b.position.y = startingFields_blue[i][1];
				b.currentField = i+44;
				blue.push(b);
				
				var g = figure(0.3, 1, 32, 0.3, 10, 132, 0x00ff00);
				figures.push(g);
				g.position.x = startingFields_green[i][0];
				g.position.y = startingFields_green[i][1];
				g.currentField = i+48;
				green.push(g);
				
				var y = figure(0.3, 1, 32, 0.3, 10, 132, 0xffff00);
				figures.push(y);
				y.position.x = startingFields_yellow[i][0];
				y.position.y = startingFields_yellow[i][1];
				y.currentField = i+52;
				yellow.push(y);
			}
			
			
            
		function figure(co1, co2, co3, sph1, sph2, sph3, col) {
            var conegeometry = new THREE.ConeGeometry(co1, co2, co3);
            var conematerial = new THREE.MeshPhongMaterial({color: col});
            var cone = new THREE.Mesh(conegeometry, conematerial);

            var sphgeometry = new THREE.SphereGeometry(sph1, sph2, sph3);
            var sphmaterial = new THREE.MeshPhongMaterial({color: col});
            var sphere = new THREE.Mesh(sphgeometry, sphmaterial);

            sphere.position.set(0,2,0);
			cone.position.set(0,1.5,0)
            var figure = new THREE.Group();
            figure.add(cone);
            figure.add(sphere);
			figure.col = col;
			if( col === 0x0000ff){ //blue
				figure.entryField = 30;
				figure.startingFields = startingFields_blue;
				figure.targetField = 63;
				figure.lastField = 29;
				
			}
			else if( col === 0xff0000){ //red
				figure.entryField = 0;
				figure.startingFields = startingFields_red;
				figure.targetField = 59;
				figure.lastField = 39;
			}
			else if( col === 0xffff00){ //yellow
				figure.entryField = 10;
				figure.startingFields = startingFields_yellow;
				figure.targetField = 71;
				figure.lastField = 9;
			}
			else{ //green
				figure.entryField = 20;
				figure.startingFields = startingFields_green;
				figure.targetField = 67;
				figure.lastField = 19;
				
			}
			figure.currentField = 0;
			figure.target = false;
			figure.start = true;
            scene.add(figure);
            figure.rotation.x += 1.5;
            return figure;
		}
    }