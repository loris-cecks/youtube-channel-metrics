// Listen for the 'DOMContentLoaded' event, which indicates that the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get the dark mode toggle element
  const toggle = document.getElementById('darkModeToggle');
  // If the toggle is not found, write an error to the console and exit
  if (!toggle) {
    console.error('Dark mode toggle not found');
    return;
  }

  // Check if dark mode was previously saved as a preference and apply it
  const darkModeSaved = localStorage.getItem('darkMode') === 'true';
  setDarkMode(darkModeSaved); // Apply dark mode if necessary
  toggle.checked = darkModeSaved; // Set the toggle state based on the saved preference

  // Add a 'change' event handler to the toggle to enable/disable dark mode
  toggle.addEventListener('change', () => {
    const isEnabled = toggle.checked; // Check the toggle state
    setDarkMode(isEnabled); // Apply dark mode based on the toggle state
    localStorage.setItem('darkMode', isEnabled); // Save the dark mode preference
  });
});

// Defines the function to enable or disable dark mode
function setDarkMode(enabled) {
  // Add or remove the 'dark-mode' class to the body depending on whether dark mode is enabled
  document.body.classList.toggle('dark-mode', enabled);
  // Add or remove the 'dark-mode' class to all elements with the 'dark-mode-target' class
  document.querySelectorAll('.dark-mode-target').forEach(target => {
    target.classList.toggle('dark-mode', enabled);
  });
}
