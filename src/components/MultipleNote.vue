<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head">
      <p class="modal-card-title">Login</p>
      <button
          type="button"
          class="delete"
          @click="$emit('close')"/>
    </header>
    <section class="modal-card-body">
      <div v-for="(note, index) in note.notes" :key="index">
        <b-field :label="note.name">
          <vue-numeric class="input" v-bind:precision="2"
                       v-bind:min="0"
                       v-bind:max="20"
          ></vue-numeric>
        </b-field>

      </div>

    </section>
    <footer class="modal-card-foot">
      <b-button
          label="Close"
          @click="$emit('close')"/>
      <b-button
          label="Login"
          type="is-primary"/>
    </footer>
  </div>
</template>

<script>
import VueNumeric from 'vue-numeric'

export default {
  name: "MultipleNote",
  data() {
    return {
      email: '',
      password: ''
    }
  },
  props: {
    note: {},
  },

  components: {
    VueNumeric
  }
}
</script>

<style scoped>

</style>