function camera() {
};

camera.prototype.setFocus = function (focus) {
    this.focus = focus;
};

camera.prototype.setPosition = function (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
};

camera.prototype.set2DCanvas = function (canvas, aspectRatio) {
    this.context = canvas.getContext('2d');
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    if (aspectRatio == true) {
        if (this.canvasWidth >= this.canvasHeight) {
            this.scale = this.canvasHeight / 2;
            this.ratioW = this.canvasWidth / this.canvasHeight;
            this.ratioH = 1;
        }
        else {
            this.scale = this.canvasWidth / 2;
            this.ratioW = 1;
            this.ratioH = this.canvasHeight / this.canvasWidth;
        }
    }
    else {
        if (this.canvasWidth >= this.canvasHeight) this.scale = this.canvasWidth / 2;
        else this.scale = this.canvasHeight / 2;
    }
};

camera.prototype.getContext = function () {
    return this.context;
};
 
camera.prototype.projectX = function (x, z) {
    return this.projectOffset(x - this.x,z) + this.canvasWidth / 2;
};

camera.prototype.projectY = function (y, z) {
    return this.projectOffset(y - this.y,z) + this.canvasHeight / 2;
};

camera.prototype.projectXY = function (x, y, z) {
    return [this.projectX(x,z),this.projectY(y,z)];
};

camera.prototype.projectOffset = function (offset, z) {
    return (offset * this.focus / (this.focus + this.z - z)) * this.scale;
};

camera.prototype.distanceAndArcWithCameraProjected = function (x, y, z) {
    var xDiff = this.projectOffset(x - this.x, z);
    var yDiff = this.projectOffset(y - this.y, z);
    return appliedMath.distanceAndArcFromDiffs(xDiff, yDiff);
};

camera.prototype.distanceAndArcWithCameraIso = function (x,y) {
    var xDiff = x - this.x;
    var yDiff = y - this.y;
	console.log(this.x);
    return appliedMath.distanceAndArcFromDiffs(xDiff, yDiff);
};



camera.prototype.visibleArc = function (x, y, radius) {
    var distAndArcCamIso = this.distanceAndArcWithCameraIso(x, y);

    if (distAndArcCamIso[0] <= radius) return null;
    var rawArc = Math.acos(radius / distAndArcCamIso[0]);

    var startAngle = appliedMath.keepBetween2PI(distAndArcCamIso[1] - rawArc);
    var endAngle = appliedMath.keepBetween2PI(distAndArcCamIso[1] + rawArc);

    return [startAngle, endAngle];
};