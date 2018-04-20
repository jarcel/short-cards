require('dotenv').config();
const AWS = require('aws-sdk');
const Card = require('vcards-js');
const base58 = require('../modules/base58');
const Url = require('../models/url');

const {
  BUCKET_NAME, IAM_USER_KEY, IAM_USER_SECRET, WEBHOST,
} = process.env;

const vCard = new Card();
const s3 = new AWS.S3({
  accessKeyId: IAM_USER_KEY,
  secretAccessKey: IAM_USER_SECRET,
  Bucket: BUCKET_NAME,
});

const makeCard = (req, res) => {
  const { contactInfo } = req.body;
  // Set properties
  Object.keys(contactInfo).map((objectKey) => {
    vCard[objectKey] = contactInfo[objectKey];
  });

  const file = {
    name: `${Math.random().toString(25).slice(2)}-${Math.floor(Date.now() / 1000)}.vcf`,
    data: vCard.getFormattedString(),
  };

  const params = {
    Bucket: BUCKET_NAME,
    Key: file.name,
    Body: file.data,
    ACL: 'public-read',
  };

  const uploadCard = s3.upload(params).promise();
  uploadCard
    // Add listing to DB
    .then((data) => {
      const cardUrl = data.Location;
      const id = Math.floor(Date.now() / 10000);
      const shortUrl = WEBHOST + base58.encode(id);
      const shortCard = new Url({
        _id: id,
        card_url: cardUrl,
        email: contactInfo.email,
        created_at: new Date(),
      });
      shortCard.save((err) => {
        if (err) {
          console.log(err);
        }
      });
      return shortUrl;
    })
    // Return short URL and Token
    .then(data => res.status(200).json({
      success: true,
      url: data,
    }))
    .catch((err) => {
      console.log(`Error: ${err}`);
    });
};

module.exports = makeCard;
