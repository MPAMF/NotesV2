<template>
  <div class="modal-card">
    <section class="modal-card-body">

      <div class="box">

        <div class="columns">
          <div class="column"><p class="subtitle">Entrez votre clé de session</p>


            <b-input v-model="sessionId" @keyup="forceUppercase" placeholder="Entrez votre clé de session"></b-input>

            <b-button
                label="Charger cette session"
                type="is-info is-light" :disabled="sessionId.length < 5"/>
          </div>
          <div class="column"><p class="subtitle">Ou en créer une nouvelle</p>
            <b-button
                label="Créer une nouvelle session"
                type="is-info is-light" :disabled="sessionId.length > 5"/>

          </div>

        </div>

      </div>

      <footer class="modal-card-foot">
        <div class="columns is-centered">
          <div class="column" v-if="canCancel">
            <b-button
                label="Fermer"
                @click="$emit('close')"/>
          </div>
          <div class="column">
            <b-checkbox>Se souvenir de cette session</b-checkbox>
          </div>
          <div class="column">
            <b-button label="Continuer" :disabled="!canContinue"
                      type="is-info is-light"
                      @click="$emit('close')" expanded/>
          </div>
        </div>


      </footer>

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
      selectedOption: 0
    }
  },
  props: {
    canCancel: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    forceUppercase() {
      console.log("test")
      this.sessionId = this.sessionId.toUpperCase()
    }
  }
}
</script>

<style scoped>

</style>