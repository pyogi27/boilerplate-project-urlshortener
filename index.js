require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('public'));
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

const urlDatabase = {};
let urlIndex = 0;

app.post('/api/shorturl', (req, res) => {
  const originalURL = req.body.url;
  const urlPattern = /^https?:\/\/(.+)/i;
  if (!urlPattern.test(originalURL)) {
    return res.status(400).json({ error: 'invalid URL' });
  }

  urlIndex++;
  const shortUrl = `http://localhost:${port}/api/shorturl/${urlIndex}`;
  urlDatabase[urlIndex] = originalURL;
  res.json({ original_url: originalURL, short_url: shortUrl });
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrlCode = req.params.short_url;
  const originalUrl = urlDatabase[shortUrlCode];
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).send('No URL found');
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
