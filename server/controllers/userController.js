const { User, Account } = require('../models/userModel');
const bcrypt = require('bcryptjs');

const userController = {};

userController.createUser = (req, res, next) => {
    const { username, password } = req.body;
    User.create({
        username,
        password
    })
        .then(() => {
            res.locals.userID = data.id;
            return next()
        })
        .catch((err) => {
            return next({
                log: 'Error in userController.createUser',
                status: 400,
                message: { err: 'Error when creating new user' }
            })
        });
}

userController.verifyUser = (req, res, next) => {
    const { username, password } = req.body;
    User.findOne({ username }, 'password')
        .then((data) => {
            bcrypt.compare(req.body.password, data.password, function (err, result) {
                if (result) {
                    res.locals.userID = data.id;
                    return next();
                } else {
                    res.redirect('/signup');
                }
            })
        })
        .catch((err) => {
            res.redirect('/signup');
        })
}

userController.getUser = (req, res, next) => {
    const { username } = req.params;
    User.findOne({ username })
    .then((user) => {
        if (!user) {
            return res.status(400).next()
        };
        res.locals.user = user;
        return next();
    })
    .catch((err) => {
        return next({
            log: 'Error in userController.getUser',
            status: 400,
            message: { err: 'Error getting user' }
        })
    });
}

userController.getAccounts = (req, res, next) => {
   
    return next();
}

userController.updateUser = (req, res, next) => {
    const { username } = req.params;
    const { accounts, age, retirement_age, monthly_savings, retirement_spend } = req.body;
    if (!age || !retirement_age) {
        return next({
            log: 'userController.updateUser',
            status: 400,
            message: { err: 'Missing information provided' }
        });
    } else {
        User.findOneAndUpdate({ username: username }, {
            accounts,
            age,
            retirement_age,
            monthly_savings,
            retirement_spend,
        },
        {
            new: true,
        })
            .then((data) => {
                res.locals.updatedUser = data;
                return next();
            })
            .catch((err) => {
                return next({
                    log: 'Error in userController.updateUser',
                    status: 400,
                    message: { err: 'Error when updating user' }
                })
            })
    }

}

module.exports = userController;
