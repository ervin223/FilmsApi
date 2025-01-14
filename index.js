const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

const app = express();
const port = 8080;

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const movies = [
    { id: 1, title: 'Inception', genre: 'Sci-Fi', year: 2010 },
    { id: 2, title: 'The Dark Knight', genre: 'Action', year: 2008 },
    { id: 3, title: 'Forrest Gump', genre: 'Drama', year: 1994 }
];

app.get('/games', (req, res) => {
    const games = [
        { id: 1, title: 'Witcher 3', genre: 'RPG', year: 2015 },
        { id: 2, title: 'Cyberpunk 2077', genre: 'RPG', year: 2020 },
        { id: 3, title: 'The Elder Scrolls V: Skyrim', genre: 'RPG', year: 2011 }
    ];
    res.send(games);
});

app.get('/movies', (req, res) => {
    res.json(movies);
});

app.listen(port, () => {
    console.log(`API работает на http://localhost:${port}`);
});
