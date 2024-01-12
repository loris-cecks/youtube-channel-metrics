// Ascolta l'evento 'DOMContentLoaded' che indica che il DOM è completamente caricato
document.addEventListener('DOMContentLoaded', () => {
  // Ottieni l'elemento dell'interruttore per il tema scuro
  const toggle = document.getElementById('darkModeToggle');
  // Se l'interruttore non è presente, scrivi un errore nella console e interrompi l'esecuzione
  if (!toggle) {
    console.error('Interruttore per il tema scuro non trovato');
    return;
  }

  // Verifica se il tema scuro è stato precedentemente salvato come preferenza e lo applica
  const darkModeSaved = localStorage.getItem('darkMode') === 'true';
  setDarkMode(darkModeSaved); // Applica il tema scuro se necessario
  toggle.checked = darkModeSaved; // Imposta lo stato dell'interruttore in base alla preferenza salvata

  // Aggiungi un gestore dell'evento 'change' all'interruttore per attivare/disattivare il tema scuro
  toggle.addEventListener('change', () => {
    const isEnabled = toggle.checked; // Controlla lo stato dell'interruttore
    setDarkMode(isEnabled); // Applica il tema scuro in base allo stato dell'interruttore
    localStorage.setItem('darkMode', isEnabled); // Salva la preferenza del tema scuro
  });
});

// Definisce la funzione per attivare o disattivare il tema scuro
function setDarkMode(enabled) {
  // Aggiunge o rimuove la classe 'dark-mode' al body a seconda se il tema scuro è attivato
  document.body.classList.toggle('dark-mode', enabled);
  // Aggiunge o rimuove la classe 'dark-mode' a tutti gli elementi con classe 'dark-mode-target'
  document.querySelectorAll('.dark-mode-target').forEach(target => {
    target.classList.toggle('dark-mode', enabled);
  });
}
