// The extension was created with the help of an AI Agent :) 

document.addEventListener('DOMContentLoaded', () => {
  const appUrlInput = document.getElementById('appUrl');
  const deleteBtn = document.getElementById('deleteBtn');
  const statusEl = document.getElementById('status');

  // Load saved URL
  chrome.storage.sync.get(['appUrl'], (result) => {
    if (result.appUrl) {
      appUrlInput.value = result.appUrl;
    }
  });

  // Save URL on change
  appUrlInput.addEventListener('change', (e) => {
    chrome.storage.sync.set({ appUrl: e.target.value });
  });

  deleteBtn.addEventListener('click', async () => {
    const appUrl = appUrlInput.value.trim();
    if (!appUrl) {
      statusEl.textContent = 'Please enter your app URL.';
      return;
    }

    statusEl.textContent = 'Deleting...';
    deleteBtn.disabled = true;

    try {
      // Get current active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.url) {
        statusEl.textContent = 'No active tab found.';
        deleteBtn.disabled = false;
        return;
      }

      // Send message to background script to handle the API call and closing
      chrome.runtime.sendMessage(
        { action: 'deleteTab', url: tab.url, appUrl: appUrl, tabId: tab.id },
        (response) => {
          if (response && response.success) {
            statusEl.textContent = 'Success!';
          } else {
            statusEl.textContent = 'Error: ' + (response?.error || 'Unknown error');
            deleteBtn.disabled = false;
          }
        }
      );
    } catch (err) {
      statusEl.textContent = 'Error: ' + err.message;
      deleteBtn.disabled = false;
    }
  });
});
