const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    message: { type: String, required: true },
    user: { type: String , required: true },
    createdAt: { type: Date, default: Date.now },
    comments: [{}],
    likes: { type: Number, default: 0 }
  });

module.exports = mongoose.model('Message', messageSchema);
