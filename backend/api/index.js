const express = require('express');
const app = express();

// Your Express routes
app.get('/api', (req, res) => {
    res.json({ message: 'Hello from API' });
});

module.exports = app;
