const session = require('express-session');
const Session = require('../models/sessionModel');
const { User } = require('../models/userModel');

const sessionController = {};

sessionController.isLoggedIn = (req, res, next) => {
    console.log('sessionController.isLoggedIn runnng');
    const ssidCookie = req.cookies.ssid;
    Session.findOne({ cookieId: ssidCookie })
        .then(data => {
            if (!data) {
                res.redirect('/signup');
            } else {
                console.log(`retrieved username is ${data.user}`);
                User.findOne({ username: data.user})
                .then((user) => {
                    console.log(`found user ${user.username}`)
                    res.locals.user = user;
                    return next();
                })
            }
        })
        .catch((err) => {
            return next({
                log: 'Error in sessionController.isLoggedIn',
                status: 400,
                message: { err: 'Error when verifying logged in session' }
            })
        })
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
