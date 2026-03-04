// Tab Graveyard
// Create a new bookmark in your browser and paste this code as the URL.

javascript:(async function(){
  const appUrl = 'YOUR_APP_URL';
  const currentUrl = window.location.href;
  
  try {
    const response = await fetch(`${appUrl}/api/ghost-engine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: currentUrl }),
    });
    
    if (response.ok) {
      const data = await response.json();
      alert(`Tab Graveyard: Successfully scraped "${data.title}"\n\nSummary: ${data.summary}\n\nNote: To save to your account, you must be logged in to the app.`);
    } else {
      alert('Tab Graveyard: Failed to scrape URL.');
    }
  } catch (err) {
    alert('Tab Graveyard: Error connecting to server.');
  }
})();
