const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
  const input = tab.querySelector('input');
  const panel = document.querySelector(`#${input.getAttribute('aria-controls')}`);

  input.addEventListener('change', (e) => {
    // Find the currently selected tab and set its aria-selected attribute to false
    const currentTab = document.querySelector('[aria-selected="true"]');
    currentTab.setAttribute('aria-selected', false);

    // Hide the content of the currently selected tab
    const currentPanel = document.querySelector(`#${currentTab.getAttribute('aria-controls')}`);
    currentPanel.setAttribute('aria-hidden', true);

    // Find the newly selected tab and set its aria-selected attribute to true
    const newTab = e.target;
    newTab.setAttribute('aria-selected', true);

    // Show the content of the newly selected tab
    panel.setAttribute('aria-hidden', false);
  });
});


// this might need to be updated to check tab group