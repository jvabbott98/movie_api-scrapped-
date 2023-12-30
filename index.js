const express = require('express'),
    morgan = require('morgan');
const app = express();

let topMovies = [
    {
        title: 'Bernie',
        director: 'Richard Linklater'
    },
    {
        title: 'Arrival',
        director: 'Denis Villeneuve'
    },
    {
        title: 'Secret Life of Walter Mitty',
        director: 'Ben Stiller'
    }
]

app.use(morgan('common'));

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/', (req, res) => {
    res.send('Welcome to my book club!');
});

app.use(express.static('public'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something\'s wrong!')
})

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});