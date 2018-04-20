const mongoose = require('mongoose');

const { Schema } = mongoose;

// create a schema
const urlSchema = new Schema({
  _id: { type: Number, index: true },
  card_url: String,
  email: String,
  created_at: Date,
});

// the schema is useless so far
// we need to create a model using it
const Url = mongoose.model('Url', urlSchema);

// make this available to our users in our Node applications
module.exports = Url;
