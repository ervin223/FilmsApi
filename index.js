const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

const express = require('express');
const app = express();

const movies = [
    { id: 0, name: "The Matrix", price: 12.99 },
    { id: 1, name: "Inception", price: 15.49 },
    { id: 2, name: "Interstellar", price: 18.00 },
    { id: 3, name: "The Dark Knight", price: 14.50 },
    { id: 4, name: "Pulp Fiction", price: 10.00 },
    { id: 5, name: "The Godfather", price: 16.99 },
    { id: 6, name: "Forrest Gump", price: 11.50 },
    { id: 7, name: "Gladiator", price: 13.00 }
];

app.get('/movies', (req, res) => {
    res.send(movies);
});

app.get('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const movie = movies.find(m => m.id === id);

    if (movie) {
        res.send(movie);
    } else {
        res.status(404).send({ error: "Movie not found" });
    }
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
