function homeList(req, res) {
    res.render('index', { title: 'Home' });
}

function locationInfo(req, res) {
    res.render('index', { title: 'Location Info' });
}

function addReview(req, res) {
    res.render('index', { title: 'Add Review' });
}


module.exports = { homeList, locationInfo, addReview };