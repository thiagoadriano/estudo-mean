function sendJsonResponse(res, status, content) {
    res.status(status);
    res.json(content);
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
    sendJsonResponse,
    theEarth
}