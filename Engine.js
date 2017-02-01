//TODO :
//Make the graphics fucking awsome !! like removing too many options and adding curves and stuff
//Make the loading of the fucking images !!!

//Set the size of the image from the start, it can be in percentage of minimal window dimension (width or height)
//or it could be in percentage of maximal window dimensions I guess
//would it make sense to be any number ? I guess not...

//We should maybe hide the image object itself to avoid calling height and width.

//no one gives a shit about the number of pixels of the initial image

//If I need to compute speed, winHat do I do ? I want for instance that my missile goes from the bottom of the screen to the top
//but I also want that this distance would be for eg. 10 times the height of my spaceship then if I say my spaceship is 1m then the height
//is always 10m, but winHat if the height becomes the bigger distance ?
//E.createImg("mario.png","E.mD",0.5);
//winHen I want to resize an image I resize it... I dont kwnow how I do that by the way... I could do E.resize(mario,"E.mD",0.8);

//JE NE VEUX PAS ACCEDER AU CANVAS NI AU CONTEXT DIRECTEMENT juste parce que je préfère empiler les fonctions d'abord mais sinon je peux
//récup le this et staker la fonction.




function Engine()
{
	var thisE = this;
	this.log = false;
	this.loaded = true;
	this.winW = window.innerWidth;
	this.winH = window.innerHeight;
	this.winMin = (window.innerWidth>window.innerHeight)?window.innerHeight:window.innerWidth;
	this.winMax = (window.innerWidth>window.innerHeight)?window.innerWidth:window.innerHeight;
	this.private_canvas;
	this.private_ctx;
	this.private_graphicsAreReady = false;
	this.private_documentBody;
	this.private_functionsToCall = [];
	this.private_elementsToLoad = [];
	this.perspective = Number.MAX_SAFE_INTEGER;
	
	
	//setting up mouse events
	var m = new E_Mouse(this);
}

//Public

Engine.prototype.createImg = function(src,initialWidth,initialHeight){
	return new E_Img(src,initialWidth,initialHeight, this);
}

Engine.prototype.createCyl = function(xCenter, yCenter, zBase, height, radius, color, startAngle, endAngle){
	return new E_Cyl(xCenter, yCenter, zBase, height, radius, color, startAngle, endAngle,this);
}

Engine.prototype.rectangle = function(x,y,width,height,borderColor,lineWidth,filledColor){	
	var thisE = this;
	this.private_StartOrStackOrStartGraphics(function(){
		thisE.private_rectangle(x,y,width,height,borderColor,lineWidth,filledColor);
	});
}

Engine.prototype.circle = function(x,y,radius,borderColor,lineWidth,filledColor){
	var thisE = this;
	this.private_StartOrStackOrStartGraphics(function(){
		thisE.private_circle(x,y,radius,borderColor,lineWidth,filledColor);
	});
}

//Private
Engine.prototype.private_rectangle = function(x1,y1,x2,y2,borderColor,lineWidth,filledColor){
	var fx1 = this.private_projectX(x1,0);
	var fx2 = this.private_projectX(x2,0);
	var fy1 = this.private_projectY(y1,0);
	var fy2 = this.private_projectY(y2,0);
	
	this.private_ctx.beginPath();
    this.private_ctx.rect(fx1-fx2/2,fy1-fy2/2,fx2,fy2);
	this.private_setShapeColors(borderColor,lineWidth,filledColor,0);
	if (this.log) console.log("rectangle has been drawn");
}

Engine.prototype.private_circle = function(x,y,radius,borderColor,lineWidth,filledColor){
	var fx = this.private_projectX(x,0);
	var fy = this.private_projectY(y,0);
	var frx = this.private_projectX(radius,0);
	var fry = this.private_projectY(radius,0);

	this.private_ctx.beginPath();
	this.private_ctx.ellipse(fx, fy, frx, fry, 0, 0, 2 * Math.PI);
	this.private_setShapeColors(borderColor,lineWidth,filledColor,0);
	if (this.log) console.log("circle has been drawn");
}

