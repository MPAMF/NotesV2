<template>
  <div class="container">

    <div class="box">
      <div class="container" style="width: 80%">

        <div>
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
            <b-icon key="2" icon="cloud-check" size="is-medium"></b-icon>
          </div>

          <h1 class="subtitle">Votre session actuelle est : <b>{{ getSessionId }}</b></h1>
        </div>

        <br>

        <div class="columns">
          <div class="column is-second-quarter">
            <b-button icon-left="reload" size="is-medium" @click="loadSession">Charger une autre session</b-button>
          </div>
          <div class="column is-third-quarter">
            <b-button disabled icon-left="download" size="is-medium">Télécharger vos données</b-button>
          </div>
        </div>

        <hr class="rounded">

        <div class="columns">
          <div class="column is-one-quarter">
            <h1 class="subtitle">Choisir son groupe de TP</h1>

            <multiselect v-model="selectedTp" :allow-empty="true" :close-on-select="true"
                         :deselectLabel="''" :options="getAllGroups" :searchable="false" :selectLabel="''" label="name"
                         track-by="name"></multiselect>
          </div>
          <div class="column">
            <h1 class="subtitle">Choisir ses options</h1>

            <multiselect v-model="courseValues" :deselectLabel="''" :disabled="selectedTp == null" :multiple="true"
                         :options="courseOptions" :selectLabel="''" label="name"
                         placeholder="Choisissez un ou plusieurs cours" track-by="name" @remove="removeOption"
                         @select="selectOption"><span
                slot="noResult">Aucune option trouvé avec cette recherche.</span>
            </multiselect>
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
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import SessionModal from "./SessionModal";
import Multiselect from 'vue-multiselect'

export default {
  name: "Parameters",
  components: {Multiselect},
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['getSessionId', 'isDarkMode', 'getSelectedCoursesConverted',
      'getOptionalCourses', 'getAllGroups', 'getRunnable', 'getSelectedTp']),
    darkMode: {
      get() {
        return this.isDarkMode
      },
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
    },
    courseOptions: {
      get() {
        return this.selectedTp == null ? [] : this.getOptionalCourses(this.selectedTp.semester.number)
      },
    },
    courseValues: {
      get() {
        return this.selectedTp == null ? [] : this.getSelectedCoursesConverted(this.selectedTp.semester.number)
      },
      // eslint-disable-next-line no-unused-vars
      set(value) {
      }
    },
    selectedTp: {
      get() {
        return this.getSelectedTp
      },
      set(value) {
        this.$store.dispatch('editSession', {
          obj: value,
          type: 1
        })
        this.$store.commit('setSelectedTp', value)
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

    selectOption(selectedOption) {
      this.$store.dispatch('editSession', {
        obj: {
          id: selectedOption.id,
          activated: true
        },
        type: 2
      })
      this.$store.commit('addSelectedCourse', {
        selectedCourse: selectedOption,
        semester: this.selectedTp.semester.number
      })
    },

    removeOption(removedOption) {
      this.$store.dispatch('editSession', {
        obj: {
          id: removedOption.id,
          activated: false
        },
        type: 2
      })
      this.$store.commit('removeSelectedCourse', removedOption)
    }
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style scoped>
b-button:first-of-type {
  margin-right: 1rem;
}

b-button:last-of-type {
  margin-left: 1rem;
}

/* Rounded border */
hr.rounded {
  margin-top: 2.5rem;
  border-top: 2px solid #bbb;
  margin-bottom: 2.5rem;
}
</style>