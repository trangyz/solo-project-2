const session = require('express-session');
const Session = require('../models/sessionModel');
const { User } = require('../models/userModel');

const sessionController = {};

sessionController.isLoggedIn = (req, res, next) => {
    const ssidCookie = req.cookies.ssid;
    Session.findOne({ cookieId: ssidCookie })
        .then(data => {
            if (!data) {
                res.redirect('/signup');
            } else {
                User.findOne({ username: data.user})
                .then((user) => {
                    res.locals.user = user;
                    console.log(user);
                    return next();
                })
            }
        });
};

sessionController.startSession = (req, res, next) => {
    Session.findOne({ cookieId: res.locals.userID })
        .then(data => {
            if (!data) {
                Session.create({ cookieId: res.locals.userID, user: res.locals.user.username })
            }
            return next();
        })
}

sessionController.endSession = (req, res, next) => {
    const ssidCookie = req.cookies.ssid;
    Session.findOneAndDelete({ cookieId: ssidCookie })
    .then(() => next());
}

module.exports = sessionController;
