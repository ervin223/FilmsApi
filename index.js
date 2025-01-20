const express = require('express');
const cors = require('cors');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

let movies = [
    { id: 1, name: 'Inception', price: 12.99 },
    { id: 2, name: 'The Matrix', price: 14.99 },
    { id: 3, name: 'Interstellar', price: 16.99 }
];

let actors = {
    1: [{ id: 1, name: 'Leonardo DiCaprio' }, { id: 2, name: 'Ellen Page' }],
    2: [{ id: 3, name: 'Keanu Reeves' }, { id: 4, name: 'Carrie-Anne Moss' }],
    3: [{ id: 5, name: 'Matthew McConaughey' }, { id: 6, name: 'Anne Hathaway' }]
};


app.get('/movies', (req, res) => {
    res.json(movies);
});

app.get('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const movie = movies.find(m => m.id === id);
    if (movie) {
        res.json(movie);
    } else {
        res.status(404).json({ error: 'Movie not found' });
    }
});

app.post('/movies', (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({ error: 'Name and price are required' });
    }
    const newMovie = {
        id: movies.length ? movies[movies.length - 1].id + 1 : 1,
        name,
        price
    };
    movies.push(newMovie);
    res.status(201).json(newMovie);
});

app.put('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, price } = req.body;
    const movie = movies.find(m => m.id === id);
    if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
    }
    if (!name || !price) {
        return res.status(400).json({ error: 'Name and price are required' });
    }
    movie.name = name;
    movie.price = price;
    res.json(movie);
});

app.delete('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = movies.findIndex(m => m.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Movie not found' });
    }
    movies.splice(index, 1);
    res.status(204).send();
});


app.get('/movies/:id/actors', (req, res) => {
    const id = parseInt(req.params.id);
    const movieActors = actors[id];
    if (!movieActors) {
        return res.status(404).json({ error: 'Actors not found for this movie' });
    }
    res.json(movieActors);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
