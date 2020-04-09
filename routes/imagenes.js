var express = require('express');
const path = require('path');
const fs = require('fs');

var app = express();

app.get('/:type/:img', (req, res, next) => {
    var type = req.params.type;
    var img = req.params.img;

    let pathImg = path.resolve(__dirname, `../uploads/${type}/${img}`);
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        let pathNoImg = path.resolve(__dirname, `../assets/no-img.jpg`);
        res.sendFile(pathNoImg);
    }

});

module.exports = app;