const express = require('express');
const app = express();

const movies = [
    { id: 1, name: "The Matrix", price: 12.99 },
    { id: 2, name: "Inception", price: 15.49 },
    { id: 3, name: "Interstellar", price: 18.00 },
    { id: 4, name: "The Dark Knight", price: 14.50 },
    { id: 5, name: "Pulp Fiction", price: 10.00 },
    { id: 6, name: "The Godfather", price: 16.99 },
    { id: 7, name: "Forrest Gump", price: 11.50 },
    { id: 8, name: "Gladiator", price: 13.00 }
];

app.get('/movies', (req, res) => {
    res.send(movies);
});

app.get('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id, 10) - 1; 
    const movie = movies[id];

    if (!movie) {
        return res.status(404).send({ error: "Movie not found" }); 
    }

    res.send(movie); 
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
