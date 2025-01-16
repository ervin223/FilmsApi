const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

const movies = [
    { id: 1, name: 'Inception', price: 15.49 },
    { id: 2, name: 'Interstellar', price: 18.99 },
    { id: 3, name: 'The Matrix', price: 12.99 },
];

const actors = [
    { id: 1, name: 'Leonardo DiCaprio' },
    { id: 2, name: 'Keanu Reeves' },
];

const movieActors = [
    { movieId: 1, actorId: 1 },
    { movieId: 1, actorId: 2 },
];

app.get('/movies', (req, res) => res.status(200).send(movies));
app.get('/movies/:id', (req, res) => {
    const movie = movies.find(m => m.id === parseInt(req.params.id));
    if (!movie) return res.status(404).send({ error: 'Movie not found' });
    res.status(200).send(movie);
});
app.post('/movies', (req, res) => {
    const { name, price } = req.body;
    if (!name || price === undefined) return res.status(400).send({ error: 'Name and price are required.' });
    const newMovie = { id: movies.length + 1, name, price };
    movies.push(newMovie);
    res.status(201).send(newMovie);
});
app.put('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name, price } = req.body;
    const movie = movies.find(m => m.id === id);
    if (!movie) return res.status(404).send({ error: 'Movie not found.' });
    if (name) movie.name = name;
    if (price !== undefined) movie.price = price;
    res.status(200).send(movie);
});
app.delete('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const movieIndex = movies.findIndex(m => m.id === id);
    if (movieIndex === -1) return res.status(404).send({ error: 'Movie not found.' });
    movies.splice(movieIndex, 1);
    res.status(204).send();
});

app.get('/actors', (req, res) => res.status(200).send(actors));
app.post('/actors', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).send({ error: 'Name is required.' });
    const newActor = { id: actors.length + 1, name };
    actors.push(newActor);
    res.status(201).send(newActor);
});

app.get('/movies/:id/actors', (req, res) => {
    const movieId = parseInt(req.params.id, 10);
    const relatedActors = movieActors
        .filter(ma => ma.movieId === movieId)
        .map(ma => actors.find(a => a.id === ma.actorId));
    res.status(200).send(relatedActors);
});
app.post('/movies/:id/actors', (req, res) => {
    const movieId = parseInt(req.params.id, 10);
    const { actorId } = req.body;
    if (!movies.find(m => m.id === movieId)) return res.status(404).send({ error: 'Movie not found.' });
    if (!actors.find(a => a.id === actorId)) return res.status(404).send({ error: 'Actor not found.' });
    movieActors.push({ movieId, actorId });
    res.status(201).send({ movieId, actorId });
});
app.delete('/movies/:id/actors/:actorId', (req, res) => {
    const movieId = parseInt(req.params.id, 10);
    const actorId = parseInt(req.params.actorId, 10);
    const index = movieActors.findIndex(ma => ma.movieId === movieId && ma.actorId === actorId);
    if (index === -1) return res.status(404).send({ error: 'Relation not found.' });
    movieActors.splice(index, 1);
    res.status(204).send();
});

const PORT = 8080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
