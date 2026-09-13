# BAKY - Offline Bakery Order & Profit Manager

This is a personal/customized internal site for BAKY workers to manage orders, investments, menu items, and calculate profits.

## Key Features
- **Offline functionality**: Data is stored locally on your device in a JSON file without relying on the cloud.
- **Order Management**: Add customer names, pick from dynamically populated menu items, auto-calculate totals.
- **Profit Calculation**: View total sales vs total investments. Automatically divide profit evenly amongst 4 people (baidantika, Anisha, krrish, Yashi).
- **Menu Customization**: Edit menu items, prices, enable/disable products, and change categories.
- **Data Backup**: Download JSON backups or import them to restore your site.

## Installation & Setup

1. **Install Node.js**: Ensure you have [Node.js](https://nodejs.org/) installed on your computer.
2. **Open the project folder**: Open this folder `BAKY` in a terminal or command prompt.
3. **Install Dependencies**:
   Run the following command in the `BAKY` folder to install all required packages:
   ```bash
   npm install
   ```

## Starting the Application

To start the application, simply run:
```bash
npm run dev
```

This single command will concurrently:
1. Start the backend local server (handling the local JSON database) on port `5000`.
2. Start the frontend React server.

Once the terminal says it's ready, open your web browser and go to:
**http://localhost:5173**

## Important Notes
- **Data Storage**: All your data is saved in `backend/data/data.json`.
- **No Internet Required**: Because everything is hosted locally, you do not need an internet connection to use the application. Just leave the terminal window open while using the app!
- **To stop the app**: Press `Ctrl + C` in the terminal window.
