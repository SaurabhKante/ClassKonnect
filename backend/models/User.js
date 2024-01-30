const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  schoolName: {
    type: String,
  },
  role: {
    type: String,
    enum: ['Teacher', 'Student'],
  },
  state: {
    type: String, // or whatever type is appropriate for your use case
    // Make state optional by removing the required constraint
    // required: true,
  },
});

const User = mongoose.model('User', userSchema);


module.exports = User;
