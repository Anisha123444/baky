const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'data', 'data.json');

app.use(cors());
app.use(express.json());

// Helper function to read data
const readData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return { orders: [], investments: [], menu: [], categories: [], accounts: [] };
  }
};

// Helper function to write data
const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing data:', error);
  }
};

// --- Endpoints ---

// Get all data
app.get('/api/data', (req, res) => {
  res.json(readData());
});

// Orders
app.post('/api/orders', (req, res) => {
  const data = readData();
  const newOrder = { id: Date.now().toString(), ...req.body };
  data.orders.push(newOrder);
  writeData(data);
  res.status(201).json(newOrder);
});

app.put('/api/orders/:id', (req, res) => {
  const data = readData();
  const index = data.orders.findIndex(o => o.id === req.params.id);
  if (index !== -1) {
    data.orders[index] = { ...data.orders[index], ...req.body };
    writeData(data);
    res.json(data.orders[index]);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

app.delete('/api/orders/:id', (req, res) => {
  const data = readData();
  data.orders = data.orders.filter(o => o.id !== req.params.id);
  writeData(data);
  res.json({ success: true });
});

// Investments
app.post('/api/investments', (req, res) => {
  const data = readData();
  const newInvestment = { id: Date.now().toString(), ...req.body };
  data.investments.push(newInvestment);
  writeData(data);
  res.status(201).json(newInvestment);
});

app.put('/api/investments/:id', (req, res) => {
  const data = readData();
  const index = data.investments.findIndex(i => i.id === req.params.id);
  if (index !== -1) {
    data.investments[index] = { ...data.investments[index], ...req.body };
    writeData(data);
    res.json(data.investments[index]);
  } else {
    res.status(404).json({ error: 'Investment not found' });
  }
});

app.delete('/api/investments/:id', (req, res) => {
  const data = readData();
  data.investments = data.investments.filter(i => i.id !== req.params.id);
  writeData(data);
  res.json({ success: true });
});

// Menu
app.post('/api/menu', (req, res) => {
  const data = readData();
  const newItem = { id: Date.now().toString(), ...req.body };
  data.menu.push(newItem);
  writeData(data);
  res.status(201).json(newItem);
});

app.put('/api/menu/:id', (req, res) => {
  const data = readData();
  const index = data.menu.findIndex(m => m.id === req.params.id);
  if (index !== -1) {
    data.menu[index] = { ...data.menu[index], ...req.body };
    writeData(data);
    res.json(data.menu[index]);
  } else {
    res.status(404).json({ error: 'Menu item not found' });
  }
});

app.delete('/api/menu/:id', (req, res) => {
  const data = readData();
  data.menu = data.menu.filter(m => m.id !== req.params.id);
  writeData(data);
  res.json({ success: true });
});

// Categories & Accounts
app.put('/api/settings', (req, res) => {
  const data = readData();
  if (req.body.categories) data.categories = req.body.categories;
  if (req.body.accounts) data.accounts = req.body.accounts;
  writeData(data);
  res.json({ success: true });
});

// Data Management (Import, Reset)
app.post('/api/data/import', (req, res) => {
  if (req.body && req.body.menu && req.body.orders) {
    writeData(req.body);
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid data format' });
  }
});

app.post('/api/data/reset', (req, res) => {
  const currentData = readData();
  const resetData = {
    orders: [],
    investments: [],
    menu: currentData.menu,
    categories: currentData.categories,
    accounts: currentData.accounts
  };
  writeData(resetData);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
