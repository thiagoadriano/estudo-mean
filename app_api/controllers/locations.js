var util = require('../helpers/util'),
    mongoose = require('mongoose'),
    locModel = mongoose.model('Location');

function locationsListByDistance(req, res) {
    var lng = parseFloat(req.query.lng),
        lat = parseFloat(req.query.lat),
        maxDist = req.query.distance ? parseInt(req.query.distance) : 20,
        gearOptions = {
            spherical: true,
            num: 10,
            maxDistance: maxDist
        },
        point = {
            type: 'Point',
            coordinates: [lng, lat]
        };

        if(!lng || !lat) {
            util.sendJsonResponse(res, 404, {
                message: 'lng and lat queryparameters are required'
            });
        }

        locModel.geoNear(point, gearOptions, (err, results, stats) => {
            var locations = [];

            if(err) {
                util.sendJsonResponse(res, 404, err);
                return;
            }

            results.forEach((doc) => {
                locations.push({
                    distance: util.theEarth.getDistanceFromRads(doc.dis),
                    name: doc.obj.name,
                    address: doc.obj.address,
                    rating: doc.obj.rating,
                    facilities: doc.obj.facilities,
                    _id: doc.obj._id
                });
            });

            util.sendJsonResponse(res, 200, locations);

        });
}

function locationsCreate(req, res) {
    util.sendJsonResponse(res, 200, {'status': 'success'});    
}

function locationsReadOne(req, res) {
    if(req.params && req.params.locationid) {
        
        locModel
            .findById(req.params.locationid)
            .exec((err, location) =>    {
                if(!location) {
                    util.sendJsonResponse(res, 404, {'message': 'location not found'});
                    return;
                } else if(err) {
                    util.sendJsonResponse(res, 404, err);
                    return;
                }

                util.sendJsonResponse(res, 200, location);
            });

    } else {
        util.sendJsonResponse(res, 404, {'message': 'No locationid in request'});
    }
}

function locationsUpdateOne(req, res) {
    util.sendJsonResponse(res, 200, {'status': 'success'});    
}

function locationsDeleteOne(req, res) {
    util.sendJsonResponse(res, 200, {'status': 'success'});    
}

module.exports = {
    locationsListByDistance, 
    locationsCreate, 
    locationsReadOne, 
    locationsUpdateOne,
    locationsDeleteOne
}