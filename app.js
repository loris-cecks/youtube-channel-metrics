const express = require('express');
const dotenv = require('dotenv');

const { getChannelId, getChannelDetails } = require('./services/channelService');
const { fetchVideos } = require('./services/videoService');

dotenv.config();

const app = express();
const port = 3000;

// Configurazioni dell'app Express
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Middleware per la validazione del link di YouTube
const validateYouTubeLink = (req, res, next) => {
  const youtubeChannelLinkRegex = /^https?:\/\/www\.youtube\.com\/@([a-zA-Z0-9_-]+)$/;
  const channelLink = req.body.channelLink;

  if (!channelLink) {
    return res.render('index', { error: 'Channel link is required' });
  }

  const match = channelLink.match(youtubeChannelLinkRegex);

  if (!match) {
    return res.render('index', { error: 'Invalid YouTube channel link format' });
  }

  req.validatedChannelHandle = match[1];
  next();
};

// Rotta principale
app.get('/', (req, res) => res.render('index'));

// Gestione del submit del form
app.post('/', validateYouTubeLink, async (req, res) => {
  try {
    let videos = [];
    let channelDetails = {};

    if (req.validatedChannelHandle) {
      const channelId = await getChannelId(req.validatedChannelHandle);
      videos = await fetchVideos(req.validatedChannelHandle);
      channelDetails = await getChannelDetails(channelId);
    }

    res.render('index', { videos, channel: channelDetails });
  } catch (err) {
    // Gestisci l'errore qui
    res.status(500).render('error', { error: 'An error occurred' });
  }
});

// Avvio del server
app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
