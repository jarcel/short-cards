const mongoose = require('mongoose');

const { Schema } = mongoose;

const urlSchema = new Schema({
  _id: { type: Number, index: true },
  card_url: String,
  email: String,
  created_at: Date,
});

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;
