const { User, Account } = require('../models/userModel');
const bcrypt = require('bcryptjs');

const userController = {};

userController.createUser = (req, res, next) => {
    const { username, password } = req.body;
    User.create({
        username,
        password
    })
        .then((data) => {
            res.locals.user = data;
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
    User.findOne({ username })
        .then((data) => {
            bcrypt.compare(password, data.password, function (err, result) {
                if (result) {
                    res.locals.user = data;
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

userController.updateUser = async (req, res, next) => {
    const { username } = req.params;
    console.log(`received ${username} from req.params`)

    const { accounts, age, retirement_age, monthly_savings, retirement_spend } = req.body;

    try {
        const user = await User.findOneAndUpdate({ username }, {
            accounts,
            age,
            retirement_age,
            monthly_savings,
            retirement_spend,
        }, { new: true });
        const { future_net_worth, future_retirement_need } = calculateFinancials(user);

        const updatedUser = await User.findOneAndUpdate(
            { username },
            {
                future_net_worth,
                future_retirement_need
            },
            { new: true }
        );
        res.locals.user = updatedUser;
        return next();
    } catch (error) {
        return next({
            log: 'Error in userController.updateUser',
            status: 400,
            message: { err: 'Error when updating user' }
        });
    }
}

userController.addAccount = async (req, res, next) => {
    const { username } = req.params;
    const { account_name, annual_return, balance } = req.body;
    console.log(account_name, annual_return, balance);
    try {
        newAccount = await Account.create({
            user: username,
            account_name,
            annual_return,
            balance
        });
        const user = await User.findOne({ username });
        const updatedAccounts = [...user.accounts, newAccount];

        const { future_net_worth, future_retirement_need } = calculateFinancials(user, updatedAccounts);

        const updatedUser = await User.findOneAndUpdate(
            { username },
            {
                accounts: updatedAccounts,
                future_net_worth,
                future_retirement_need
            },
            { new: true }
        );
        res.locals.user = updatedUser;
        return next();
    } catch (error) {
        return next({
            log: 'Error in userController.addAccount',
            status: 400,
            message: { err: 'Error when adding account' }
        })
    }
}

userController.updateAccount = async (req, res, next) => {
    console.log('updateaccount running')
    const { username, accountId } = req.params;
    console.log(`received ${username} and ${accountId} from req.params`)
    const { account_name, annual_return, balance } = req.body;
    console.log(`received ${account_name}, ${annual_return} and ${balance} from req.body`)

    try {
        const newAccount = await Account.findOneAndUpdate({ _id: accountId }, {
            account_name,
            annual_return,
            balance,
        }, { new: true });
        console.log(`updated newaccount to ${newAccount}`)
        const user = await User.findOne({ username });
        let updatedAccounts = [];
        for (let i = 0; i < user.accounts.length; i++) {
            console.log(`${user.accounts[i]._id} vs ${accountId}`)
            if (user.accounts[i]._id.toString() === accountId) {
                updatedAccounts.push(newAccount);
            } else {
                updatedAccounts.push(user.accounts[i]);
            }
        }
        const { future_net_worth, future_retirement_need } = calculateFinancials(user, updatedAccounts);
        const updatedUser = await User.findOneAndUpdate(
            { username },
            {
                accounts: updatedAccounts,
                future_net_worth,
                future_retirement_need
            },
            { new: true }
        );
        console.log(`updated user is ${updatedUser}`)
        res.locals.user = updatedUser;
        return next();
    } catch (error) {
        return next({
            log: 'Error in userController.addAccount',
            status: 400,
            message: { err: 'Error when updating account' }
        })
    }
}

userController.deleteAccount = async (req, res, next) => {
    console.log('running deleteAccount')
    const { username, accountId } = req.params;
    console.log(`received ${username} and ${accountId} from req.params`)

    try {
        await Account.findOneAndDelete({ _id: accountId });
        const user = await User.findOne({ username });
        const updatedAccounts = user.accounts.filter(acc => acc._id.toString() !== accountId);
        const { future_net_worth, future_retirement_need } = calculateFinancials(user, updatedAccounts);

        const updatedUser = await User.findOneAndUpdate(
            { username },
            {
                accounts: updatedAccounts,
                future_net_worth,
                future_retirement_need
            },
            { new: true }
        );
        res.locals.user = updatedUser;
        return next();
    } catch (err) {
        return next({
            log: 'Error in userController.deleteAccount',
            status: 400,
            message: { err: 'Error occurred during account deletion' }
        });
    }
}


const calculateFinancials = (user, updatedAccounts = user.accounts) => {
    let future_net_worth = 0;
    let future_retirement_need = 0;

    const years = user.retirement_age - user.age;
    let FV_current_accounts = 0;
    updatedAccounts.forEach((account) => {
        FV_current_accounts += account.balance * ((1 + account.annual_return/100) ** years)
    });
    future_net_worth = user.monthly_savings * 12 * ((1 + 0.07) ** years - 1) / 0.07 + FV_current_accounts;

    const retirement_years = 100 - user.retirement_age;
    future_retirement_need = user.retirement_spend * 12 * ((1 - (1 + 0.04) ** (-retirement_years)) / 0.04)

    return { future_net_worth, future_retirement_need };
};

module.exports = userController;
