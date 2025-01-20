Vue.createApp({
    data() {
        return {
            films: [], 
            selectedFilm: {}, 
            selectedFilmActors: [], 
            filmForm: { id: null, name: '', price: 0 }, 
            isEditing: false 
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
                    this.films = data.map(film => ({
                        id: film.id || null,
                        name: film.name || 'Untitled',
                        price: typeof film.price === 'number' ? film.price : 0
                    }));
                })
                .catch(error => console.error('Error fetching movies:', error));
        },
        getOrCreateModal(modalId) {
            const modalElement = document.getElementById(modalId);
            if (!modalElement) {
                console.error(`Modal with ID "${modalId}" not found.`);
                return null;
            }
            let modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (!modalInstance) {
                modalInstance = new bootstrap.Modal(modalElement, { backdrop: true });
            }
            return modalInstance;
        },
        showAddFilmModal() {
            this.filmForm = { id: null, name: '', price: 0 };
            this.isEditing = false;
            const modal = this.getOrCreateModal('filmModal');
            if (modal) modal.show();
        },
        showEditFilmModal(film) {
            this.filmForm = { ...film };
            this.isEditing = true;
            const modal = this.getOrCreateModal('filmModal');
            if (modal) modal.show();
        },
        saveFilm() {
            const method = this.isEditing ? 'PUT' : 'POST';
            const url = this.isEditing
                ? `http://localhost:8080/movies/${this.filmForm.id}`
                : 'http://localhost:8080/movies';

            fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.filmForm)
            })
                .then(() => {
                    this.fetchMovies();
                    const modal = this.getOrCreateModal('filmModal');
                    if (modal) modal.hide();
                })
                .catch(error => console.error('Error saving film:', error));
        },
        deleteFilm(id) {
            fetch(`http://localhost:8080/movies/${id}`, { method: 'DELETE' })
                .then(() => this.fetchMovies())
                .catch(error => console.error('Error deleting film:', error));
        },
        getFilmActors(id) {
            fetch(`http://localhost:8080/movies/${id}/actors`)
                .then(response => response.json())
                .then(data => {
                    this.selectedFilmActors = data;
                    const modal = this.getOrCreateModal('filmActorsModal');
                    if (modal) modal.show();
                })
                .catch(error => console.error('Error fetching film actors:', error));
        },
        getFilmDetails(id) {
            fetch(`http://localhost:8080/movies/${id}`)
                .then(response => response.json())
                .then(data => {
                    this.selectedFilm = data;
                    const modal = this.getOrCreateModal('filmDetailsModal');
                    if (modal) modal.show();
                })
                .catch(error => console.error('Error fetching film details:', error));
        }
    }
}).mount('#app');
