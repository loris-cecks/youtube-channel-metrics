const { getChannelId } = require('./channelService');

async function searchChannelVideos(channelId) {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10`;
  const response = await fetch(searchUrl);
  const data = await response.json();
  return data.items || [];
}

async function getVideoDetails(videoId) {
  const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${process.env.YOUTUBE_API_KEY}&id=${videoId}&part=statistics,contentDetails`;
  const response = await fetch(detailsUrl);
  const data = await response.json();
  const videoStatistics = data.items[0].statistics;
  const videoDuration = data.items[0].contentDetails.duration;
  return { ...videoStatistics, duration: videoDuration };
}

async function fetchVideos(handle) {
  const sanitizedHandle = handle.replace(/[^a-zA-Z0-9_-]/g, '');
  const channelId = await getChannelId(sanitizedHandle);
  const videos = await searchChannelVideos(channelId);

  return Promise.all(videos.map(async video => {
    const videoDetails = await getVideoDetails(video.id.videoId);
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

module.exports = { fetchVideos, getVideoDetails };
