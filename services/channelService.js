// Asynchronous function to get the ID of a YouTube channel given its handle (username)
async function getChannelId(handle) {
  // Constructing the URL to search for the channel on YouTube
  const url = `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&part=snippet&type=channel&q=${handle}&maxResults=1`;
  // Make an HTTP request to the YouTube API
  const response = await fetch(url);
  // Convert the response to JSON format
  const data = await response.json();
  // Extract the channel ID from the obtained data, if available
  const channelId = data.items?.[0]?.snippet.channelId;

  // Throw an error if the channel is not found
  if (!channelId) {
    throw new Error('Channel not found');
  }
  // Return the channel ID
  return channelId;
}

// Asynchronous function to get the details of a YouTube channel given its ID
async function getChannelDetails(channelId) {
  // Constructing the URL to get channel details from YouTube
  const channelUrl = `https://www.googleapis.com/youtube/v3/channels?key=${process.env.YOUTUBE_API_KEY}&id=${channelId}&part=snippet,statistics`;
  // Make an HTTP request to the YouTube API
  const response = await fetch(channelUrl);
  // Convert the response to JSON format
  const data = await response.json();
  // Extract the channel data from the response
  const channelData = data.items[0];

  // Return an object with relevant channel details
  return {
    name: channelData.snippet.title, // Channel name
    description: channelData.snippet.description, // Channel description
    subscribers: channelData.statistics.subscriberCount, // Number of subscribers
  };
}

// Exporting functions for use in other modules
module.exports = { getChannelId, getChannelDetails };
