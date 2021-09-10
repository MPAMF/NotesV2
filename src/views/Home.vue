<template>
  <div>

    <div class="container">

      <h1 class="title is-size-5-mobile" style="margin-top: 20px">Gestion Notes - L3 Informatique</h1>

      <b-tabs type="is-boxed" v-model="activeTab" position="is-centered" size="is-medium">
        <b-tab-item icon="numeric-5-box-multiple-outline" label="Semestre 5">
          <course v-for="(course, index) in getCourses" :key="index" :course="course" style="margin-bottom: 5vh"
                  @update-main-avg="updateAvg"></course>
        </b-tab-item>

        <b-tab-item icon="numeric-6-box-multiple-outline" label="Semestre 6" disabled>
          Pouet pouet
        </b-tab-item>

        <b-tab-item icon="cog-outline" label="Paramètres">
          <parameters></parameters>
        </b-tab-item>
      </b-tabs>

    </div>

    <div v-if="activeTab === 0" class="box"
         style="background: #232B32; position: sticky; bottom:0; border-radius: 8px 8px 0 0; border: solid 3px black; border-bottom: none; width: 100%;">
      <h1 class="title is-size-5-mobile" style="color: white">Moyenne générale : {{ avg.toFixed(2) }} / 20</h1>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src

import Course from "../components/Course";
import {mapGetters} from "vuex";
import Parameters from "../components/Parameters";
import SessionModal from "../components/SessionModal";

export default {
  name: 'Home',
  components: {
    Parameters,
    Course
  },

  computed: {
    ...mapGetters(['getCourses'])
  },

  data() {
    return {
      avg: 0.0,
      notes: {},
      activeTab: 0,
    }
  },

  methods: {
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
    }
  },

  created() {

    let sessionId = localStorage.getItem('session_id')
    if (sessionId === null) {
      this.displayDialog()
      return
    }

    this.$store.commit('startFetching')

    this.$store.dispatch('fetchData').then(() => {
      this.$store.dispatch('fetchUserData', sessionId).then(() => {
        this.$store.commit('stopFetching')
      }).catch(() => {
        console.log("user not existing")
      })
    })

  }
}
</script>