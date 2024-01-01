const Message = require('../models/messageModel');
const { User } = require('../models/userModel');

const messageController = {};

messageController.getMessages = (req, res, next) => {
    Message.find({})
        .then((msgs) => {
            res.locals.messages = msgs;
            return next();
        })
        .catch((err) => {
            return next({
                log: 'Error in messageController.getMessages',
                status: 400,
                message: { err: 'Error when retrieving messages' }
            })
        })
}

messageController.addMessage = (req, res, next) => {
    const { message, user } = req.body;
    Message.create({
        message,
        user,
    })
    .then(() => {
        Message.find({})
        .then((msgs) => {
            res.locals.messages = msgs;
            return next();
        })
    })
    .catch((err) => {
        return next({
            log: 'Error in messageController.addMessage',
            status: 400,
            message: { err: 'Error when adding message' }            
        })
    })
}

module.exports = messageController;
