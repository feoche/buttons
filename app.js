var express = require('express');
var http = require('http');
const fetch = require('node-fetch').default;

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
  const result = await fetch("./json/data.json");

  const data = await result.json();

  res.send(data);
});

app.listen(8000, () => console.info("serveur lancé => http://localhost:8000"));
