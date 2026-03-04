# Tab Graveyard 🪦

A full-stack bookmarking system that automatically scrapes, parses, and categorizes links so you can safely close your tabs without losing context. 

## 🚀 Local Setup Instructions

### Prerequisites
* [Node.js](https://nodejs.org/) (v18+)
* [Python](https://www.python.org/) (v3.8+)
* Google Chrome (Required for Selenium)

### 1. Database Setup
1. Create an account at [Supabase](https://supabase.com/).
2. Create a new project.
3. In the SQL Editor, run the following query to create the `tabs` table:
   ```sql
   CREATE TABLE tabs (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users NOT NULL,
     url TEXT NOT NULL,
     title TEXT NOT NULL,
     summary TEXT,
     category TEXT,
     status TEXT DEFAULT 'active',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
   );

   -- Enable Row Level Security (RLS)
   ALTER TABLE tabs ENABLE ROW LEVEL SECURITY;

   -- Create policies so users can only see/edit their own tabs
   CREATE POLICY "Users can view their own tabs" ON tabs FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can insert their own tabs" ON tabs FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update their own tabs" ON tabs FOR UPDATE USING (auth.uid() = user_id);
   ```

### 2. Frontend Setup
1. Clone this repository and navigate to the project root.
2. Install the Node dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your Supabase keys (found in your Supabase Project Settings > API):
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the React development server:
   ```bash
   npm run dev
   ```

### 3. Backend Setup
1. Create a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
2. Install the required Python packages:
   ```bash
   pip install flask flask-cors selenium
   ```
3. Start the Flask server:
   ```bash
   python flask_server.py
   ```

## Chrome Extension Setup - WIP

The companion Chrome Extension allows you to send your current active tab to the Graveyard and close it in one click.
This feature is not completed yet, currently leveraging Gemini to implement this feature.

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Toggle **Developer mode** ON (top right corner).
3. Click **Load unpacked** (top left corner).
4. Select the `extension` folder located inside this project repository.
5. Pin the "Tab Graveyard" skull icon to your Chrome toolbar.
6. Click the extension icon. In the "App URL" input box, enter your local React server URL:
   ```text
   http://localhost:5173
   ```
7. **Test it out:** Navigate to any website, click the extension, and hit "Delete & Close Tab". The extension will ping your Flask server to scrape the site, and then close your tab!
