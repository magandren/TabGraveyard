// The extension was created with the help of an AI Agent :) 
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'deleteTab') {
    const { url, appUrl, tabId } = request;

    fetch(`${appUrl}/api/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: url }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Note: The API scrapes and summarizes, but to save it to the user's account,
        // the user needs to be authenticated. For a full implementation, you'd need
        // to pass the Supabase session token from the web app to the extension.
        // For now, this just triggers the scrape.
        
        chrome.tabs.remove(tabId, () => {
          sendResponse({ success: true, data: data });
        });
      })
      .catch(error => {
        console.error('Error deleting tab:', error);
        sendResponse({ success: false, error: error.message });
      });

    return true;
  }
});
