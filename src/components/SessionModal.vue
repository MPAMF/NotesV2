<template>
  <div class="modal-card">
    <section class="modal-card-body">

      <div class="box">

        <div class="columns is-centered">
          <div class="column text-center"><p class="subtitle">Entrez votre clé de session</p>

            <b-input v-model="sessionId" maxlength="8" placeholder="Entrez votre clé de session"></b-input>

            <b-checkbox style="margin-top: 10px" v-model="rememberSession">Se souvenir de cette session</b-checkbox>
          </div>
          <div class="column text-center"><p class="subtitle">Pas encore de clé ?</p>
            <b-button
                label="Créer une nouvelle session"
                type="is-info is-light" :disabled="sessionId.length > 5"
                @click="createSession"/>
          </div>
        </div>
      </div>
      <div class="box">
        <div class="columns is-centered" style="width: 100%">
          <div class="column is-one-quarter" v-if="canCancel">
            <b-button type="is-danger is-light"
                      label="Fermer"
                      @click="$emit('close')"/>
          </div>
          <div class="column">
            <b-button label="Continuer" :disabled="!canContinue && sessionId.length <= 5"
                      type="is-info is-light"
                      @click="continueSession" expanded/>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "SessionModal",
  data() {
    return {
      sessionId: '',
      canContinue: false,
      rememberSession: false
    }
  },
  props: {
    canCancel: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    createSession() {

      this.$store.dispatch('createUser').then(() => {

      }).catch(() => {

      })

    },
    continueSession() {

    }
  }
}
</script>

<style scoped>
.text-center {
  text-align: center;
}
</style>