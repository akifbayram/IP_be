const express = require('express');
const db = require('./database');
const app = express();
const PORT = 3000;

app.use(express.static('../IP_fe'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/../IP_fe/index.html');
});

app.get('/health-check', (req, res) => {
  res.send('Hello World');
  console.log(`Health check endpoint was hit`);
});

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});

// https://expressjs.com/en/starter/hello-world.html