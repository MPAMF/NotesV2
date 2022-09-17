<template>
  <div class="column">
    <h1 :style="{'color':course.color}">
      {{ note.name }} <b
        style="font-size: 20px">({{
        (note.coeff * 100).toFixed(0)
      }}%)</b>
      <b-tooltip v-if="examDate.length > 0" :label="examDate">
        <b-icon
            custom-size="mdi-18px"
            icon="information-outline"
            type="is-primary">
        </b-icon>
      </b-tooltip>
    </h1>
    <button v-if="note.multiple" v-bind:class="{ noteDisabled: isDisabled }" class="input custom-button" @click="openDialog">
      <p class="custom-button">{{ localNote.toFixed(2) }}</p>
    </button>

    <p v-else class="control has-icons-left">
                <span class="icon is-left is-clickable" style="height: 100%" @click="activated = !activated">
                        <b-tooltip :label="(activated ? 'Désactiver' : 'Activer') + ' la note'"
                                   position="is-bottom"
                                   type="is-dark">
            <i :class="activated ? 'mdi-close' : 'mdi-check'" class="mdi mdi-24px"
               style="color: #714dd2"></i>
      </b-tooltip>
        </span>

      <vue-numeric v-model.lazy="userNote" :disabled="!getCanEdit || !activated"
                   class="input"
                   v-bind:max="20"
                   v-bind:min="0"
                   v-bind:precision="2"
                   @change="updateNote"
      ></vue-numeric>
    </p>
  </div>
</template>

<script>
import VueNumeric from 'vue-numeric'
import {mapGetters} from "vuex"
import MultipleNote from "./MultipleNoteModal"
import emitter from 'tiny-emitter/instance'

export default {
  name: "Note",
  components: {
    VueNumeric
  },

  props: {
    course: {},
    note: {},
  },

  data() {
    return {
      localNote: -1,
      localActivated: true,
      examDate: '',
      testFirst: true,
      isDisabled: false,
    }
  },

  computed: {
    ...mapGetters(['getNote', 'getCanEdit', 'getNoteStatus', 'getExamDates', 'getSelectedSemester', 'getLocalisation']),
    activated: {
      get() {
        return this.localActivated
      },
      set(value) {
        this.localActivated = value

        this.$store.commit('setNoteStatus', {
          note: {
            id: this.note.id,
            activated: value
          },
          courseId: this.course.id
        })

        this.updateNote()
        this.$emit('update-avg')
      }
    },
    userNote: {
      get() {
        return this.localNote
      },
      set(value) {
        this.localNote = value

        if(this.testFirst)
        {
          this.testFirst = false
          return
        }

        this.$store.commit('setNote', {
          note: {
            id: this.note.id,
            value: value
          },
          courseId: this.course.id,
          type: 1
        })
        this.$emit("update-avg")
      }
    },
  },

  methods: {
    openDialog() {
      this.$buefy.modal.open({
        parent: this,
        component: MultipleNote,
        hasModalCard: true,
        trapFocus: true,
        canCancel: true,
        onCancel: () => this.updateLocalNote(),
        props: {
          note: this.note,
          course: this.course
        },
        events: {
          close: () => this.updateLocalNote()
        }
      })
    },

    checkDisableNote()
    {
      if(this.note.multiple) {
        let check = true
        this.note.notes.forEach(val => {
          if (this.getNoteStatus(this.course.id, val.id) == true)
            check = false
        })
        if (check)
          this.isDisabled = true
        else
          this.isDisabled = false
      }
    },

    updateLocalNote() {
      if (this.note.multiple) {
        let avg = 0.0
        let count = 0
        this.note.notes.forEach(val => {
          let foundNote = this.getNote(this.course.id, val.id)
          if (!this.getNoteStatus(this.course.id, val.id)) return
          avg += ((foundNote < 0 ? val.denominator / 2 : foundNote) * 20.0) / val.denominator
          count++
        })
        this.localNote = count === 0 ? 0 : avg / count
        this.checkDisableNote()
        return
      }
      let note = this.getNote(this.course.id, this.note.id)
      this.localNote = note < 0 ? 10 : note
    },

    updateNote() {
      if (this.note.multiple) return

      this.$store.dispatch('editSession', {
        obj: {
          id: this.note.id,
          value: this.localNote,
          activated: this.activated,
          courseId: this.course.id
        },
        type: 0
      })
    },

    updateNoteStatus() {
      this.localActivated = this.getNoteStatus(this.course.id, this.note.id)
    },

    updateExamDate() {
      if (this.getSelectedSemester == null) {
        this.examDate = ''
        return
      }

      // TODO : getSelectedTp unused
      // let examDates = this.getExamDates(this.getSelectedTp.semester.number, this.getSelectedTp.id)
      let examDates = this.getExamDates(null, null)
      let foundDate = examDates.find(date => date.note === this.note.id)

      if (foundDate == null) {
        this.examDate = ''
        return
      }

      let location = this.getLocalisation(foundDate.localisation)
      const options = {hour: '2-digit', minute: '2-digit'}
      let startDate = new Date(foundDate.start)
      let newDate = startDate.toLocaleDateString() + ', '
      newDate += startDate.toLocaleTimeString('fr-FR', options).replace(':', 'h') + ' à '
      newDate += new Date(foundDate.end).toLocaleTimeString('fr-FR', options).replace(':', 'h') + ', '
      newDate += location == null ? 'Non défini' : location.name
      this.examDate = newDate
    }
  },

  beforeMount() {
    this.updateNoteStatus()
    this.updateLocalNote()
    this.updateExamDate()
  },

  mounted() {

    emitter.on('notes-loaded', () => {
      this.updateNoteStatus()
      this.updateLocalNote()
      this.updateExamDate()
    })

  }

}
</script>

<style scoped>
input[type="tel"] {
  font-size: 20px;
  text-align: center;
  font-family: Karla, sans-serif;
}

.custom-button {
  font-size: 20px;
  text-align: center;
  font-family: Karla, sans-serif;
  vertical-align: middle;
  margin: auto;
  cursor: pointer;
}

.content .columns h1 {
  user-select: none;
  font-size: 24px;
}

.control.has-icons-left input {
  padding: 0;
}

.noteDisabled {
  background:#c4c4c4 !important;
  color: rgba(16, 16, 16, 0.3) !important;
  border: solid 1px black !important;
}

@media screen and (max-width: 768px) {
  .content h1 {
    margin-bottom: 0.25em !important;
  }

  .content .columns .column {
    padding-bottom: 0;
  }

  .content .columns h1 {
    font-size: 20px;
  }

  .custom-button, input[type="tel"] {
    font-size: 16px;
  }
}
</style>