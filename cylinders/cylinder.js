function cylinder(xCenter, yCenter, zBase, height, radius, color, startAngle, endAngle,delimitEdges) {
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

    this.delimitEdges = (typeof delimitEdges === "undefined") ? true : delimitEdges;

    this.zTop = zBase + height;
};

cylinder.prototype.addBrickTexture = function (brickHeight, brickWidth, nbShiftedLayers, brickColor) {
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
};

cylinder.prototype.drawBrickTexture = function (camera) {
    if (this.visArc == null) return;
    var currentBaseRadius = camera.projectOffset(this.radius,this.brickHeightArray[0]);
    var currentBaseCenter = camera.projectXY(this.xCenter, this.yCenter, this.brickHeightArray[0]);

    var ctx = camera.getContext();
    ctx.strokeStyle = this.brickColor;

    for (var i = 0; i < this.nbBrickLayers-1; i++)
    {
        var currentTopRadius = currentBaseRadius;
        var currentTopCenter = currentBaseCenter;

        var currentBaseRadius = camera.projectOffset(this.radius,this.brickHeightArray[i+1]);
        var currentBaseCenter = camera.projectXY(this.xCenter, this.yCenter, this.brickHeightArray[i+1]);

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
};



cylinder.prototype.draw = function (camera) {

    this.visArc = camera.visibleArc(this.xCenter, this.yCenter, this.radius);

    if (this.visArc == null) return;

    var xTop = camera.projectX(this.xCenter, this.zTop);
    var yTop = camera.projectY(this.yCenter, this.zTop);
    var radiusTop = camera.projectOffset(this.radius, this.zTop);
    
    var xBase = camera.projectX(this.xCenter, this.zBase);
    var yBase = camera.projectY(this.yCenter, this.zBase);
    var radiusBase = camera.projectOffset(this.radius, this.zBase);

    if (this.isAcute(this.startAngle, this.endAngle)) {
        this.visArc = this.intersectAcuteClockwiseArcs(this.visArc[0], this.visArc[1],
                                                            this.startAngle, this.endAngle);
        if (this.visArc == null) return;
    }
    var startPointBase = this.pointOnArc(xBase, yBase, radiusBase, this.visArc[0]);
    var endPointBase = this.pointOnArc(xBase, yBase, radiusBase, this.visArc[1]);

    var startPointTop = this.pointOnArc(xTop, yTop, radiusTop, this.visArc[0]);
    var endPointTop = this.pointOnArc(xTop, yTop, radiusTop, this.visArc[1]);



    var ctx = camera.getContext();
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "black";

    if (this.delimitEdges) {
        ctx.beginPath();
        ctx.arc(xTop, yTop, radiusTop, this.visArc[0], this.visArc[1]);
        ctx.arc(xBase, yBase, radiusBase, this.visArc[1], this.visArc[0], true);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    } else {

        ctx.beginPath();
        ctx.arc(xTop, yTop, radiusTop, this.visArc[0], this.visArc[1]);
        ctx.arc(xBase, yBase, radiusBase, this.visArc[1], this.visArc[0], true);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(xTop, yTop, radiusTop, this.visArc[0], this.visArc[1]);
        if (this.visArc[1] != this.endAngle)
            ctx.lineTo(endPointBase[0], endPointBase[1]);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(xBase, yBase, radiusBase, this.visArc[1], this.visArc[0], true);
        if (this.visArc[0] != this.startAngle)
            ctx.lineTo(startPointTop[0], startPointTop[1]);
        ctx.stroke();

    }
};


cylinder.prototype.distanceAndArcFromDiffs = function (xDiff, yDiff) {
    if (yDiff == 0) return (xDiff >= 0) ? [xDiff, Math.PI] : [-xDiff, 0];
    return [Math.sqrt(xDiff * xDiff + yDiff * yDiff),
        (yDiff > 0) ? (3 / 2) * Math.PI - Math.atan(xDiff / yDiff) : (1 / 2) * Math.PI - Math.atan(xDiff / yDiff)];
};

cylinder.prototype.keepBetween2PI = function (arc) {
    if (arc < 0) return arc + Math.PI * 2;
    if (arc > Math.PI * 2) return arc - Math.PI * 2;
    return arc;
};

cylinder.prototype.pointOnArc = function (xCenter, yCenter, radius, arc) {
    return [Math.cos(arc) * radius + xCenter, Math.sin(arc)*radius + yCenter];
};

cylinder.prototype.isInBetweenClockwiseArc = function (arcStart, arcEnd, arc) {
    if (arcStart < arcEnd)
    {
        return (arc>=arcStart && arc<=arcEnd)?true:false
    }
    else
    {
        return (arc >= arcStart || arc <= arcEnd) ? true : false
    }

};

cylinder.prototype.intersectAcuteClockwiseArcs = function (arcStart1, arcEnd1, arcStart2, arcEnd2) {
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

cylinder.prototype.differenceBetweenTwoAngles = function (arcStart, arcEnd) {
    var diff = arcEnd-arcStart;
    if (diff > 0) return diff;
    if (diff < 0) return (Math.PI * 2 + diff);
};

cylinder.prototype.isAcute = function (arcStart, arcEnd) {
    return (this.differenceBetweenTwoAngles(arcStart,arcEnd) <= Math.PI) ? true : false;
};

cylinder.prototype.distanceAndArcWithCameraIso = function (x,y) {
    var xDiff = x - window.innerWidth/2;
    var yDiff = y - window.innerHeight/2;
    return this.distanceAndArcFromDiffs(xDiff, yDiff);
};

cylinder.prototype.visibleArc = function (x, y, radius) {
    var distAndArcCamIso = this.distanceAndArcWithCameraIso(x, y);

    if (distAndArcCamIso[0] <= radius) return null;
    var rawArc = Math.acos(radius / distAndArcCamIso[0]);

    var startAngle = appliedMath.keepBetween2PI(distAndArcCamIso[1] - rawArc);
    var endAngle = appliedMath.keepBetween2PI(distAndArcCamIso[1] + rawArc);

    return [startAngle, endAngle];
};