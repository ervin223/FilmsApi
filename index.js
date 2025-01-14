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

app.get('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const movie = movies.find(m => m.id === id);

    if (!movie) {
        return res.status(404).send({ error: "Movie not found" });
    }

    res.send(movie);
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
});
