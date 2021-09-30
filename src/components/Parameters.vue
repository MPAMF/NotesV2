<template>
  <div class="container">

    <div class="box">
      <h1 class="subtitle">Votre session actuelle est : <b>{{ getSessionId }}</b></h1>

      <div class="columns">
        <div class="column is-second-quarter">
          <b-button icon-left="reload" size="is-medium" @click="loadSession">Charger une autre session</b-button>
        </div>
        <div class="column is-third-quarter">
          <b-button disabled icon-left="download" size="is-medium">Télécharger vos données</b-button>
        </div>
      </div>

      <h1 class="subtitle">Paramètres d'affichage :</h1>
      <section>
        <b-field>
          <b-switch
              v-model="darkMode"
              passive-type='is-dark'>
            Thème sombre
          </b-switch>
        </b-field>
      </section>
    </div>
  </div>
</template>

<script>

import {mapGetters} from "vuex";
import SessionModal from "./SessionModal";

export default {
  name: "Parameters",
  computed: {
    ...mapGetters(['getSessionId', 'isDarkMode']),
    darkMode: {
      get() {
        return this.isDarkMode
      },
      // eslint-disable-next-line no-unused-vars
      set(value) {
          this.$store.commit('setDarkMode', value)
          localStorage.setItem('dark_mode', value.toString())
          const el = document.documentElement

          if (value) {
            el.classList.add('dark-mode-background')
          } else {
            el.classList.remove('dark-mode-background')
          }
      }
    }
  },
  methods: {
    loadSession() {
      this.$buefy.modal.open({
        parent: this,
        component: SessionModal,
        hasModalCard: true,
        trapFocus: true,
        canCancel: true,
      })
    },
    switchDarkMode() {

    }
  }
}
</script>

<style scoped>
b-button:first-of-type {
  margin-right: 1rem;
}

b-button:last-of-type {
  margin-left: 1rem;
}
</style>