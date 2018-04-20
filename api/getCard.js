const base58 = require('../modules/base58');
const Url = require('../models/url');

const getCard = (req, res) => {
  const base58Id = req.params.encoded_id;
  const id = base58.decode(base58Id);
  console.log(id);

  Url.findOne({ _id: id }, (err, doc) => {
    if (doc) {
      console.log('it works');
      res.redirect(doc.card_url);
    } else {
      res.redirect('/');
    }
  });
};

module.exports = getCard;
