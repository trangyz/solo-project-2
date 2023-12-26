const Session = require('../models/sessionModel');

const sessionController = {};

sessionController.isLoggedIn = (req, res, next) => {
    const ssidCookie = req.cookies.ssid;
    Session.findOne({ cookieId: ssidCookie })
        .then(data => {
            if (!data) {
                res.redirect('/signup');
            } else {
                return next();
            }
        });
};

sessionController.startSession = (req, res, next) => {
    Session.findOne({ cookieId: res.locals.userID })
        .then(data => {
            if (!data) {
                Session.create({ cookieId: res.locals.userID })
            }
            return next();
        })
}

module.exports = sessionController;