Engine.prototype.private_StartOrStackOrStartGraphics = function(elementToWait, functionToCall){
	if(typeof functionToCall === "undefined")
	{
		functionToCall = elementToWait;
		elementToWait = "loaded";
	}
	if (!this.private_graphicsAreReady) this.private_setUpGraphics();
	if ((this.private_elementsToLoad.length==0) && ((elementToWait.loaded) || elementToWait === "loaded")){
		functionToCall();
	} else{
		this.private_stackAndLoad(elementToWait, functionToCall);
	}
}

Engine.prototype.private_stackAndLoad = function(elementToWait, functionToCall){
		var thisE = this;
	this.loaded = false;
	if (this.log) console.log("staking : "+elementToWait+ " -> "+functionToCall);
	this.private_elementsToLoad.push(elementToWait);
	this.private_functionsToCall.push(functionToCall);
	if(elementToWait===document){window.onload=function(){if (thisE.log) console.log("window.onload fired");elementToWait.loaded=true;thisE.private_runAllFunctionsIfReady();};}
	else if (elementToWait.img instanceof HTMLImageElement) {
		elementToWait.img.onload = function(){if (thisE.log) console.log("img.onload fired");
		if (typeof elementToWait.W === "undefined") 
			elementToWait.W = elementToWait.width;
		if (typeof elementToWait.H === "undefined") 
			elementToWait.H = elementToWait.height;
		elementToWait.loaded=true;
		thisE.private_runAllFunctionsIfReady();}
	}
}

Engine.prototype.private_runAllFunctionsIfReady = function(){
	var staticSize = this.private_elementsToLoad.length;
	for (;staticSize>0;staticSize--)
	{
		var e = this.private_elementsToLoad[0];
		if (e.loaded || e==="loaded")
		{
			this.private_functionsToCall[0]();
			this.private_elementsToLoad.shift();
			this.private_functionsToCall.shift();
		} else{
			break;
		}
	}
	if(staticSize==0) this.loaded = true;
}

Engine.prototype.private_setUpGraphics = function()
{
	var thisE = this;
	var documentBody = document.createElement("body");
	documentBody.style.margin = 0;
	this.private_canvas = document.createElement("canvas");
	this.private_canvas.width = window.innerWidth;
	this.private_canvas.height = window.innerHeight;
	documentBody.appendChild(this.private_canvas);
	this.private_ctx = this.private_canvas.getContext("2d");
	this.private_stackAndLoad(document,function(){document.body = documentBody;if (thisE.log) console.log("body for graphics has replaced current body");});	
	window.onresize = function(event) {thisE.private_setCanvasToScreenSize();};
	this.private_graphicsAreReady = true;
	if (this.log) console.log("body for graphics has been created");
}

Engine.prototype.private_setCanvasToScreenSize = function(){
	this.private_canvas.width = window.innerWidth;
	this.private_canvas.height = window.innerHeight;
	this.winW = window.innerWidth;
	this.winH = window.innerHeight;
	this.winMin = (window.innerWidth>window.innerHeight)?window.innerHeight:window.innerWidth;
	this.winMax = (window.innerWidth>window.innerHeight)?window.innerWidth:window.innerHeight;
	if (this.log) console.log("canvas size was modified");
}

Engine.prototype.private_projectDim = function(dim,z){return (dim*this.perspective)/(this.perspective-z);}
Engine.prototype.private_projectX = function(dim,z){return this.private_projectDim(dim-this.winW/2,z) + this.winW/2;}
Engine.prototype.private_projectY = function(dim,z){return this.private_projectDim(dim-this.winH/2,z) + this.winH/2;}
Engine.prototype.private_projectXY = function(x,y,z){return [this.private_projectX(x,z),this.private_projectY(y,z)];}

