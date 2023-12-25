async function getChannelId(handle) {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&part=snippet&type=channel&q=${handle}&maxResults=1`;
  const response = await fetch(url);
  const data = await response.json(); // Converti la risposta in JSON
  const channelId = data.items?.[0]?.snippet.channelId;

  if (!channelId) {
    throw new Error('Channel not found');
  }
  return channelId;
}

async function getChannelDetails(channelId) {
  const channelUrl = `https://www.googleapis.com/youtube/v3/channels?key=${process.env.YOUTUBE_API_KEY}&id=${channelId}&part=snippet,statistics`;
  const response = await fetch(channelUrl);
  const data = await response.json(); // Converti la risposta in JSON
  const channelData = data.items[0];

  return {
    name: channelData.snippet.title,
    description: channelData.snippet.description,
    subscribers: channelData.statistics.subscriberCount,
  };
}

module.exports = { getChannelId, getChannelDetails };
