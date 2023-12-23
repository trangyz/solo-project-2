const { User, Account } = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { use } = require('../server');

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
            // if (!user) {
            //     return res.status(400).next()
            // };
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

userController.updateUser = (req, res, next) => {
    const { username } = req.params;

    // if not updating account data for an existing user, retrieve info from res.locals.user
    // if (!res.locals.user) {
    //     const { accounts, age, retirement_age, monthly_savings, retirement_spend } = req.body;
        // otherwise, retrieve info from request body
    // } else {
        const { accounts, age, retirement_age, monthly_savings, retirement_spend } = res.locals.user;
    // };

    if (!age || !retirement_age) {
        return next({
            log: 'userController.updateUser',
            status: 400,
            message: { err: 'Missing information provided' }
        });
    } else {
        User.findOneAndUpdate({ username }, {
            accounts,
            age,
            retirement_age,
            monthly_savings,
            retirement_spend,
        }, { new: true })
            .then((data) => {
                // calculate future net worth
                let future_net_worth;
                const years = data.retirement_age - data.age;
                let FV_current_accounts = 0;
                data.accounts.forEach((account) => {
                    FV_current_accounts += account.balance * (1 + account.annual_return) ** years
                });
                future_net_worth = data.monthly_savings * 12 * ((1 + 0.07) ** years - 1) / 0.07 + FV_current_accounts;
                // calculate future retirement needs
                let future_retirement_need = 0;
                const retirement_years = 100 - data.retirement_age;
                future_retirement_need = data.retirement_spend * 12 * ((1 - (1 + 0.04) ** (-retirement_years)) / 0.04)
                // update user
                User.findOneAndUpdate({ username }, { future_net_worth, future_retirement_need }, { new: true })
                    .then((newUser) => {
                        res.locals.user = newUser;
                        return next();
                    })
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

// userController.addAccount = (req, res, next) => {
//     const { username } = req.params;
//     const { account_name, annual_return, balance } = req.body;
//     User.findOne({ username })
//         .then((user) => {
//             Account.create({
//                 user: username,
//                 account_name,
//                 annual_return,
//                 balance
//             })
//                 .then((acc) => {
//                     user.accounts.push(acc);
//                     res.locals.user = user;
//                     return next();
//                 })
//         })
//         .catch((err) => {
//             return next({
//                 log: 'Error in userController.addAccount',
//                 status: 400,
//                 message: { err: 'Error when adding account' }
//             })
//         })
// }

// userController.updateAccount = (req, res, next) => {
//     const { username, account } = req.params;
//     const { user, account_name, annual_return, balance } = req.body;
//     Account.findOneAndUpdate({ user: username, account_name: account }, {
//         user,
//         account_name,
//         annual_return,
//         balance,
//     }, { new: true })
//         .then((data) => {
//             res.locals.newAccount = data;
//             User.findOne({ username })
//                 .then((user) => {
//                     res.locals.user = user;
//                     return next();
//                 })
//         })
//         .catch((err) => {
//             return next({
//                 log: 'Error in userController.updateAccount',
//                 status: 400,
//                 message: { err: 'Error when updating account' }
//             })
//         })
// }

// userController.deleteAccount = (req, res, next) => {
//     const { username, account } = req.params;
//     Account.findOneAndDelete({ user: username, account_name: account })
//         .then(() => {
//             User.findOne({ username })
//                 .then((user) => {
//                     const { accounts } = user.accounts;
//                     for (let i = 0; i < accounts.length; i++) {
//                         if (accounts[i].account_name === account) {
//                             accounts[i] = accounts[i + 1];
//                             if (i === accounts.length - 1) {
//                                 accounts[i] = undefined;
//                             };
//                         };
//                     };
//                     User.findOneAndUpdate({ username }, { accounts }, { new: true })
//                         .then((user) => {
//                             res.locals.user = user;
//                             return next();
//                         })
//                 })
//         })
//         .catch((err) => {
//             return next({
//                 log: 'Error in userController.deleteAccount',
//                 status: 400,
//                 message: { err: 'Error when deleting account' }
//             })
//         })
// }


module.exports = userController;
