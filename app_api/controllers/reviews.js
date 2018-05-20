var util = require('../helpers/util'),
    mongoose = require('mongoose'),
    locModel = mongoose.model('Location');

function _updateAvarageRating(locationid){
    locModel
        .findById(locationid)
        .select('rating reviews')
        .exec( (err, location) => {
            if(!err){
                _doSetAvarageRating(location);
            }
        });
}

function _doSetAvarageRating(location){
    var i, reviewCount, ratingAvarage, ratingTotal;
    if(location.reviews && location.reviews.length > 0){
        reviewCount = location.reviews.length;
        ratingTotal = 0;
        for(i = 0; i < reviewCount; i++) {
            ratingTotal = ratingTotal + location.reviews[i].rating;
        }
        ratingAvarage = parseInt(ratingTotal / reviewCount, 10);
        location.rating = ratingAvarage;
        location.save((err) => {
            if(err){
                console.log(err);
            } else {
                console.log("Avarage rating updated to", ratingAvarage);
            }
        });
    }
}

function _doAddReview(req, res, location) {
    if(!location) {
        util.sendJsonResponse(res, 404, {message: "locationid no found"});
    } else {
        location.reviews.push({
            author: req.body.author,
            rating: req.body.rating,
            reviewText: req.body.reviewText
        });
        location.save( (err, location) => {
            var thisreview;
            if(err) {
                util.sendJsonResponse(res, 400, err);
            } else {
                _updateAvarageRating(location._id);
                thisreview = location.reviews[location.reviews.length - 1];
                util.sendJsonResponse(res, 201, thisreview);
            }
        });
    }
}

function reviewsCreate(req, res) {
    var locationid = req.params.locationid;
    if(locationid){
        locModel
            .findById(locationid)
            .select('reviews')
            .exec( (err, location) => {
                if(err) {
                    util.sendJsonResponse(res, 400, err);
                }else{
                    _doAddReview(req, res, location);
                }
            });
    }else {
        util.sendJsonResponse(res, 404, {message: "Not found, locationid required"});
    }
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
    if(!req.params.locationid || !req.params.reviewid){
        util.sendJsonResponse(res, 404, {'message': 'Not found, locationid and reviewid are both required'});
        return;
    }

    locModel
        .findById(req.params.locationid)
        .select('reviews')
        .exec((err, location) => {
            var thisreview;
            if(!location) {
                util.sendJsonResponse(res, 404, {message: 'locationid not found'});
                return;
            } else if(err) {
                util.sendJsonResponse(res, 404, err);
                return;
            }

            if(location.reviews && location.reviews.length > 0) {
                thisreview = location.reviews.id(req.params.reviewid);
                if(!thisreview) {
                    util.sendJsonResponse(res, 404, {message: 'reviewid not found'});
                } else {
                    thisreview.author = req.body.author;
                    thisreview.rating = req.body.rating;
                    thisreview.reviewText = req.body.reviewText;
                    
                    location.save((err, location) => {
                        if(err) {
                            util.sendJsonResponse(res, 404, err);
                        } else {
                            _updateAvarageRating(location._id);
                            util.sendJsonResponse(res, 200, thisreview);
                        }
                    });
                }
            } else {
                util.sendJsonResponse(res, 404, {message: 'No review to update'});
            }
        });
}

function reviewDeleteOne(req, res) {
    if(!req.params.locationid || !req.params.reviewid){
        util.sendJsonResponse(res, 404, {'message': 'Not found, locationid and reviewid are both required'});
        return;
    }

    locModel
        .findById(req.params.locationid)
        .select('reviews')
        .exec((err, location) => {
            if(!location) {
                util.sendJsonResponse(res, 404, {message: "locationid not found"});
                return;
            } else if(err) {
                util.sendJsonResponse(res, 400, err);
                return;
            }

            if(location.reviews && location.reviews.length > 0) {
                if(!location.reviews.id(req.params.reviewid)) {
                    util.sendJsonResponse(res, 404, {message: 'reviewid not found'});
                }  else {
                    location.reviews.id(req.params.reviewid).remove();
                    location.save((err, location) => {
                        if(err) {
                            util.sendJsonResponse(res, 404, err);
                        } else {
                            _updateAvarageRating(location._id);
                            util.sendJsonResponse(res, 200, null);
                        }
                    });
                }
            } else {
                util.sendJsonResponse(res, 404, {message: "No review to delete"});
            }
        });
}

module.exports = {
    reviewsCreate, 
    reviewsReadOne, 
    reviewsUpdateOne, 
    reviewDeleteOne
}