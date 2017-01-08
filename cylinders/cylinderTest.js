
var c = document.getElementById("myTestCanvas");
c.width = window.innerWidth;
c.height = window.innerHeight;
var camera1 = new camera();
camera1.set2DCanvas(c);

var ctx = camera1.getContext();
camera1.setFocus(1);



var debugDiv = document.getElementById("debug");
var previousDate = new Date;
var previousFps = 0;


var faceNSWArray = new Array();
var faceEWNArray = new Array();
var faceNSEArray = new Array();
var faceEWSArray = new Array();


//Fill the arrays with faces
var nbBuilduingsPerLine = 2;
var nbBuildingLines = 3;
var height = 50;
var sideLength = 20;

camera1.setPosition((nbBuilduingsPerLine / 2) * sideLength + (nbBuilduingsPerLine / 2) * height, (nbBuildingLines / 2) * sideLength + (nbBuildingLines / 2) * height, 200);


for (var j = 0; j < nbBuildingLines; j++) {
    for (var i = 0; i < nbBuilduingsPerLine; i++) {
        //        var color1 = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
        //        var color2 = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
        //        var color3 = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
        //        var color4 = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);

        var color1 = "white";
        var color2 = "yellow";
        var color3 = "green";
        var color4 = "blue";

        var xBuilding = i * sideLength * 4 + i * height * 3;
        var yBuilding = j * sideLength * 4 + j * height * 3;

        var xNorth = xBuilding;
        var yNorth = yBuilding - (sideLength + height);
        var xSouth = xBuilding;
        var ySouth = yBuilding + (sideLength + height);
        var xEast = xBuilding + (sideLength + height);
        var yEast = yBuilding;
        var xWest = xBuilding - (sideLength + height);
        var yWest = yBuilding;


        faceNSWArray[j * nbBuilduingsPerLine + i] = new cylinder(xWest, yWest, 0, height, sideLength, color1);
        faceNSWArray[j * nbBuilduingsPerLine + i].addBrickTexture(height / 2, height / 2, 2, "black");
        faceNSEArray[j * nbBuilduingsPerLine + i] = new cylinder(xEast, yEast, 0, height, sideLength, color2);
        faceNSEArray[j * nbBuilduingsPerLine + i].addBrickTexture(height / 4, height / 4, 2, "black");
        faceEWNArray[j * nbBuilduingsPerLine + i] = new cylinder(xNorth, yNorth, 0, height, sideLength, color3);
        faceEWNArray[j * nbBuilduingsPerLine + i].addBrickTexture(height / 5, height / 2, 3, "black");
        faceEWSArray[j * nbBuilduingsPerLine + i] = new cylinder(xSouth, ySouth, 0, height, sideLength, color4);
        faceEWSArray[j * nbBuilduingsPerLine + i].addBrickTexture(height / 2, height / 5, 2, "black");
    }
}


var xSpeed = 0.1;
var ySpeed = 0.1;


function draw() {

    var currentDate = new Date;
    var timeDiff = currentDate - previousDate;
    if (timeDiff != 0) {
        var currentFps = previousFps * 0.95 + (1000 / timeDiff) * 0.05;

        debugDiv.innerText = Math.floor(currentFps) + " fps";
        previousDate = currentDate;
        previousFps = currentFps;
    }


    var xCamera = camera1.x + timeDiff * xSpeed;
    var yCamera = camera1.y + timeDiff * ySpeed;
    var zCamera = camera1.z;


    if (xCamera > nbBuilduingsPerLine * sideLength * 4 + nbBuilduingsPerLine * height * 3) xSpeed = -Math.abs(xSpeed);
    if (yCamera > nbBuildingLines * sideLength * 4 + nbBuildingLines * height * 3) ySpeed = -Math.abs(ySpeed);
    if (xCamera < -sideLength*4-height*3) xSpeed = Math.abs(xSpeed);
    if (yCamera < -sideLength * 4 -height*3) ySpeed = Math.abs(ySpeed);


    camera1.setPosition(xCamera, yCamera, zCamera);






    //Clear the canvas
    ctx.clearRect(0, 0, c.width, c.height);

    for (var j = 0; j < nbBuildingLines; j++) {
        for (var i = 0; i < nbBuilduingsPerLine; i++) {

            var cir = new Array();
            cir[0] = faceNSWArray[j * nbBuilduingsPerLine + i];
            cir[1] = faceNSEArray[j * nbBuilduingsPerLine + i];
            cir[2] = faceEWNArray[j * nbBuilduingsPerLine + i];
            cir[3] = faceEWSArray[j * nbBuilduingsPerLine + i];

            for (var m = 0; m <= 3; m++) {
                cir[m].draw(camera1);
                cir[m].drawBrickTexture(camera1);
            }

        }
    }

    ctx.strokeStyle = "red";
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(camera1.canvasWidth / 2, camera1.canvasHeight / 2, 5, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

//    window.setTimeout(draw, 0);
    requestAnimationFrame(draw);
}

draw();