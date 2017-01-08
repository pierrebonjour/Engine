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



function Engine()
{
	var thisE = this;
	this.log = false;
	this.loaded = true;
	this.mouseX;
	this.mouseY;
	this.mouseD = false;
	this.mouseU = false;
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
	this.private_perspective = Number.MAX_SAFE_INTEGER;
	
	
	//setting up events
	document.onmousemove = function(e){thisE.private_onMove(e);};
	document.onmouseenter = function(e){thisE.private_onMove(e);};
	document.onmousedown = function(){thisE.private_mouseD(thisE)};
	document.onmouseup = function(){thisE.private_mouseU(thisE)};
}

//Public

Engine.prototype.createImg = function(src,initialWidth,initialHeight){
	return new E_Img(src,initialWidth,initialHeight, this);
}


Engine.prototype.rectangle = function(x,y,width,height,borderColor,lineWidth,filledColor){	
	var thisE = this;
	this.private_StartOrStackOrStartGraphics("loaded",function(){
		thisE.private_rectangle(x,y,width,height,borderColor,lineWidth,filledColor);
	});
}

Engine.prototype.circle = function(x,y,radius,borderColor,lineWidth,filledColor){
	var thisE = this;
	this.private_StartOrStackOrStartGraphics("loaded",function(){
		thisE.private_circle(x,y,radius,borderColor,lineWidth,filledColor);
	});
}

Engine.prototype.setCamZ = function(z){
	this.private_perspective = z;
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

Engine.prototype.private_onMove = function(e){
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
	this.mouseX = e.pageX;
	this.mouseY = e.pageY;
}

Engine.prototype.private_mouseD = function(thisE){
	thisE.mouseD = true;
	thisE.mouseU = false;
}

Engine.prototype.private_mouseU = function(thisE){
	thisE.mouseD = false;
	thisE.mouseU = true;
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

Engine.prototype.private_projectDim = function(dim,z){return (dim*this.private_perspective)/(this.private_perspective-z);}
Engine.prototype.private_projectX = function(dim,z){return this.private_projectDim(dim-this.winW/2,z) + this.winW/2;}
Engine.prototype.private_projectY = function(dim,z){return this.private_projectDim(dim-this.winH/2,z) + this.winH/2;}

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



//******************************IMAGES***************************************************************************************

E_Img.prototype.draw = function(){
	var thisI = this;
	var thisE = this.parentHandler;
	this.parentHandler.private_StartOrStackOrStartGraphics("loaded",function(img,x,y,dWidth,dHeight,sx, sy, sWidth, sHeight){
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



