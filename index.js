const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.json());

const movies = [
    { id: 1, name: "The Matrix", price: 12.99 },
    { id: 2, name: "Inception", price: 15.49 }
];

const getBaseUrl = (req) => `${req.protocol}://${req.get('host')}`;

app.get('/movies', (req, res) => {
    res.status(200).send(movies);
});

app.get('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const movie = movies.find(m => m.id === id);

    if (!movie) {
        return res.status(404).send({ error: "Movie not found" });
    }

    res.status(200).send(movie);
});

app.post('/movies', (req, res) => {
    const { name, price } = req.body;

    if (!name || price === undefined) {
        return res.status(400).send({ error: "Name and price are required." });
    }

    const newMovie = {
        id: movies.length + 1,
        name,
        price: parseFloat(price)
    };

    movies.push(newMovie);

    const locationUrl = `${getBaseUrl(req)}/movies/${newMovie.id}`;

    res.status(201)
        .location(locationUrl) 
        .send(newMovie); 
});

app.delete('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const movieIndex = movies.findIndex(m => m.id === id);

    if (movieIndex === -1) {
        return res.status(404).send({ error: "Movie not found" });
    }

    movies.splice(movieIndex, 1);

    res.status(204).send();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
