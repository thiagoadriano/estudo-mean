var util = require('../helpers/util');

function reviewsCreate(req, res) {
    util.sendJsonResponse(res, 200, {'status': 'success'});
}

function reviewsReadOne(req, res) {
    util.sendJsonResponse(res, 200, {'status': 'success'});
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