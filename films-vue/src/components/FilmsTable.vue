<template>
    <div class="container mt-3">
      <h2 class="text-center mb-4">Films Management</h2>
  
      <button class="btn btn-primary mb-3" @click="showAddFilmModal">
        Add New Film
      </button>
  
      <table class="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th style="width: 25%">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="film in films" :key="film.id">
            <td
              @click="getFilmDetails(film.id)"
              class="text-primary"
              style="cursor: pointer;"
            >
              {{ film.name }}
            </td>
            <td>{{ film.price ? film.price.toFixed(2) : 'N/A' }} $</td>
            <td>
              <div class="btn-group">
                <button
                  class="btn btn-info btn-sm"
                  @click="getFilmActors(film.id)"
                >
                  Actors
                </button>

                <button
                  class="btn btn-warning btn-sm"
                  @click="showEditFilmModal(film)"
                >
                  Edit
                </button>
                <button
                  class="btn btn-danger btn-sm"
                  @click="deleteFilm(film.id)"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
  
      <div class="modal fade" id="filmModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                {{ isEditing ? 'Edit Film' : 'Add Film' }}
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label>Film Name</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="filmForm.name"
                />
              </div>
              <div class="mb-3">
                <label>Film Price</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="filmForm.price"
                />
              </div>
              <button
                class="btn btn-success w-100"
                @click="saveFilm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <div class="modal fade" id="filmActorsModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Actors</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <ul class="list-group">
                <li
                  class="list-group-item d-flex justify-content-between align-items-center"
                  v-for="actor in selectedFilmActors"
                  :key="actor.id"
                >
                  {{ actor.name }}
                  <button
                    class="btn btn-danger btn-sm"
                    @click="deleteActor(currentMovieId, actor.id)"
                  >
                    x
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  
      
  
      <div class="modal fade" id="filmDetailsModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Film Details</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <table class="table">
                <tr>
                  <th>ID</th>
                  <td>{{ selectedFilm.id }}</td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td>{{ selectedFilm.name }}</td>
                </tr>
                <tr>
                  <th>Price</th>
                  <td>{{ selectedFilm.price ? selectedFilm.price.toFixed(2) : 'N/A' }} $</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import { Modal } from 'bootstrap'
  
  export default {
    name: 'FilmsTable',
    data() {
      return {
        films: [],
        selectedFilm: {},
        selectedFilmActors: [],
        currentMovieId: null,
        newActorName: '',
        filmForm: { id: null, name: '', price: 0 },
        isEditing: false
      }
    },
    mounted() {
      this.fetchMovies()
    },
    methods: {
      getOrCreateModal(id) {
        const el = document.getElementById(id)
        if (!el) return null
  
        let modal = Modal.getInstance(el)
        if (!modal) {
          modal = new Modal(el, { backdrop: 'static' })
        }
        return modal
      },
  
      async fetchMovies() {
        try {
          const res = await axios.get('http://localhost:8080/movies')
          this.films = res.data
        } catch (err) {
          console.error('Error fetching films:', err)
        }
      },
      showAddFilmModal() {
        this.filmForm = { id: null, name: '', price: 0 }
        this.isEditing = false
        const modal = this.getOrCreateModal('filmModal')
        modal && modal.show()
      },
      showEditFilmModal(film) {
        this.filmForm = { ...film }
        this.isEditing = true
        const modal = this.getOrCreateModal('filmModal')
        modal && modal.show()
      },
      async saveFilm() {
        const method = this.isEditing ? 'put' : 'post'
        const url = this.isEditing
          ? `http://localhost:8080/movies/${this.filmForm.id}`
          : 'http://localhost:8080/movies'
        try {
          await axios({ method, url, data: this.filmForm })
          this.fetchMovies()
          const modal = this.getOrCreateModal('filmModal')
          modal && modal.hide()
        } catch (err) {
          console.error('Error saving film:', err)
        }
      },
      async deleteFilm(id) {
        try {
          await axios.delete(`http://localhost:8080/movies/${id}`)
          this.fetchMovies()
        } catch (err) {
          console.error('Error deleting film:', err)
        }
      },
      async getFilmActors(filmId) {
        try {
          const res = await axios.get(`http://localhost:8080/movies/${filmId}/actors`)
          this.selectedFilmActors = res.data
          this.currentMovieId = filmId
          const modal = this.getOrCreateModal('filmActorsModal')
          modal && modal.show()
        } catch (err) {
          console.error('Error fetching film actors:', err)
        }
      },
      
      async deleteActor(movieId, actorId) {
        try {
          await axios.delete(`http://localhost:8080/movies/${movieId}/actors/${actorId}`)
          this.getFilmActors(movieId)
        } catch (err) {
          console.error('Error deleting actor:', err)
        }
      },
      async getFilmDetails(id) {
        try {
          const res = await axios.get(`http://localhost:8080/movies/${id}`)
          this.selectedFilm = res.data
          const modal = this.getOrCreateModal('filmDetailsModal')
          modal && modal.show()
        } catch (err) {
          console.error('Error fetching film details:', err)
        }
      },
      
    }
  }
  </script>
  
  <style scoped>
  </style>
  