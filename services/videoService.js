// Importing the getChannelId method from the channelService module
const { getChannelId } = require('./channelService');

// Asynchronous function to search for YouTube channel videos using the API
async function searchChannelVideos(channelId) {
  // Constructing the URL for searching videos on YouTube
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10`;
  // HTTP request to the YouTube API
  const response = await fetch(searchUrl);
  // Extracting JSON data from the response
  const data = await response.json();
  // Returning video items, or an empty array if none are present
  return data.items || [];
}

// Asynchronous function to get YouTube video details using the API
async function getVideoDetails(videoId) {
  // Constructing the URL for video details on YouTube
  const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${process.env.YOUTUBE_API_KEY}&id=${videoId}&part=statistics,contentDetails`;
  // HTTP request to the YouTube API
  const response = await fetch(detailsUrl);
  // Extracting JSON data from the response
  const data = await response.json();
  // Extracting video statistics and duration from the data
  const videoStatistics = data.items[0].statistics;
  const videoDuration = data.items[0].contentDetails.duration;
  // Returning video statistics and duration
  return { ...videoStatistics, duration: videoDuration };
}

// Asynchronous function to retrieve videos from a channel identifier
async function fetchVideos(handle) {
  // Sanitizing the channel handle for security
  const sanitizedHandle = handle.replace(/[^a-zA-Z0-9_-]/g, '');
  // Obtaining the channel ID using the handle
  const channelId = await getChannelId(sanitizedHandle);
  // Searching for channel videos using the ID
  const videos = await searchChannelVideos(channelId);

  // Processing details of each video
  return Promise.all(videos.map(async video => {
    // Obtaining video details
    const videoDetails = await getVideoDetails(video.id.videoId);
    // Constructing the object with video details
    return {
      title: video.snippet.title,
      views: videoDetails.viewCount,
      likes: videoDetails.likeCount,
      comments: videoDetails.commentCount,
      thumbnail: video.snippet.thumbnails.high.url,
      duration: videoDetails.duration
    };
  }));
}

// Exporting functions for use in other modules
module.exports = { fetchVideos, getVideoDetails };
