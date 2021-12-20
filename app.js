var express = require('express');
const fs = require('fs');

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    const result = fs.readFileSync('./json/data.json');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.parse(result));
});

app.use('/sounds', express.static('sounds'));

app.listen(8000, () => console.info("serveur lancé => http://localhost:8000"));
