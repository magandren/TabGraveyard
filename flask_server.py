from flask import Flask, request, jsonify
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.common.exceptions import WebDriverException

app = Flask(__name__)
# Enable CORS 
CORS(app)

def get_page_metadata(url):
    # Set up Selenium
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    
    driver = None
    try:
        driver = webdriver.Chrome(options=chrome_options) 
        driver.get(url)
        
        # Try to extract the title
        title = driver.title
        
        # Try to extract the description
        description = ""
        try:
            meta_desc = driver.find_element(By.XPATH, "//meta[@name='description']")
            description = meta_desc.get_attribute("content")
        except:
            description = "No description available."
            
        return {"title": title, "description": description, "url": url}
        
    except WebDriverException as e:
        return {"title": url, "description": "Failed to scrape metadata.", "url": url}
    finally:
        if driver:
            driver.quit()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "backend": "Flask + Selenium"})

@app.route('/api/scrape', methods=['POST'])
def scrape():
    data = request.get_json()
    url = data.get('url')
    
    if not url:
        return jsonify({"error": "URL is required"}), 400
        
    metadata = get_page_metadata(url)
    return jsonify(metadata)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
