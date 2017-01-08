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


function E_Img(src,initialWidth,initialHeight)
{
	this.img = new Image();
	this.W = initialWidth;
	this.H = initialHeight;
	thisE.private_StartOrStackOrStartGraphics(this,function(){});
	this.img.src = src;	
}




function Engine()
{
	thisE = this;
	thisE.log = false;
	thisE.loaded = true;
	
	thisE.mouseX;
	thisE.mouseY;
	thisE.mouseD = false;
	thisE.mouseU = false;
	thisE.winW = window.innerWidth;
	thisE.winH = window.innerHeight;
	thisE.winMin = (window.innerWidth>window.innerHeight)?window.innerHeight:window.innerWidth;
	thisE.winMax = (window.innerWidth>window.innerHeight)?window.innerWidth:window.innerHeight;
	thisE.private_canvas;
	thisE.private_ctx;
	thisE.private_graphicsAreReady = false;
	thisE.private_documentBody;
	thisE.private_functionsToCall = [];
	thisE.private_elementsToLoad = [];
	thisE.private_perspective = Number.MAX_SAFE_INTEGER;
	
	
	//setting up events
	document.onmousemove = function(e){thisE.private_onMove(e);};
	document.onmouseenter = function(e){thisE.private_onMove(e);};
	document.onmousedown = thisE.private_mouseD;
	document.onmouseup = thisE.private_mouseU;
}

//Public
Engine.prototype.setWidth = function(element,width){
	if (typeof element.H==="undefined" || typeof element.W==="undefined") return;
	var initialWidth = element.W;
	element.W = width;
	element.H = (element.H/initialWidth)*width;
}

Engine.prototype.setHeight = function(element,height){
	if (typeof element.H==="undefined" || typeof element.W==="undefined") return;
	var initialHeight = element.H;
	element.H = height;
	element.W = (element.W/initialHeight)*height;
}

Engine.prototype.setSize = function(element,width,height){
	element.H = height;
	element.W = width;
}

Engine.prototype.setCenter = function(element,x,y){
	element.X = x;
	element.Y = y;
}


Engine.prototype.draw = function(img){
	thisE.private_StartOrStackOrStartGraphics("loaded",function(img,x,y,dWidth,dHeight,sx, sy, sWidth, sHeight){
		return function(){thisE.private_image(img,x,y, dWidth, dHeight,sx, sy, sWidth, sHeight);};
	}(img.img,img.X,img.Y,img.W,img.H,img.private_sx, img.private_sy, img.private_sWidth, img.private_sHeight));
}

Engine.prototype.extractImgArea = function(imgInit,sx,sy, sWidth, sHeight){
	var img = new Object()
	img.img = imgInit.img;
	img.private_sx = (imgInit.img.width / imgInit.W)*sx;
	img.private_sy = (imgInit.img.height / imgInit.H)*sy;
	img.private_sWidth = (imgInit.img.width / imgInit.W)*sWidth;
	img.private_sHeight = (imgInit.img.height / imgInit.H)*sHeight;
	img.private_sx -= img.private_sWidth/2;
	img.private_sy -= img.private_sHeight/2;
	return img;
}

Engine.prototype.createImg = function(src,initialWidth,initialHeight){
	
	var img = new E_Img(src,initialWidth,initialHeight);
/*	
	var img = new Object()
	img.img = new Image();
	img.W = initialWidth;
	img.H = initialHeight;
	thisE.private_StartOrStackOrStartGraphics(img,function(){});
	img.img.src = src;
*/
	return img;
}

Engine.prototype.image = function(img,x,y, dWidth, dHeight,sx, sy, sWidth, sHeight){
	thisE.private_StartOrStackOrStartGraphics("loaded",function(){
		thisE.private_image(img,x,y, dWidth, dHeight,sx, sy, sWidth, sHeight);
	});
}

Engine.prototype.rectangle = function(x,y,width,height,borderColor,lineWidth,filledColor){	
		thisE.private_StartOrStackOrStartGraphics("loaded",function(){
		thisE.private_rectangle(x,y,width,height,borderColor,lineWidth,filledColor);
	});
}

Engine.prototype.circle = function(x,y,radius,borderColor,lineWidth,filledColor){
		thisE.private_StartOrStackOrStartGraphics("loaded",function(){
		thisE.private_circle(x,y,radius,borderColor,lineWidth,filledColor);
	});
}

Engine.prototype.setCamZ = function(z){
	thisE.private_perspective = z;
}

//Private
Engine.prototype.private_image = function(img,x,y, dWidth, dHeight,sx, sy, sWidth, sHeight){
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
		console.log("x : "+x+",fsx : "+fsx+",fsy : "+fsy+",fsWidth : "+fsWidth+",fsHeight : "+fsHeight+",fx :"+fx+",fy : "+fy+",fWidth :"+fWidth+",fHeight : "+fHeight);
		thisE.private_ctx.drawImage(img,fsx,fsy,fsWidth,fsHeight,fx,fy,fWidth,fHeight);
		
	} else
	{
		thisE.private_ctx.drawImage(img,fx,fy,fWidth,fHeight);
	}
	if (thisE.log) console.log("image has been drawn");
}

