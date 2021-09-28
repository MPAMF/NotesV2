<template>
  <div class="container">

    <div class="box">
      <h1 class="subtitle">Votre session actuelle est : <b>{{getSessionId}}</b></h1>
      <b-button size="is-medium" icon-left="reload" @click="loadSession">Charger une autre session</b-button>
      <b-button size="is-medium" icon-left="download" disabled>Télécharger vos données</b-button>
    </div>
  </div>
</template>

<script>

import {mapGetters} from "vuex";
import SessionModal from "./SessionModal";

export default {
  name: "Parameters",
  computed: {
    ...mapGetters(['getSessionId'])
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
    }
  }
}
</script>

<style scoped>

</style>