Engine.prototype.private_setShapeColors = function(borderColor,lineWidth,filledColor,z)
{
	if(typeof filledColor !== "undefined")
	{
		this.private_ctx.fillStyle = filledColor;
		this.private_ctx.fill();
	}
	if(typeof lineWidth !== "undefined")
	{
		this.private_ctx.lineWidth = this.private_projectDim(lineWidth,z);
	} else this.private_ctx.lineWidth = this.private_projectDim(7,z);
	if(typeof borderColor !== "undefined")
	{	

		this.private_ctx.strokeStyle = borderColor;
	}else{
		this.private_ctx.strokeStyle = "black";
	}
		this.private_ctx.stroke();
}


//******************************IMAGES***************************************************************************************


function E_Img(a0,a1,a2,a3,a4)
{
	if(arguments.length==4)
	{
		var src = arguments[0];
		var initialWidth = arguments[1];
		var initialHeight = arguments[2];
		var parentHandler = arguments[3];
		this.parentHandler = parentHandler;
		this.img = new Image();
		this.W = initialWidth;
		this.H = initialHeight;
		this.parentHandler.private_StartOrStackOrStartGraphics(this,function(){});
		this.img.src = src;
		return this;
	}
	else if(arguments.length==5)
	{
		var imgInit = arguments[0];
		var sx = arguments[1];
		var sy = arguments[2];
		var sWidth = arguments[3];	
		var sHeight = arguments[4];
		this.parentHandler = imgInit.parentHandler;
		this.img = imgInit.img;
		this.private_sx = (imgInit.img.width / imgInit.W)*sx;
		this.private_sy = (imgInit.img.height / imgInit.H)*sy;
		this.private_sWidth = (imgInit.img.width / imgInit.W)*sWidth;
		this.private_sHeight = (imgInit.img.height / imgInit.H)*sHeight;
		this.private_sx -= this.private_sWidth/2;
		this.private_sy -= this.private_sHeight/2;
		return this;
	}
}

E_Img.prototype.draw = function(){
	var thisI = this;
	var thisE = this.parentHandler;
	this.parentHandler.private_StartOrStackOrStartGraphics(function(img,x,y,dWidth,dHeight,sx, sy, sWidth, sHeight){
		return function(){thisI.private_draw(thisE,img,x,y, dWidth, dHeight,sx, sy, sWidth, sHeight);};
	}(this.img,this.X,this.Y,this.W,this.H,this.private_sx, this.private_sy, this.private_sWidth, this.private_sHeight));
	return this;
}

E_Img.prototype.extractImgArea = function(sx,sy, sWidth, sHeight){
	return new E_Img(this,sx,sy, sWidth, sHeight);
}

E_Img.prototype.setWidth = function(width){
	if (typeof this.H==="undefined" || typeof this.W==="undefined") return this;
	var initialWidth = this.W;
	this.W = width;
	this.H = (this.H/initialWidth)*width;
	return this;
}

E_Img.prototype.setHeight = function(height){
	if (typeof this.H==="undefined" || typeof this.W==="undefined") return;
	var initialHeight = this.H;
	this.H = height;
	this.W = (this.W/initialHeight)*height;
	return this;
}

E_Img.prototype.setSize = function(width,height){
	this.H = height;
	this.W = width;
	return this;
}

E_Img.prototype.setCenter = function(x,y){
	this.X = x;
	this.Y = y;
	return this;
}

E_Img.prototype.private_draw = function(thisE,img,x,y, dWidth, dHeight,sx, sy, sWidth, sHeight){
	if(typeof dWidth !== "undefined")
	{
		var fWidth = thisE.private_projectX(dWidth,0);
	} else
	{
		var fWidth = thisE.private_projectX(img.width,0);
	}
	if(typeof dHeight !== "undefined")
	{	
		var fHeight = thisE.private_projectY(dHeight,0);
	} else
	{
		var fHeight = thisE.private_projectY(img.height,0);
	}
	
	var fx = thisE.private_projectX(x,0)-fWidth/2;
	var fy = thisE.private_projectY(y,0)-fHeight/2;
	if((typeof sx !== "undefined")&&(typeof sy !== "undefined")&&(typeof sWidth !== "undefined")&&(typeof sHeight !== "undefined"))
	{
		var fsx = sx;
		var fsy = sy;
		var fsWidth = sWidth;
		var fsHeight = sHeight;
		thisE.private_ctx.drawImage(img,fsx,fsy,fsWidth,fsHeight,fx,fy,fWidth,fHeight);
		
	} else
	{
		thisE.private_ctx.drawImage(img,fx,fy,fWidth,fHeight);
	}
	if (thisE.log) console.log("image has been drawn");
}