Engine.prototype.private_rectangle = function(x1,y1,x2,y2,borderColor,lineWidth,filledColor){
	var fx1 = thisE.private_projectX(x1,0);
	var fx2 = thisE.private_projectX(x2,0);
	var fy1 = thisE.private_projectY(y1,0);
	var fy2 = thisE.private_projectY(y2,0);
	
	thisE.private_ctx.beginPath();
    thisE.private_ctx.rect(fx1-fx2/2,fy1-fy2/2,fx2,fy2);
	thisE.private_setShapeColors(borderColor,lineWidth,filledColor,0);
	if (thisE.log) console.log("rectangle has been drawn");
}

Engine.prototype.private_circle = function(x,y,radius,borderColor,lineWidth,filledColor){
	var fx = thisE.private_projectX(x,0);
	var fy = thisE.private_projectY(y,0);
	var frx = thisE.private_projectX(radius,0);
	var fry = thisE.private_projectY(radius,0);

	thisE.private_ctx.beginPath();
	thisE.private_ctx.ellipse(fx, fy, frx, fry, 0, 0, 2 * Math.PI);
	thisE.private_setShapeColors(borderColor,lineWidth,filledColor,0);
	if (thisE.log) console.log("circle has been drawn");
}

Engine.prototype.private_StartOrStackOrStartGraphics = function(elementToWait, functionToCall){
	if (!thisE.private_graphicsAreReady) thisE.private_setUpGraphics();
	if ((thisE.private_elementsToLoad.length==0) && ((elementToWait.loaded) || elementToWait === "loaded")){
		functionToCall();
	} else{
		thisE.private_stackAndLoad(elementToWait, functionToCall);
	}
}

Engine.prototype.private_stackAndLoad = function(elementToWait, functionToCall){
	thisE.loaded = false;
	if (thisE.log) console.log("staking : "+elementToWait+ " -> "+functionToCall);
	thisE.private_elementsToLoad.push(elementToWait);
	thisE.private_functionsToCall.push(functionToCall);
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
	var staticSize = thisE.private_elementsToLoad.length;
	for (;staticSize>0;staticSize--)
	{
		var e = thisE.private_elementsToLoad[0];
		if (e.loaded || e==="loaded")
		{
			thisE.private_functionsToCall[0]();
			thisE.private_elementsToLoad.shift();
			thisE.private_functionsToCall.shift();
		} else{
			break;
		}
	}
	if(staticSize==0) thisE.loaded = true;
}

Engine.prototype.private_setUpGraphics = function()
{
	var documentBody = document.createElement("body");
	documentBody.style.margin = 0;
	thisE.private_canvas = document.createElement("canvas");
	thisE.private_canvas.width = window.innerWidth;
	thisE.private_canvas.height = window.innerHeight;
	documentBody.appendChild(thisE.private_canvas);
	thisE.private_ctx = thisE.private_canvas.getContext("2d");
	thisE.private_stackAndLoad(document,function(){document.body = documentBody;if (thisE.log) console.log("body for graphics has replaced current body");});	
	window.onresize = function(event) {thisE.private_setCanvasToScreenSize();};
	thisE.private_graphicsAreReady = true;
	if (thisE.log) console.log("body for graphics has been created");
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
	thisE.mouseX = e.pageX;
	thisE.mouseY = e.pageY;
}

Engine.prototype.private_mouseD = function(){
	thisE.mouseD = true;
	thisE.mouseU = false;
}

Engine.prototype.private_mouseU = function(){
	thisE.mouseD = false;
	thisE.mouseU = true;
}

Engine.prototype.private_setCanvasToScreenSize = function(){
	thisE.private_canvas.width = window.innerWidth;
	thisE.private_canvas.height = window.innerHeight;
	thisE.winW = window.innerWidth;
	thisE.winH = window.innerHeight;
	thisE.winMin = (window.innerWidth>window.innerHeight)?window.innerHeight:window.innerWidth;
	thisE.winMax = (window.innerWidth>window.innerHeight)?window.innerWidth:window.innerHeight;
	if (thisE.log) console.log("canvas size was modified");
}

Engine.prototype.private_projectDim = function(dim,z){return (dim*thisE.private_perspective)/(thisE.private_perspective-z);}
Engine.prototype.private_projectX = function(dim,z){return thisE.private_projectDim(dim-thisE.winW/2,z) + thisE.winW/2;}
Engine.prototype.private_projectY = function(dim,z){return thisE.private_projectDim(dim-thisE.winH/2,z) + thisE.winH/2;}

Engine.prototype.private_setShapeColors = function(borderColor,lineWidth,filledColor,z)
{
	if(typeof filledColor !== "undefined")
	{
		thisE.private_ctx.fillStyle = filledColor;
		thisE.private_ctx.fill();
	}
	if(typeof lineWidth !== "undefined")
	{
		thisE.private_ctx.lineWidth = thisE.private_projectDim(lineWidth,z);
	} else thisE.private_ctx.lineWidth = thisE.private_projectDim(7,z);
	if(typeof borderColor !== "undefined")
	{	

		thisE.private_ctx.strokeStyle = borderColor;
	}else{
		thisE.private_ctx.strokeStyle = "black";
	}
		thisE.private_ctx.stroke();
}

