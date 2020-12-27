const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');

const imagesPath = path.join(__dirname, '../images/');

const template = ``
const sendError = (err, res) => { res.status(500).send(`<h1>Server Error</h1><p>${err}</p>`); }


app.set('view engine', 'ejs');
app.use('/images', express.static('images'));

const getFileList = (basePath = '') => {
  const directoryPath = path.join(imagesPath, basePath);
  return fs.readdirSync(directoryPath)
    .filter(file => !file.startsWith('.')).sort();
};

app.get('/', function (req, res) {
  const items = getFileList('').map(item => { return {url: `/${item}`, title: item}; });
  res.render('list', {items, title: 'All series'});
});

app.get('/:series', function (req, res) {
  const series = req.params.series;
  const items = getFileList(series).map(item => { return {url: `/${series}/${item}`, title: item}; });
  res.render('list', {
    items,
    title: `Series: ${series}`,
    backUrl: `/`
  });
});

app.get('/:series/:set', function (req, res) {
  const series = req.params.series;
  const set = req.params.set;
  const setPath = `${series}/${set}`
  const items = getFileList(setPath).map(item => { return {url: `/images/${setPath}/${item}`, title: item}; });

  res.render('gallery', {
    items,
    title: `Set: ${series} / ${set}`,
    backUrl: `/${series}`
  });
});

app.listen(3000, function () {
    console.log('Listening on http://localhost:3000/');
});
