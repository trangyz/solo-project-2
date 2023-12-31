const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sessionSchema = new Schema({
    cookieId: { type: String, required: true, unique: true },
    user: { type: String },
    createdAt: { type: Date, expires: 30000, default: Date.now }
  });
  
  module.exports = mongoose.model('Session', sessionSchema);
  