var util = require('../helpers/util'),
    mongoose = require('mongoose'),
    locModel = mongoose.model('Location');

function reviewsCreate(req, res) {
    util.sendJsonResponse(res, 200, {'status': 'success'});
}

function reviewsReadOne(req, res) {
    if(req.params && req.params.locationid && req.params.reviewid) {
        locModel
            .findById(req.params.locationid)
            .select('name reviews')
            .exec((err, location) => {
                var response, review;
                
                if(!location) {
                    util.sendJsonResponse(res, 404, {'message': 'location not found'});
                    return;
                } else if (err) {
                    util.sendJsonResponse(res, 404, err);
                    return;
                }

                if(location.reviews && location.reviews.length > 0) {
                    review = location.reviews.id(req.params.reviewid);
                    if(!review) {
                        util.sendJsonResponse(res, 404, {'message': 'review not found'});
                    } else {
                        response = {
                            location: {
                                name: location.name,
                                _id: req.params.locationid
                            },
                            review: review
                        };
                        util.sendJsonResponse(res, 200, response);
                    }
                }

            });
    } else {
        util.sendJsonResponse(res, 404, {'message': 'Not found, location and review are both required'});
    }
}

function reviewsUpdateOne(req, res) {
    util.sendJsonResponse(res, 200, {'status': 'success'});
}

function reviewDeleteOne(req, res) {
    util.sendJsonResponse(res, 200, {'status': 'success'});
}

module.exports = {
    reviewsCreate, 
    reviewsReadOne, 
    reviewsUpdateOne, 
    reviewDeleteOne
}