//******************************MOUSE EVENTS***************************************************************************************

function E_Mouse(parentHandler){
	var thisM = this;
	parentHandler.mouseX;
	parentHandler.mouseY;
	parentHandler.mouseD = false;
	parentHandler.mouseU = false;
	
	document.onmousemove = function(e){thisM.private_onMove(e,parentHandler);};
	document.onmouseenter = function(e){thisM.private_onMove(e,parentHandler);};
	document.onmousedown = function(){thisM.private_mouseD(parentHandler)};
	document.onmouseup = function(){thisM.private_mouseU(parentHandler)};
}

E_Mouse.prototype.private_onMove = function(e,parentHandler){
	e = e || window.event;
	if (e.pageX == null && e.clientX != null ) 
	{
		var html = document.documentElement;
		var body = document.body;
		e.pageX = e.clientX + (html.scrollLeft || body && body.scrollLeft || 0);
		e.pageX -= html.clientLeft || 0;
		e.pageY = e.clientY + (html.scrollTop || body && body.scrollTop || 0);
		e.pageY -= html.clientTop || 0;
	}
	parentHandler.mouseX = e.pageX;
	parentHandler.mouseY = e.pageY;
}

E_Mouse.prototype.private_mouseD = function(thisE){
	thisE.mouseD = true;
	thisE.mouseU = false;
}

E_Mouse.prototype.private_mouseU = function(thisE){
	thisE.mouseD = false;
	thisE.mouseU = true;
}


//******************************E_Cyl***************************************************************************************


function E_Cyl(xCenter, yCenter, zBase, height, radius, color, startAngle, endAngle, parentHandler) {
	this.parentHandler = parentHandler;
    this.xCenter = xCenter;
    this.yCenter = yCenter;
    this.zBase = zBase;
    this.height = height;
    this.radius = radius;
    this.color = color;

    this.startAngle = (typeof startAngle === "undefined") ? 0 : this.keepBetween2PI(startAngle);
    this.endAngle = (typeof endAngle === "undefined") ? Math.PI * 2 : this.keepBetween2PI(endAngle);

    if (!this.isAcute(this.startAngle,this.endAngle))
    {
        this.startAngle = 0;
        this.endAngle = Math.PI * 2;
    }

    this.zTop = zBase + height;
	
	this.visArc = this.visibleArc(this.xCenter, this.yCenter, this.radius);

    if (this.visArc == null) return;

    if (this.isAcute(this.startAngle, this.endAngle)) {
        this.visArc = this.intersectAcuteClockwiseArcs(this.visArc[0], this.visArc[1],this.startAngle, this.endAngle);
        if (this.visArc == null) return;
    }
	
};

E_Cyl.prototype.addBrickTexture = function (brickHeight, brickWidth, nbShiftedLayers, brickColor) {
    this.brickColor = brickColor;
    this.nbBricksPerLayer = Math.floor((2*Math.PI*this.radius)/brickWidth);
    this.brickAnglesArrays = new Array();
    this.brickHeightArray = new Array();

    var brickAngle = 2 * Math.PI / this.nbBricksPerLayer;

    var arrayIndex = 0;
    for (var i = this.zTop; i >= this.zBase; i = i - brickHeight)
    {
        this.brickHeightArray[arrayIndex] = i;
        arrayIndex++;
    }
    this.nbBrickLayers = arrayIndex;

    for (var i = 0; i < this.nbBrickLayers; i++) {
        this.brickAnglesArrays[i] = new Array();
        var currentOffset = (brickAngle / nbShiftedLayers)*i;
        var arrayIndex = 0;
        for (var j = currentOffset; j < Math.PI * 2 + currentOffset; j = j + brickAngle) {
            var currentAngle = this.keepBetween2PI(j);
            if (this.isInBetweenClockwiseArc(this.startAngle,this.endAngle,currentAngle))
            {
            this.brickAnglesArrays[i][arrayIndex] = currentAngle;
            arrayIndex++;
            }
        }
    }
	return this;
};

