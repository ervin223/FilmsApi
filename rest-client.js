Vue.createApp({
    data() {
        return {
            films: [],
            filmInModal: { id: null, name: null, price: null } 
        };
    },
    created() {
        fetch('http://localhost:8080/movies')
            .then(response => response.json())
            .then(data => {
                this.films = data;
            })
            .catch(error => console.error('Error fetching films:', error));
    },
    methods: {
        async getFilm(id) {
            try {
                const response = await fetch(`http://localhost:8080/movies/${id}`);
                const data = await response.json();
                this.filmInModal = data;

                // Показать модальное окно
                const modal = new bootstrap.Modal(document.getElementById('filmInfoModal'));
                modal.show();
            } catch (error) {
                console.error('Error fetching film details:', error);
            }
        }
    }
}).mount('#app');
