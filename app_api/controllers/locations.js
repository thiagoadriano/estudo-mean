var util = require('../helpers/util'),
    mongoose = require('mongoose'),
    loc = mongoose.model('Location');

function locationsListByDistance(req, res) {
    util.sendJsonResponse(res, 200, {'status': 'success'});
}

function locationsCreate(req, res) {
    util.sendJsonResponse(res, 200, {'status': 'success'});    
}

function locationsReadOne(req, res) {
    if(req.params && req.params.locationid) {
        
        loc
            .findById(req.params.locationid)
            .exec((err, location) =>    {
                if(!location) {
                    util.sendJsonResponse(res, 404, {'message': 'locationid not found'});
                    return;
                } else if(err) {
                    util.sendJsonResponse(res, 404, err);
                    console.log(err);
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