<template>
  <div class="modal-card" :class="{'dark-mode':isDarkMode}">
    <header class="modal-card-head">
      <p class="modal-card-title"><b>Charger une autre session</b></p>
      <button
          type="button"
          class="delete"
          @click="$emit('close')"/>
    </header>
    <section class="modal-card-body">

      <div class="box">

        <div class="columns is-centered">
          <div class="column text-center"><p class="subtitle">Déjà une session ?</p>


            <b-field type="is-success" message="Copiez votre clé de session crée ci-dessus" v-if="created">
              <b-input v-model="sessionId" maxlength="8" placeholder="Entrez votre clé de session"
                       :disabled="created"></b-input>
            </b-field>

            <b-input v-model="sessionId" maxlength="8" placeholder="Saisissez votre clé ici" v-else></b-input>

            <b-checkbox style="margin-top: -10px" v-model="rememberSession">Se souvenir de cette session</b-checkbox>
          </div>
          <div class="column text-center"><p class="subtitle">Pas encore de clé ?</p>
            <b-button class="main-button"
                label="Créer une nouvelle session"
                :disabled="created || sessionId.length > 5"
                @click="createSession"/>
          </div>
        </div>
      </div>
      <div class="box">
            <b-button class="main-button" label="Continuer" :disabled="!created && sessionId.length <= 5"
                      @click="continueSession" expanded/>
      </div>
    </section>
  </div>
</template>

<script>
import {mapGetters} from "vuex"
import emitter from 'tiny-emitter/instance'

export default {
  name: "SessionModal",
  data() {
    return {
      sessionId: '',
      rememberSession: false,
      created: false
    }
  },
  props: {
    canCancel: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    ...mapGetters(['getSessionId', 'isDarkMode'])
  },
  methods: {
    createSession() {
      this.$store.dispatch('createSession').then(() => {
        this.created = true
        this.sessionId = this.getSessionId
      }).catch(e => {
        this.openToast(`Une erreur est survenue: <b>${e}</b>`)
      })
    },
    continueSession() {

      if (!this.sessionId || this.sessionId.length !== 8) {
        this.openToast('Veuillez entrer une clé de session')
        return
      }

      this.$store.commit('setSessionId', this.sessionId)
      this.$store.commit('clearNotes')

      this.$store.dispatch('loadSession').then(() => {
        if (this.rememberSession) this.$store.commit('saveSessionId')
        emitter.emit('notes-loaded')
        this.$emit('close')
      }).catch(e => {
        this.openToast(`Une erreur est survenue: <b>${e}</b>`)
      })

    },
    openToast(message) {
      this.$buefy.toast.open({
        duration: 5000,
        message: message,
        type: 'is-danger'
      })
    }
  }
}
</script>

<style scoped>
.text-center {
  text-align: center;
}

.modal-card-body .box {
  box-shadow: none;
}

</style>