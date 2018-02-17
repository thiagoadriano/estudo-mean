function sendJsonResponse(res, status, content) {
    res.status(status);
    res.json(content);
}

function formatDistance(distance) {
    var numDistance, unit;

    if(distance > 1) {
        numDistance = parseFloat(distance).toFixed(1);
        unit = "km";
    } else {
        numDistance = parseInt(distance * 100, 10);
        unit = "m";
    }

    return numDistance + unit;
}

var theEarth = (function() {
    var earthRadius = 6371;
    var getDistanceFromRads = function(rads) {
        return parseFloat(rads * earthRadius);
    };
    var getRadsFromDistance = function(distance) {
        return parseFloat(distance / earthRadius);
    };

    return {
        getDistanceFromRads, getRadsFromDistance
    }
})();


module.exports = {
    formatDistance,
    sendJsonResponse,
    theEarth
}