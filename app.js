const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/sounds', (req, res) => {
    let result = JSON.parse(fs.readFileSync('./json/data.json'));
    res.setHeader('Content-Type', 'application/json');
    const query = req.query.query;
    if(query) {
        result = result.filter((item) => {
            const { title, description, keywords } = item;
            let filter = (title && title.toLowerCase().includes(query.toLowerCase()))
                    || (description && description.toLowerCase().includes(query.toLowerCase()))
                    || (keywords && keywords.some((keyword) => keyword.includes(query.toLowerCase())));
            return filter;
        });
    }
    res.send(result);
});

app.get('/sounds/:id', (req, res) => {
    let result;
    try {
        result = fs.readFileSync(`./sounds/${req.params.id}.mp3`);
    } catch (e) {
        result = fs.readFileSync('./sounds/coin.mp3');
    }
    res.setHeader('Content-Type', 'audio/mpeg');
    res.send(result);
});

let server = app.listen(process.env.PORT || 80, () => console.info("serveur lancé => http://localhost"));
setInterval(() => {
    server.close();
    server = app.listen(process.env.PORT || 80, () => console.info("serveur lancé => http://localhost"));
}, 600000);
