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
            <b-icon key="2" :size="size" icon="cloud-check"></b-icon>
          </div>

          <h1 class="subtitle">Votre session actuelle est : <b>{{ getSessionId }}</b></h1>
        </div>

        <br>

        <div class="columns">
          <div class="column">
            <b-button class="main-button" icon-left="reload" size="is-medium" @click="loadSession">Charger une autre
              session
            </b-button>
          </div>
          <div class="column">
            <b-button disabled icon-left="download" size="is-medium">Télécharger vos données</b-button>
          </div>
        </div>

        <hr>

        <div class="columns">
          <div class="column is-one-quarter">
            <h1 class="subtitle">Groupe de TP</h1>

            <multiselect v-model="selectedTp" :allow-empty="true" :close-on-select="true"
                         :deselectLabel="''" :options="getAllGroups" :searchable="false" :selectLabel="''" label="name"
                         track-by="name"></multiselect>
          </div>
          <div class="column">
            <h1 class="subtitle">Sélection des options</h1>

            <multiselect v-model="courseValues" :deselectLabel="''" :disabled="selectedTp == null" :multiple="true"
                         :options="courseOptions" :selectLabel="''" label="name"
                         placeholder="Sélectionnez vos cours" track-by="name" @remove="removeOption"
                         @select="selectOption"><span
                slot="noResult">Aucune option trouvée lors de cette recherche.</span>
            </multiselect>
          </div>
        </div>

        <hr>

        <div class="columns">
          <div class="column">
            <h1 class="subtitle">URL du planning</h1>
            <b-field :message="urlErrorMessage" :type="urlErrorMessage.length > 0 ? 'is-danger' : ''">
              <b-input v-model="planningUrl" maxlength="128" placeholder="Insérez votre URL d'emploi du temps"
                       type="url">
              </b-input>
            </b-field>
          </div>
          <div class="column is-one-quarter">
            <h1 class="subtitle">Affichage du planning</h1>
            <b-field>
              <b-switch
                  v-model="displayFullPlanning"
                  :disabled="planningUrl == null || planningUrl.length === 0"
                  passive-type='is-dark'>
                Complet
              </b-switch>
            </b-field>
          </div>
        </div>

        <hr>

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
      size: 'is-medium',
      windowWidth: window.innerWidth,
      regexUrl: '^https:\\/\\/monemploidutemps.unistra.fr\\/api\\/calendar\\/[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}\\/export$',
      urlErrorMessage: ''
    }
  },
  computed: {
    ...mapGetters(['getSessionId', 'isDarkMode', 'getSelectedCoursesConverted',
      'getOptionalCourses', 'getAllGroups', 'getRunnable', 'getSelectedTp', 'getPlanningUrl',
      'isDisplayingFullPlanning']),
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
    },
    planningUrl: {
      get() {
        return this.getPlanningUrl
      },
      set(value) {

        if (value.length === 0) {
          this.urlErrorMessage = ''
          return
        }

        if (!value.match(this.regexUrl)) {
          this.urlErrorMessage = 'L\'url doit être du format: https://monemploidutemps.unistra.fr/api/calendar/[uuid]/export'
          return
        }

        this.urlErrorMessage = ''

        this.$store.dispatch('editSession', {
          obj: value,
          type: 3
        })
        this.$store.commit('setPlanningUrl', value)
        this.$store.dispatch('fetchCalendar', value)
      }
    },
    displayFullPlanning: {
      get() {
        return this.isDisplayingFullPlanning
      },
      set(value) {
        this.$store.commit('setDisplayingFullPlanning', value)
        if (value) {
          this.$store.dispatch('fetchCalendar', this.planningUrl)
          return
        }
        this.$store.commit('clearCalendarEvents')
      }
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
    onResize() {
      this.windowWidth = window.innerWidth
      if (this.windowWidth <= 768) this.size = 'null'
      else this.size = 'is-medium'
    },
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

<style scoped type="text/scss">
b-button:first-of-type {
  margin-right: 1rem;
}

b-button:last-of-type {
  margin-left: 1rem;
}

.columns button {
  white-space: normal;
}

@media screen and (max-width: 979px) {
  .columns button {
    padding: 2rem;
  }
}

@media screen and (max-width: 850px) {
  .columns button {
    padding: 2rem;
  }
}

@media screen and (max-width: 768px) {
  .columns button {
    padding: 1rem;
  }
}

@media screen and (max-width: 430px) {
  .columns button {
    padding: 2rem;
  }
}
</style>

<style>
.multiselect__option--highlight, .multiselect__tag {
  background: #7957d5 !important;
}

.multiselect__tag-icon:after {
  color: white !important;
}

.multiselect__tag-icon:hover, .multiselect__tag-icon:focus {
  background: #5E36C9 !important;
}
</style>