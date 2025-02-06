const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
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



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/docs`);
});

