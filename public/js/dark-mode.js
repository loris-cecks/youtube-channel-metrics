document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('darkModeToggle');
  if (!toggle) {
    console.error('Dark mode toggle not found');
    return;
  }

  // Imposta il tema scuro in base alla preferenza salvata
  const darkModeSaved = localStorage.getItem('darkMode') === 'true';
  setDarkMode(darkModeSaved);
  toggle.checked = darkModeSaved;

  // Aggiungi un listener per cambiare il tema
  toggle.addEventListener('change', () => {
    const isEnabled = toggle.checked;
    setDarkMode(isEnabled);
    localStorage.setItem('darkMode', isEnabled);
  });
});

function setDarkMode(enabled) {
  document.body.classList.toggle('dark-mode', enabled);
  document.querySelectorAll('.dark-mode-target').forEach(target => {
    target.classList.toggle('dark-mode', enabled);
  });
}
