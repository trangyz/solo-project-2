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
app.use(express.urlencoded());
app.use('/client', express.static(path.resolve(__dirname, '../client')));

//index
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/index.html'));
});

// signup
app.get('/signup', (req, res) => {
    res.status(200).sendFile(path.resolve(__dirname, '../client/signup.html'));
});

app.post('/signup', userController.createUser, (req, res) => {
    res.status(200).redirect('../client/feed.html');
})

// login
app.post('/login', userController.verifyUser, (req, res) => {
    res.status(200).redirect('../client/feed.html');
});
 

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
