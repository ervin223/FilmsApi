Vue.createApp({
    data() {
        return {
            films: [], 
            selectedFilm: {}, 
            selectedFilmActors: [] 
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
        async getFilmDetails(id) {
            try {
                const response = await fetch(`http://localhost:8080/movies/${id}`);
                const data = await response.json();
                this.selectedFilm = data;

                const modal = new bootstrap.Modal(document.getElementById('filmDetailsModal'));
                modal.show();
            } catch (error) {
                console.error('Error fetching film details:', error);
            }
        },
        async getFilmActors(id) {
            try {
                const response = await fetch(`http://localhost:8080/movies/${id}/actors`);
                const data = await response.json();
                this.selectedFilmActors = data;

                const modal = new bootstrap.Modal(document.getElementById('filmActorsModal'));
                modal.show();
            } catch (error) {
                console.error('Error fetching film actors:', error);
            }
        }
    }
}).mount('#app');
