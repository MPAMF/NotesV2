<template>
  <div>

    <div class="container">

      <h1 class="title is-size-5-mobile" style="padding-top: 20px">Gestion Notes - UFR Maths Info</h1>

      <b-tabs v-if="getSemesters.length > 0" v-model="activeTab" :size="size" position="is-centered" type="is-boxed">

        <b-tab-item icon="school" label="Notes" v-if="hasSelectedSemester">

        </b-tab-item>

        <b-tab-item icon="school" label="Notes" v-else>
          <div class="container">
            <h1 class="subtitle">Veuillez selectionner un <a @click="redirectToParameters()">semestre</a>.</h1>
          </div>
        </b-tab-item>

        <b-tab-item icon="calendar-month" label="Planning">
          <exam-calendar></exam-calendar>
        </b-tab-item>

        <b-tab-item icon="cog" label="Paramètres">
          <parameters></parameters>
        </b-tab-item>
      </b-tabs>

    </div>

    <div v-if="activeTab === 1" class="average box">
      <h1 class="title is-size-5-mobile" style="color: white;display:inline-block;">Moyenne générale : {{
          avg.toFixed(2)
        }} / 20</h1>
      <div v-if="getRunnable >= 0" key="1" class="sk-circle">
        <div class="sk-circle1 sk-child"></div>
        <div class="sk-circle2 sk-child"></div>
        <div class="sk-circle3 sk-child"></div>
        <div class="sk-circle4 sk-child"></div>
        <div class="sk-circle5 sk-child"></div>
        <div class="sk-circle6 sk-child"></div>
        <div class="sk-circle7 sk-child"></div>
        <div class="sk-circle8 sk-child"></div>
        <div class="sk-circle9 sk-child"></div>
        <div class="sk-circle10 sk-child"></div>
        <div class="sk-circle11 sk-child"></div>
        <div class="sk-circle12 sk-child"></div>
      </div>

      <div v-else class="sk-circle">
        <b-icon key="2" :size="size" icon="cloud-check"></b-icon>
      </div>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src

import {mapGetters} from "vuex";
import Parameters from "../components/Parameters";
import SessionModal from "../components/SessionModal";
import emitter from 'tiny-emitter/instance'
import ExamCalendar from '../components/ExamCalendar.vue';

export default {
  name: 'Home',
  components: {
    Parameters,
    ExamCalendar
  },

  computed: {
    ...mapGetters(['getRunnable', 'getSemesters', 'getSelectedAndRequiredCourses',
      'getPlanningUrl', 'hasSelectedSemester'])
  },

  data() {
    return {
      avg: 0.0,
      notes: {},
      activeTab: 0,
      size: 'is-medium',
      windowWidth: window.innerWidth,
    }
  },

  watch: {
    activeTab: (newActiveTab) => {
      if (newActiveTab !== 1) return
      setTimeout(() => emitter.emit('update-calendar'), 100)
    }
  },

  beforeMount() {
    this.onResize();
  },

  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    })
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },

  methods: {

    redirectToParameters() {
      this.$data.activeTab = 3
    },

    onResize() {
      this.windowWidth = window.innerWidth
      if (this.windowWidth <= 768) this.size = 'null'
      else this.size = 'is-medium'
    },

    updateAvg({courseId, coeff, avg}) {
      this.notes[courseId] = {coeff: coeff, avg: avg}
      this.calculateAvg()
    },

    calculateAvg() {
      let average = 0.0
      let coeff = 0.0

      Object.keys(this.notes).forEach(key => {
        let note = this.notes[key]
        average += note.coeff * note.avg
        coeff += note.coeff
      })

      this.avg = average / coeff
    },

    displayDialog() {
      this.$buefy.modal.open({
        parent: this,
        component: SessionModal,
        hasModalCard: true,
        trapFocus: true,
        canCancel: false
      })
    },

    sessionSuccessfullyLoaded(sessionId) {
      emitter.emit('notes-loaded')
      this.$buefy.toast.open({
        duration: 2000,
        message: `Votre session ${sessionId} a bien été chargée.`,
        type: 'is-success'
      })
    }
  },

  created() {
    let sessionId = localStorage.getItem('session_id')
    this.$store.commit('setSessionId', sessionId)

    this.$store.commit('startFetching', 'homeCreated')

    this.$store.dispatch('fetchData').then(() => {

      if (sessionId === null) {
        this.$store.commit('stopFetching', 'homeCreated')
        this.displayDialog()
        return
      }

      this.$store.dispatch('loadSession').then(() => {

        let url = this.getPlanningUrl
        let displayFullPlanning = localStorage.getItem('displayFullPlanning')
        let status = displayFullPlanning != null && displayFullPlanning === 'false'

        if (url == null || url.length === 0 || status) {
          this.$store.commit('setDisplayingFullPlanning', false)
          this.sessionSuccessfullyLoaded(sessionId)
          return
        }

        this.$store.dispatch('fetchCalendar', url).catch((e) => {
          this.$buefy.toast.open({
            duration: 2000,
            message: `Impossible de charger le calendrier`,
            type: 'is-danger'
          })
          console.log(e)
        }).finally(() => this.sessionSuccessfullyLoaded(sessionId))

      }).catch((e) => {
        console.log(e)
        this.$buefy.toast.open({
          duration: 5000,
          message: `La session enregistrée localement n'existe pas.`,
          type: 'is-danger'
        })
      })
    }).finally(() => this.$store.commit('stopFetching', 'homeCreated'))
  }
}
</script>


