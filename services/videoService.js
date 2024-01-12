// Importazione del metodo getChannelId dal modulo channelService
const { getChannelId } = require('./channelService');

// Funzione asincrona per cercare i video di un canale YouTube tramite API
async function searchChannelVideos(channelId) {
  // Costruzione dell'URL per la ricerca dei video su YouTube
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10`;
  // Richiesta HTTP all'API di YouTube
  const response = await fetch(searchUrl);
  // Estrazione dei dati JSON dalla risposta
  const data = await response.json();
  // Ritorno degli elementi video, o un array vuoto se non presenti
  return data.items || [];
}

// Funzione asincrona per ottenere i dettagli di un video YouTube tramite API
async function getVideoDetails(videoId) {
  // Costruzione dell'URL per i dettagli del video su YouTube
  const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${process.env.YOUTUBE_API_KEY}&id=${videoId}&part=statistics,contentDetails`;
  // Richiesta HTTP all'API di YouTube
  const response = await fetch(detailsUrl);
  // Estrazione dei dati JSON dalla risposta
  const data = await response.json();
  // Estrazione delle statistiche e della durata del video dai dati
  const videoStatistics = data.items[0].statistics;
  const videoDuration = data.items[0].contentDetails.duration;
  // Ritorno delle statistiche e della durata del video
  return { ...videoStatistics, duration: videoDuration };
}

// Funzione asincrona per recuperare i video a partire da un identificativo di canale
async function fetchVideos(handle) {
  // Sanitizzazione dell'handle del canale per sicurezza
  const sanitizedHandle = handle.replace(/[^a-zA-Z0-9_-]/g, '');
  // Ottenimento dell'ID del canale tramite l'handle
  const channelId = await getChannelId(sanitizedHandle);
  // Ricerca dei video del canale tramite ID
  const videos = await searchChannelVideos(channelId);

  // Elaborazione dei dettagli di ogni video
  return Promise.all(videos.map(async video => {
    // Ottenimento dei dettagli del video
    const videoDetails = await getVideoDetails(video.id.videoId);
    // Costruzione dell'oggetto con i dettagli del video
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

// Esportazione delle funzioni per l'utilizzo in altri moduli
module.exports = { fetchVideos, getVideoDetails };
