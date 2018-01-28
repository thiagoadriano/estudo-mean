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
            return;
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
    locModel.create({
        name: req.body.name,
        address: req.body.address,
        facilities: req.body.facilities.split(','),
        coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
        openingTimes: [{
            days: req.body.days1,
            opening: req.body.opening1,
            closing: req.body.closing1,
            closed: req.body.closed1
        },{
            days: req.body.days2,
            opening: req.body.opening2,
            closing: req.body.closing2,
            closed: req.body.closed2
        }]
    },function(err, location){
        if(err) {
            util.sendJsonResponse(res, 400, err);
            return;
        }
        util.sendJsonResponse(res, 201, location);
    });
        
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
    if(!req.params.locationid){
        util.sendJsonResponse(res, 404, {'message': 'Not found, location id required'});
        return;    
    }

    locModel
        .findById(req.params.locationid)
        .select('-reviews -rating')
        .exec( (err, location) => {
            let dt = req.body;
            if(!location) {
                util.sendJsonResponse(res, 404, {message: 'Location not found'});
                return;
            } else if(err) {
                util.sendJsonResponse(res, 404, err);
                return;
            }
            
            location.name = req.body.name;
            location.address = req.body.address;
            location.facilities = req.body.facilities.split(',');
            location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
            location.openingTimes = [
                {
                    days: req.body.days1,
                    opening: req.body.opening1,
                    closing: req.body.closing1,
                    closed: req.body.closed1
                },
                {
                    days: req.body.days2,
                    opening: req.body.opening2,
                    closing: req.body.closing2,
                    closed: req.body.closed2
                }
            ];
            
            location.save((err, location) => {
                if(err) {
                    util.sendJsonResponse(res, 404, err);
                } else {
                    util.sendJsonResponse(res, 200, location);
                }
            });
        });
}

function locationsDeleteOne(req, res) {
    let locationid = req.params.locationid;
    if(locationid) {
        locModel
            .findByIdAndRemove(locationid)
            .exce((err, location) => {
                if(err) {
                    util.sendJsonResponse(res, 404, err);
                    return;
                }

                util.sendJsonResponse(res, 200, null);
            });
    } else {
        util.sendJsonResponse(res, 404, {'message': 'No locationid'});    
    }

}

module.exports = {
    locationsListByDistance, 
    locationsCreate, 
    locationsReadOne, 
    locationsUpdateOne,
    locationsDeleteOne
}