<style>

.average.box {
  border-radius: 8px 8px 0 0 !important;
}

.average {
  background: #232B32 !important;
  position: sticky;
  bottom: 0;
  border-radius: 8px 8px 0 0;
  border-top: solid 3px #141d26;
  width: 100%;
  padding-bottom: 0 !important;
  z-index: 5;
}

.sk-circle {
  width: 40px;
  height: 40px;
  color: white;
  float: right;
  position: relative;
  display: flex;
  align-items: center;
}

.sk-circle .sk-child {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

.sk-circle .sk-child:before {
  content: '';
  display: block;
  margin: 0 auto;
  width: 15%;
  height: 15%;
  background-color: #fff;
  border-radius: 100%;
  -webkit-animation: sk-circleBounceDelay 1.2s infinite ease-in-out both;
  animation: sk-circleBounceDelay 1.2s infinite ease-in-out both;
}

.sk-circle .sk-circle2 {
  -webkit-transform: rotate(30deg);
  -ms-transform: rotate(30deg);
  transform: rotate(30deg);
}

.sk-circle .sk-circle3 {
  -webkit-transform: rotate(60deg);
  -ms-transform: rotate(60deg);
  transform: rotate(60deg);
}

.sk-circle .sk-circle4 {
  -webkit-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  transform: rotate(90deg);
}

.sk-circle .sk-circle5 {
  -webkit-transform: rotate(120deg);
  -ms-transform: rotate(120deg);
  transform: rotate(120deg);
}

.sk-circle .sk-circle6 {
  -webkit-transform: rotate(150deg);
  -ms-transform: rotate(150deg);
  transform: rotate(150deg);
}

.sk-circle .sk-circle7 {
  -webkit-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}

.sk-circle .sk-circle8 {
  -webkit-transform: rotate(210deg);
  -ms-transform: rotate(210deg);
  transform: rotate(210deg);
}

.sk-circle .sk-circle9 {
  -webkit-transform: rotate(240deg);
  -ms-transform: rotate(240deg);
  transform: rotate(240deg);
}

.sk-circle .sk-circle10 {
  -webkit-transform: rotate(270deg);
  -ms-transform: rotate(270deg);
  transform: rotate(270deg);
}

.sk-circle .sk-circle11 {
  -webkit-transform: rotate(300deg);
  -ms-transform: rotate(300deg);
  transform: rotate(300deg);
}

.sk-circle .sk-circle12 {
  -webkit-transform: rotate(330deg);
  -ms-transform: rotate(330deg);
  transform: rotate(330deg);
}

.sk-circle .sk-circle2:before {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.sk-circle .sk-circle3:before {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

.sk-circle .sk-circle4:before {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.sk-circle .sk-circle5:before {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

.sk-circle .sk-circle6:before {
  -webkit-animation-delay: -0.7s;
  animation-delay: -0.7s;
}

.sk-circle .sk-circle7:before {
  -webkit-animation-delay: -0.6s;
  animation-delay: -0.6s;
}

.sk-circle .sk-circle8:before {
  -webkit-animation-delay: -0.5s;
  animation-delay: -0.5s;
}

.sk-circle .sk-circle9:before {
  -webkit-animation-delay: -0.4s;
  animation-delay: -0.4s;
}

.sk-circle .sk-circle10:before {
  -webkit-animation-delay: -0.3s;
  animation-delay: -0.3s;
}

.sk-circle .sk-circle11:before {
  -webkit-animation-delay: -0.2s;
  animation-delay: -0.2s;
}

.sk-circle .sk-circle12:before {
  -webkit-animation-delay: -0.1s;
  animation-delay: -0.1s;
}

@-webkit-keyframes sk-circleBounceDelay {
  0%, 80%, 100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

@keyframes sk-circleBounceDelay {
  0%, 80%, 100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}

@media screen and (max-width: 768px) {
  .sk-circle {
    width: 20px;
    height: 20px;
  }
}

/* @media screen and (max-width: 768px) {
  .tabs.is-medium a{
    font-size: 1rem !important;
  }
  .tabs .icon.is-medium {
  }
  .mdi-36px {
    font-size: 12px;
  }
  .mdi.mdi-36px { font-size: 48px;color: red !important; }
} */
</style>