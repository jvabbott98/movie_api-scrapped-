const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      uuid = require('uuid');

app.use(bodyParser.json());

let movies = [
    {
        title: 'Bernie',
        director: {
            name: 'Richard Linklater',
            bio: 'Richard Stuart Linklater is an American film director, producer, and screenwriter. He is known for making films that deal thematically with suburban culture and the effects of the passage of time',
            birth: '1960'
        },
        genre: {
            name: 'Black Comedy',
            description: 'Comedy that makes light of subjects generally cosidered taboo or painful like death or grief.'
        }
    },
    {
        title: 'Arrival',
        director: {
            name: 'Denis Villeneuve',
            bio: 'Denis Villeneuve is a Canadian filmmaker known for directing several critically acclaimed films, including the thrillers Prisoners (2013) and Sicario (2015), as well as the science fiction films Arrival (2016) and Blade Runner 2049 (2017).',
            birth: '1967'
        },
        genre: {
            name: 'Science Fiction',
            description: 'Speculative fiction that frequently deals with futuristic concepts like advaced technology, space exploration and science.'
        }
    },
    {
        title: 'Secret Life of Walter Mitty',
        director: {
            name: 'Ben Stiller',
            bio: 'Ben Stiller is an American actor, comedian, and filmmaker. He is the son of the comedians and actors Jerry Stiller and Anne Meara.[1] Stiller was a member of a group of comedic actors colloquially known as the Frat Pack.',
            birth: '1965'
        },
        genre: {
            name: 'Comedy-drama',
            description: 'Combines elements of drama and comedy in a mix of serious, emotional moments and lighthearted humor.'
        }
    }
]

let users = [
    {
        id: 1,
        name: 'Tony',
        favoriteMovies: [

        ]
    },
    {
        id: '2',
        name: 'Scott',
        favoriteMovies: [
            'Bernie'
        ]
    },
]


//Create a new user
app.post('users', (req, res) => {
    let newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('Users need names')
    }
});

//Update user username
app.put('users/:id,', (req, res) => {
    let { id } = req.params;
    let updatedUser = req.body;

    let user = users.find(user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user');
    }

});

//Add new movie to a user's favorite movies list
app.post('users/:id/:movieTitle', (req, res) => {
    let { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to ${id}'s array`);
    } else {
        res.status(400).send('no such user');
    }

});

//Remove movie from user's favoite movies list
app.delete('users/:id/:movieTitle', (req, res) => {
    let { id, movieTitle } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from ${id}'s array`);
    } else {
        res.status(400).send('no such user');
    }
});

//Remove user
app.delete('users/:id', (req, res) => {
    let { id } = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        users = users.filter(user => user.id != id);
        res.status(200).send(`user ${id} has been deleted`);
    } else {
        res.status(400).send('no such user');
    }
});




//Send list of movie data to user
app.get('/movies', (req, res) => {
    res.status(200).res.json(movies);
});

//Send data of a single movie to user
app.get('/movies/:title', (req, res) => {
    let { title } = req.params;
    let movie = movies.find( movie => movie.title === title);

    if (movie) {
        res.status.json(movie);
    } else {
        res.status(400).send('no such movie')
    }
});

//Send data about the genre of a movie to the user
app.get('/movies/genre/:genreName', (req, res) => {
    let { genreName } = req.params;
    let genre = movies.find( movie => movie.genre.name === genreName).genre;

    if (genre) {
        res.status.json(genre);
    } else {
        res.status(400).send('no such genre')
    }
});

//Send data about the director of a movie back to the user
app.get('/movies/director/:directorName', (req, res) => {
    let { directorName } = req.params;
    let director = movies.find( movie => movie.director.name === directorName).director;

    if (director) {
        res.status.json(director);
    } else {
        res.status(400).send('no such director')
    }
});
