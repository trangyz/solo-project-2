const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const userController = require('./controllers/userController');
const cookieController = require('./controllers/cookieController');

const PORT = 3000;
const app = express();

const mongoURI =
    'mongodb+srv://trangyz:soloproject@solo-project.trviqj0.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoURI);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/client', express.static(path.resolve(__dirname, '../client')));


//index
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/index.html'));
});

// signup
app.get('/signup', (req, res) => {
    res.status(200).redirect('../signup.html');
    // res.status(200).sendFile(path.resolve(__dirname, '../client/signup.html'));
});

app.post('/signup', userController.createUser, cookieController.setSSIDCookie, (req, res) => {
    res.status(200).redirect('../feed.html');
})

// login
app.post('/login', userController.verifyUser, cookieController.setSSIDCookie, (req, res) => {
    res.status(200).redirect('../feed.html');
});

// get user data
app.get('/feed/:username', userController.getUser, (req, res) => {
    res.status(200).send(res.locals.user);
});

// //feed
// app.get('/feed', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../client/feed.html'));
// })

// add account
app.post('/update/:username', userController.addAccount, userController.updateUser, (req, res) => {
    return res.status(200).send(res.locals.user);
})

// update account
app.patch('/update/:username/:account', userController.updateAccount, userController.updateUser, (req, res) => {
    return res.status(200).send(res.locals.user);
})

// update other user info
app.patch('/update/:username', userController.updateUser, (req, res) => {
    return res.status(200).send(res.locals.user);
})

// delete account
app.patch('/delete/:username/:account', (req, res) => {
    return res.status(200);
})


// 404
app.use('*', (req, res) => {
    res.status(404).send('Page not found.');
});

// Global error handler
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ error: err });
});


app.listen(PORT, () => { console.log(`Listening on port ${PORT}...`); });


module.exports = app;
