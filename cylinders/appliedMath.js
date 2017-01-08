function appliedMath() {
};

appliedMath.distanceAndArcFromDiffs = function (xDiff, yDiff) {
    if (yDiff == 0) return (xDiff >= 0) ? [xDiff, Math.PI] : [-xDiff, 0];
    return [Math.sqrt(xDiff * xDiff + yDiff * yDiff),
        (yDiff > 0) ? (3 / 2) * Math.PI - Math.atan(xDiff / yDiff) : (1 / 2) * Math.PI - Math.atan(xDiff / yDiff)];
};

appliedMath.keepBetween2PI = function (arc) {
    if (arc < 0) return arc + Math.PI * 2;
    if (arc > Math.PI * 2) return arc - Math.PI * 2;
    return arc;
};

appliedMath.pointOnArc = function (xCenter, yCenter, radius, arc) {
    return [Math.cos(arc) * radius + xCenter, Math.sin(arc)*radius + yCenter];
};

appliedMath.isInBetweenClockwiseArc = function (arcStart, arcEnd, arc) {
    if (arcStart < arcEnd)
    {
        return (arc>=arcStart && arc<=arcEnd)?true:false
    }
    else
    {
        return (arc >= arcStart || arc <= arcEnd) ? true : false
    }

};

appliedMath.intersectAcuteClockwiseArcs = function (arcStart1, arcEnd1, arcStart2, arcEnd2) {
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

appliedMath.differenceBetweenTwoAngles = function (arcStart, arcEnd) {
    var diff = arcEnd-arcStart;
    if (diff > 0) return diff;
    if (diff < 0) return (Math.PI * 2 + diff);
};

appliedMath.isAcute = function (arcStart, arcEnd) {
    return (this.differenceBetweenTwoAngles(arcStart,arcEnd) <= Math.PI) ? true : false;
};