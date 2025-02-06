const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

app.use(express.static(__dirname));

const swaggerDocument = yaml.load(fs.readFileSync(path.join(__dirname, 'docs', 'swagger.yaml'), 'utf8'));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

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

//getAll
app.get('/movies', (req, res) => {
    res.json(movies);
});

//getFilmById
app.get('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const movie = movies.find(m => m.id === id);
    if (movie) {
        res.json(movie);
    } else {
        res.status(404).json({ error: 'Movie not found' });
    }
});

//add new films
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

// Добавление актера к фильму
app.post('/movies/:id/actors', (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Actor name is required' });
    }

    if (!actors[id]) {
        return res.status(404).json({ error: 'Movie not found' });
    }

    const newActor = {
        id: actors[id].length ? actors[id][actors[id].length - 1].id + 1 : 1,
        name
    };

    actors[id].push(newActor);
    res.status(201).json(newActor);
});

// Удаление актера из фильма
app.delete('/movies/:movieId/actors/:actorId', (req, res) => {
    const movieId = parseInt(req.params.movieId);
    const actorId = parseInt(req.params.actorId);

    if (!actors[movieId]) {
        return res.status(404).json({ error: 'Movie not found' });
    }

    const actorIndex = actors[movieId].findIndex(actor => actor.id === actorId);

    if (actorIndex === -1) {
        return res.status(404).json({ error: 'Actor not found' });
    }

    actors[movieId].splice(actorIndex, 1);
    res.status(204).send();
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/docs`);
});

