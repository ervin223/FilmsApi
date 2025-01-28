<!-- src/App.vue -->
<template>
  <div>
    <FilmsTable />
  </div>
</template>

<script>
import FilmsTable from './components/FilmsTable.vue'

export default {
  name: 'App',
  components: { FilmsTable }
}
</script>

<style>
</style>