E_Cyl.prototype.drawBrickTexture = function () {
    if (this.visArc == null) return;
    var currentBaseRadius = this.parentHandler.private_projectDim(this.radius,this.brickHeightArray[0]);
    var currentBaseCenter = this.parentHandler.private_projectXY(this.xCenter, this.yCenter, this.brickHeightArray[0]);

    var ctx = this.parentHandler.private_ctx;
    ctx.strokeStyle = this.brickColor;

    for (var i = 0; i < this.nbBrickLayers-1; i++)
    {
        var currentTopRadius = currentBaseRadius;
        var currentTopCenter = currentBaseCenter;

        var currentBaseRadius = this.parentHandler.private_projectDim(this.radius,this.brickHeightArray[i+1]);
        var currentBaseCenter = this.parentHandler.private_projectXY(this.xCenter, this.yCenter, this.brickHeightArray[i+1]);

        for (var j=0; j<this.nbBricksPerLayer;j++)
        {
            var currentArc = this.brickAnglesArrays[i][j];

            if (this.isInBetweenClockwiseArc(this.visArc[0], this.visArc[1],currentArc))
            {
                var topPoint = this.pointOnArc(currentTopCenter[0], currentTopCenter[1], currentTopRadius, currentArc);
                var bottomPoint = this.pointOnArc(currentBaseCenter[0], currentBaseCenter[1], currentBaseRadius, currentArc);
                ctx.beginPath();
                ctx.moveTo(topPoint[0], topPoint[1]);
                ctx.lineTo(bottomPoint[0], bottomPoint[1]);
                ctx.stroke();
            }
        }

        if (i != 0) {
            ctx.beginPath();
            ctx.arc(currentTopCenter[0], currentTopCenter[1], currentTopRadius, this.visArc[0], this.visArc[1]);
            ctx.stroke();
        }

    }
	return this;
};

E_Cyl.prototype.addContour = function (color,size,delimitEdges) {
	this.addContour = true;
	this.borderColor = (typeof color === "undefined")?"black":color;
	this.borderSize = (typeof size === "undefined")?7:size;
	this.delimitEdges = (typeof delimitEdges === "undefined")?true:delimitEdges;
}



E_Cyl.prototype.draw = function () {
	
	if (this.visArc == null) return;
	
	var xTop = this.parentHandler.private_projectX(this.xCenter, this.zTop);
    var yTop = this.parentHandler.private_projectY(this.yCenter, this.zTop);
    var radiusTop = this.parentHandler.private_projectDim(this.radius, this.zTop);
    
    var xBase = this.parentHandler.private_projectX(this.xCenter, this.zBase);
    var yBase = this.parentHandler.private_projectY(this.yCenter, this.zBase);
    var radiusBase = this.parentHandler.private_projectDim(this.radius, this.zBase);
	
    var startPointBase = this.pointOnArc(xBase, yBase, radiusBase, this.visArc[0]);
    var endPointBase = this.pointOnArc(xBase, yBase, radiusBase, this.visArc[1]);

    var startPointTop = this.pointOnArc(xTop, yTop, radiusTop, this.visArc[0]);
    var endPointTop = this.pointOnArc(xTop, yTop, radiusTop, this.visArc[1]);

    var ctx = this.parentHandler.private_ctx;
	if(typeof this.color !== "undefined") ctx.fillStyle = this.color;
	
	//We begin the path
	ctx.beginPath();
	ctx.arc(xTop, yTop, radiusTop, this.visArc[0], this.visArc[1]);
	ctx.arc(xBase, yBase, radiusBase, this.visArc[1], this.visArc[0], true);
	if(typeof this.color !== "undefined") ctx.fill(); //here we fill if a color has been defined

	if (typeof this.addContour !== "undefined")
	{
		ctx.strokeStyle = this.borderColor;
		ctx.lineWidth = this.borderSize;
		if (this.delimitEdges)
		{
			ctx.closePath();
			ctx.stroke();
		} 
		else 
		{
			ctx.beginPath();
			ctx.arc(xTop, yTop, radiusTop, this.visArc[0], this.visArc[1]);
			if (this.visArc[1] != this.endAngle) ctx.lineTo(endPointBase[0], endPointBase[1]);
			ctx.stroke();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.arc(xBase, yBase, radiusBase, this.visArc[1], this.visArc[0], true);
			if (this.visArc[0] != this.startAngle) ctx.lineTo(startPointTop[0], startPointTop[1]);
			ctx.stroke();
		}
	}
	
	return this;
};


