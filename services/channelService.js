// Funzione asincrona per ottenere l'ID di un canale YouTube dato il suo handle (nome utente)
async function getChannelId(handle) {
  // Costruzione dell'URL per la ricerca del canale su YouTube
  const url = `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&part=snippet&type=channel&q=${handle}&maxResults=1`;
  // Effettua la richiesta HTTP all'API di YouTube
  const response = await fetch(url);
  // Conversione della risposta in formato JSON
  const data = await response.json();
  // Estrazione dell'ID del canale dai dati ottenuti, se disponibile
  const channelId = data.items?.[0]?.snippet.channelId;

  // Lancia un errore se il canale non viene trovato
  if (!channelId) {
    throw new Error('Canale non trovato');
  }
  // Ritorna l'ID del canale
  return channelId;
}

// Funzione asincrona per ottenere i dettagli di un canale YouTube dato il suo ID
async function getChannelDetails(channelId) {
  // Costruzione dell'URL per ottenere i dettagli del canale da YouTube
  const channelUrl = `https://www.googleapis.com/youtube/v3/channels?key=${process.env.YOUTUBE_API_KEY}&id=${channelId}&part=snippet,statistics`;
  // Effettua la richiesta HTTP all'API di YouTube
  const response = await fetch(channelUrl);
  // Conversione della risposta in formato JSON
  const data = await response.json();
  // Estrazione dei dati del canale dalla risposta
  const channelData = data.items[0];

  // Ritorna un oggetto con i dettagli rilevanti del canale
  return {
    name: channelData.snippet.title, // Nome del canale
    description: channelData.snippet.description, // Descrizione del canale
    subscribers: channelData.statistics.subscriberCount, // Numero di iscritti
  };
}

// Esportazione delle funzioni per l'uso in altri moduli
module.exports = { getChannelId, getChannelDetails };
