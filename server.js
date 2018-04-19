const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const makeCard = require('./api/makeCard');

const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/api/make', makeCard);

app.get('/:encoded_id', (req, res) => {
  // route to return shortcard to user
});

app.listen(process.env.PORT || 5000);
