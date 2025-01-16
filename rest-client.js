Vue.createApp({
    data() {
        return {
            films: [],
        };
    },
    created() {
        this.fetchMovies();
    },
    methods: {
        fetchMovies() {
            fetch('http://localhost:8080/movies')
                .then(response => response.json())
                .then(data => {
                    this.films = data;
                })
                .catch(error => console.error('Error fetching movies:', error));
        },
        getFilmActors(id) {
            fetch(`http://localhost:8080/movies/${id}/actors`)
                .then(response => response.json())
                .then(data => {
                    console.log('Actors:', data);
                })
                .catch(error => console.error('Error fetching actors:', error));
        }
    }
}).mount('#app');
