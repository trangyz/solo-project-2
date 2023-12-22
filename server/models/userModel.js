const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SALT_WORK_FACTOR = 10;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accounts: [{}],
  age: Number,
  retirement_age: Number,
  monthly_savings: Number,
  retirement_spend: Number,
});


userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt)
    return next();
  }
  catch (err) {
    return next(err);
  }
});

const accountSchema = new Schema({
  user: String,
  user_id: {},
  account_name: String,
  annual_return: Number,
  balance: Number,
})

const User = mongoose.model('User', userSchema);
const Account = mongoose.model('Account', accountSchema);

module.exports = {
  User,
  Account
};