E_Cyl.prototype.keepBetween2PI = function (arc) {
    if (arc < 0) return arc + Math.PI * 2;
    if (arc > Math.PI * 2) return arc - Math.PI * 2;
    return arc;
};

E_Cyl.prototype.pointOnArc = function (xCenter, yCenter, radius, arc) {
    return [Math.cos(arc) * radius + xCenter, Math.sin(arc)*radius + yCenter];
};

E_Cyl.prototype.isInBetweenClockwiseArc = function (arcStart, arcEnd, arc) {
    if (arcStart < arcEnd)
    {
        return (arc>=arcStart && arc<=arcEnd)?true:false
    }
    else
    {
        return (arc >= arcStart || arc <= arcEnd) ? true : false
    }

};

E_Cyl.prototype.intersectAcuteClockwiseArcs = function (arcStart1, arcEnd1, arcStart2, arcEnd2) {
    if (this.isInBetweenClockwiseArc(arcStart1, arcEnd1, arcStart2)) 
        var startAngle=arcStart2;
    else if (this.isInBetweenClockwiseArc(arcStart2, arcEnd2, arcStart1)) 
        var startAngle = arcStart1;

    else if ((typeof startAngle === "undefined")) return null;

    if (this.isInBetweenClockwiseArc(arcStart1, arcEnd1, arcEnd2)) 
        return [startAngle,arcEnd2];
    if (this.isInBetweenClockwiseArc(arcStart2, arcEnd2, arcEnd1)) 
        return [startAngle,arcEnd1];
};

E_Cyl.prototype.differenceBetweenTwoAngles = function (arcStart, arcEnd) {
    var diff = arcEnd-arcStart;
    if (diff > 0) return diff;
    if (diff < 0) return (Math.PI * 2 + diff);
};

E_Cyl.prototype.isAcute = function (arcStart, arcEnd) {
    return (this.differenceBetweenTwoAngles(arcStart,arcEnd) <= Math.PI) ? true : false;
};

E_Cyl.prototype.distanceAndArcWithCameraIso = function (x,y) {
    var xDiff = x - this.parentHandler.winW/2;
    var yDiff = y - this.parentHandler.winH/2;
    return this.distanceAndArcFromDiffs(xDiff, yDiff);
};

E_Cyl.prototype.distanceAndArcFromDiffs = function (xDiff, yDiff) {
    if (yDiff == 0) return (xDiff >= 0) ? [xDiff, Math.PI] : [-xDiff, 0];
    return [Math.sqrt(xDiff * xDiff + yDiff * yDiff),
        (yDiff > 0) ? (3 / 2) * Math.PI - Math.atan(xDiff / yDiff) : (1 / 2) * Math.PI - Math.atan(xDiff / yDiff)];
};

E_Cyl.prototype.visibleArc = function (x, y, radius) {
    var distAndArcCamIso = this.distanceAndArcWithCameraIso(x, y);

    if (distAndArcCamIso[0] <= radius) return null;
    var rawArc = Math.acos(radius / distAndArcCamIso[0]);

    var startAngle = this.keepBetween2PI(distAndArcCamIso[1] - rawArc);
    var endAngle = this.keepBetween2PI(distAndArcCamIso[1] + rawArc);

    return [startAngle, endAngle];
};