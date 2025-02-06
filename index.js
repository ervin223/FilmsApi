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

// update film by id
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

// delete films by id
app.delete('/movies/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = movies.findIndex(m => m.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Movie not found' });
    }
    movies.splice(index, 1);
    res.status(204).send();
});

// get all actors
app.get('/movies/:id/actors', (req, res) => {
    const id = parseInt(req.params.id);
    const movieActors = actors[id] || [];
    res.json(movieActors);
});

// get actor by id
app.get('/movies/:id/actors/:actorId', (req, res) => {
    const movieId = parseInt(req.params.id);
    const actorId = parseInt(req.params.actorId);

    if (!actors[movieId]) {
        return res.status(404).json({ error: 'Movie not found' });
    }

    const actor = actors[movieId].find(a => a.id === actorId);
    if (!actor) {
        return res.status(404).json({ error: 'Actor not found' });
    }

    res.json(actor);
});

//update actor by id 
app.put('/movies/:id/actors/:actorId', (req, res) => {
    const movieId = parseInt(req.params.id);
    const actorId = parseInt(req.params.actorId);
    const { name } = req.body;

    if (!actors[movieId]) {
        return res.status(404).json({ error: 'Movie not found' });
    }

    const actor = actors[movieId].find(a => a.id === actorId);
    if (!actor) {
        return res.status(404).json({ error: 'Actor not found' });
    }

    if (!name) {
        return res.status(400).json({ error: 'Actor name is required' });
    }

    actor.name = name;
    res.json(actor);
});

//add new actor
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

//delete actors by id
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

