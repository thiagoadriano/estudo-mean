function homeList(req, res) {
    res.render('locations/list', { title: 'Home' });
}

function locationInfo(req, res) {
    res.render('locations/detail', { title: 'Location Info' });
}

function addReview(req, res) {
    res.render('locations/review-form', { title: 'Add Review' });
}


module.exports = { homeList, locationInfo, addReview };