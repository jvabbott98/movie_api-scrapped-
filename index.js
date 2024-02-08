const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/moviesDB', { useNewUrlParser: true, useUnifiedTopology: true });

const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      uuid = require('uuid');

app.use(bodyParser.json());

// let movies = [
//     {
//         title: 'Bernie',
//         director: {
//             name: 'Richard Linklater',
//             bio: 'Richard Stuart Linklater is an American film director, producer, and screenwriter. He is known for making films that deal thematically with suburban culture and the effects of the passage of time',
//             birth: '1960'
//         },
//         genre: {
//             name: 'Black Comedy',
//             description: 'Comedy that makes light of subjects generally cosidered taboo or painful like death or grief.'
//         }
//     },
//     {
//         title: 'Arrival',
//         director: {
//             name: 'Denis Villeneuve',
//             bio: 'Denis Villeneuve is a Canadian filmmaker known for directing several critically acclaimed films, including the thrillers Prisoners (2013) and Sicario (2015), as well as the science fiction films Arrival (2016) and Blade Runner 2049 (2017).',
//             birth: '1967'
//         },
//         genre: {
//             name: 'Science Fiction',
//             description: 'Speculative fiction that frequently deals with futuristic concepts like advaced technology, space exploration and science.'
//         }
//     },
//     {
//         title: 'Secret Life of Walter Mitty',
//         director: {
//             name: 'Ben Stiller',
//             bio: 'Ben Stiller is an American actor, comedian, and filmmaker. He is the son of the comedians and actors Jerry Stiller and Anne Meara.[1] Stiller was a member of a group of comedic actors colloquially known as the Frat Pack.',
//             birth: '1965'
//         },
//         genre: {
//             name: 'Comedy-drama',
//             description: 'Combines elements of drama and comedy in a mix of serious, emotional moments and lighthearted humor.'
//         }
//     }
// ]

// let users = [
//     {
//         id: 1,
//         name: 'Tony',
//         favoriteMovies: [

//         ]
//     },
//     {
//         id: '2',
//         name: 'Scott',
//         favoriteMovies: [
//             'Bernie'
//         ]
//     },
// ]


//Create a new user
app.post('/users', async (req, res) => {
    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

// Update a user's info, by username
app.put('/users/:Username', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
  
  });

//Add new movie to a user's favorite movies list
app.post('/users/:username/movies/:MovieID', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.username }, {
       $push: { FavoriteMovies: req.params.MovieID }
     },
     { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

//Remove movie from user's favoite movies list
app.delete('/users/:username/movies/:MovieID', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.username }, {
       $pull: { FavoriteMovies: req.params.MovieID }
     },
     { new: true }) // This line makes sure that the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

// Get all users
app.get('/users', async (req, res) => {
    await Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

  // Get a user by username
app.get('/users/:Username', async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// Delete a user by username
app.delete('/users/:Username', async (req, res) => {
    await Users.findOneAndDelete({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found');
        } else {
          res.status(200).send(req.params.Username + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });


//Send list of movie data to user
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

//Send data of a single movie to user
app.get('/movies/:title', (req, res) => {
    let { title } = req.params;
    let movie = movies.find( movie => movie.title === title);

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie')
    }
});

//Send data about the genre of a movie to the user
app.get('/movies/genre/:genreName', (req, res) => {
    let { genreName } = req.params;
    let genre = movies.find( movie => movie.genre.name === genreName).genre;

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('no such genre')
    }
});

//Send data about the director of a movie back to the user
app.get('/movies/director/:directorName', (req, res) => {
    let { directorName } = req.params;
    let director = movies.find( movie => movie.director.name === directorName).director;

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('no such director')
    }
});

app.listen(8080, () => console.log('Listening on 8080'));
