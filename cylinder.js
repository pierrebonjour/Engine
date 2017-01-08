function cylinder(xCenter, yCenter, zBase, height, radius, color, startAngle, endAngle,delimitEdges) {
    this.xCenter = xCenter;
    this.yCenter = yCenter;
    this.zBase = zBase;
    this.height = height;
    this.radius = radius;
    this.color = color;

    this.startAngle = (typeof startAngle === "undefined") ? 0 : appliedMath.keepBetween2PI(startAngle);
    this.endAngle = (typeof endAngle === "undefined") ? Math.PI * 2 : appliedMath.keepBetween2PI(endAngle);

    if (!appliedMath.isAcute(this.startAngle,this.endAngle))
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
            var currentAngle = appliedMath.keepBetween2PI(j);
            if (appliedMath.isInBetweenClockwiseArc(this.startAngle,this.endAngle,currentAngle))
            {
            this.brickAnglesArrays[i][arrayIndex] = currentAngle;
            arrayIndex++;
            }
        }
    }
};

cylinder.prototype.drawBrickTexture = function (camera) {
    if (this.visibleArc == null) return;
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

            if (appliedMath.isInBetweenClockwiseArc(this.visibleArc[0], this.visibleArc[1],currentArc))
            {
                var topPoint = appliedMath.pointOnArc(currentTopCenter[0], currentTopCenter[1], currentTopRadius, currentArc);
                var bottomPoint = appliedMath.pointOnArc(currentBaseCenter[0], currentBaseCenter[1], currentBaseRadius, currentArc);
                ctx.beginPath();
                ctx.moveTo(topPoint[0], topPoint[1]);
                ctx.lineTo(bottomPoint[0], bottomPoint[1]);
                ctx.stroke();
            }
        }

        if (i != 0) {
            ctx.beginPath();
            ctx.arc(currentTopCenter[0], currentTopCenter[1], currentTopRadius, this.visibleArc[0], this.visibleArc[1]);
            ctx.stroke();
        }

    }
};



cylinder.prototype.draw = function (camera) {

    this.visibleArc = camera.visibleArc(this.xCenter, this.yCenter, this.radius);

    if (this.visibleArc == null) return;

    var xTop = camera.projectX(this.xCenter, this.zTop);
    var yTop = camera.projectY(this.yCenter, this.zTop);
    var radiusTop = camera.projectOffset(this.radius, this.zTop);
    
    var xBase = camera.projectX(this.xCenter, this.zBase);
    var yBase = camera.projectY(this.yCenter, this.zBase);
    var radiusBase = camera.projectOffset(this.radius, this.zBase);

    if (appliedMath.isAcute(this.startAngle, this.endAngle)) {
        this.visibleArc = appliedMath.intersectAcuteClockwiseArcs(this.visibleArc[0], this.visibleArc[1],
                                                            this.startAngle, this.endAngle);
        if (this.visibleArc == null) return;
    }
    var startPointBase = appliedMath.pointOnArc(xBase, yBase, radiusBase, this.visibleArc[0]);
    var endPointBase = appliedMath.pointOnArc(xBase, yBase, radiusBase, this.visibleArc[1]);

    var startPointTop = appliedMath.pointOnArc(xTop, yTop, radiusTop, this.visibleArc[0]);
    var endPointTop = appliedMath.pointOnArc(xTop, yTop, radiusTop, this.visibleArc[1]);



    var ctx = camera.getContext();
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "black";

    if (this.delimitEdges) {
        ctx.beginPath();
        ctx.arc(xTop, yTop, radiusTop, this.visibleArc[0], this.visibleArc[1]);
        ctx.arc(xBase, yBase, radiusBase, this.visibleArc[1], this.visibleArc[0], true);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    } else {

        ctx.beginPath();
        ctx.arc(xTop, yTop, radiusTop, this.visibleArc[0], this.visibleArc[1]);
        ctx.arc(xBase, yBase, radiusBase, this.visibleArc[1], this.visibleArc[0], true);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(xTop, yTop, radiusTop, this.visibleArc[0], this.visibleArc[1]);
        if (this.visibleArc[1] != this.endAngle)
            ctx.lineTo(endPointBase[0], endPointBase[1]);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(xBase, yBase, radiusBase, this.visibleArc[1], this.visibleArc[0], true);
        if (this.visibleArc[0] != this.startAngle)
            ctx.lineTo(startPointTop[0], startPointTop[1]);
        ctx.stroke();

    }
};