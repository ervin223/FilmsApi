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
    { id: 3, name: 'The Matrix', price: 12.99 }
];

app.get('/movies', (req, res) => {
    res.status(200).send(movies);
});

app.get('/movies/:id', (req, res) => {
    const movie = movies.find(m => m.id === parseInt(req.params.id));
    if (!movie) {
        return res.status(404).send({ error: 'Movie not found' });
    }
    res.status(200).send(movie);
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
