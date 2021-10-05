<template>
  <div class="container">

    <div class="box">
      <div class="container" style="width: 80%">
        <h1 class="subtitle">Votre session actuelle est : <b>{{ getSessionId }}</b></h1>

        <hr class="rounded">

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
                         :deselectLabel="''" :options="tpGroups" :searchable="false" :selectLabel="''" label="name"
                         track-by="name"></multiselect>
          </div>
          <div class="column">
            <h1 class="subtitle">Choisir ses options</h1>

            <multiselect v-model="value" :deselectLabel="''" :disabled="selectedTp === null" :multiple="true"
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
    return {
      selectedTp: null,
      tpGroups: [
        {
          name: 'S5 TD1 TP1',
        },
        {
          name: 'S5 TD1 TP2',
        },
        {
          name: 'S5 TD1 TP3',
        },
        {
          name: 'S5 TD1 TP4',
        }
      ],
      semesters: [
        {
          name: 'Semestre 5',
          nb: 5
        },
        {
          name: 'Semestre 6',
          nb: 6
        }
      ],
      selectedSemester: {
        name: 'Semestre 5',
        nb: 5
      },
      /*options: {
        'Semester 5': [
          {
            name: 'Option bla s5',
            uuid: 'odokqdopkkpdqsdopkqdopkqs'
          },
          {
            name: 'Option bla blo bli 22 s5',
            uuid: 'ssdlqldqsdmp'
          }
        ],
        'Semester 6': [
          {
            name: 'Option dfposfsd s6',
            uuid: 'odokqdopkkpdqsdopkqdopkqs'
          },
          {
            name: 'Option 3333 S66666 bli 22',
            uuid: 'ssdlqldqsdmp'
          }
        ]
      },*/
      value: []
    }
  },
  computed: {
    ...mapGetters(['getSessionId', 'isDarkMode', 'getOptionalCourses']),
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
    },
    courseOptions: {
      get() {
        return this.getOptionalCourses(this.selectedSemester.nb)
      },
    },
    courseValues: {
      get() {
        return this.getSelectedCourses(this.selectedSemester.nb)
      },
      set(value) {
        this.$store.commit('setSelectedCourses', {
          semester: this.selectedSemester,
          courses: value
        })
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
      this.$store.dispatch('editCourseOption', {
        course: selectedOption,
        select: true
      })
    },

    removeOption(removedOption) {
      this.$store.dispatch('editCourseOption', {
        course: removedOption,
        select: false
      })
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