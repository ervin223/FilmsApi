const express = require('express');
const yaml = require('yamljs');
const swaggerUi = require('swagger-ui-express');

const app = express();

const swaggerDocument = yaml.load('./docs/swagger.yaml');

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const movies = [
    { id: 1, name: "The Matrix", price: 12.99 },
    { id: 2, name: "Inception", price: 15.49 },
    { id: 3, name: "Interstellar", price: 18.00 },
    { id: 4, name: "The Dark Knight", price: 14.50 }
];

app.get('/movies', (req, res) => {
    res.send(movies);
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

    res.status(201)
        .location(`/movies/${newMovie.id}`) 
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

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
});

app.post('/movies', (req, res) => {
    const { name, price } = req.body;

    if (!name || !price) {
        return res.status(400).send({ error: "Name and price are required." });
    }

    const newMovie = {
        id: movies.length + 1,
        name,
        price: parseFloat(price)
    };

    movies.push(newMovie);
    res.status(201).send(newMovie);
});

