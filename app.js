const express = require('express');
const dotenv = require('dotenv');

const { getChannelId, getChannelDetails } = require('./services/channelService');
const { fetchVideos } = require('./services/videoService');

dotenv.config();

const app = express();
const port = 3000;

// Express app configurations
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Middleware for YouTube link validation
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

// Main route
app.get('/', (req, res) => res.render('index'));

// Handling form submission
app.post('/', validateYouTubeLink, async (req, res) => {
  try {
    let videos = [];
    let channelDetails = null;

    if (req.validatedChannelHandle) {
      const channelId = await getChannelId(req.validatedChannelHandle);
      if (channelId) {
        videos = await fetchVideos(req.validatedChannelHandle);
        channelDetails = await getChannelDetails(channelId);
      }
    }

    // Render the page with channel details if they exist
    res.render('index', { videos, channel: channelDetails });
  } catch (err) {
    // Render the page with an error message and no channel details
    res.render('index', { error: 'The entered channel does not exist', videos: [], channel: null });
  }
});

// Starting the server
app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
