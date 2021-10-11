<template>
  <div class="column">
    <h1 :style="{'color':course.color}" style="user-select: none; font-size: 24px">{{ note.name }} <b
        style="font-size: 20px">({{
        (note.coeff * 100).toFixed(0)
      }}%)</b>
    </h1>
    <button v-if="note.multiple" class="input custom-button" @click="openDialog">
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
      localActivated: true
    }
  },

  computed: {
    ...mapGetters(['getNote', 'getCanEdit', 'getNoteStatus']),
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
        this.$store.commit('setNote', {
          note: {
            id: this.note.id,
            value: value
          },
          courseId: this.course.id
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
        canCancel: false,
        props: {
          note: this.note,
          course: this.course
        },
        events: {
          close: () => this.updateLocalNote()
        }
      })
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
        this.userNote = count === 0 ? 0 : avg / count
        return
      }
      let note = this.getNote(this.course.id, this.note.id)
      this.userNote = note < 0 ? 10 : note
    },

    updateNote() {
      if (this.note.multiple) return

      this.$store.dispatch('editSession', {
        obj: {
          note: {
            id: this.note.id,
            value: this.localNote,
            activated: this.activated
          },
          courseId: this.course.id
        },

        type: 0

      })
    },

    updateNoteStatus() {
      this.localActivated = this.getNoteStatus(this.course.id, this.note.id)
    }
  },

  beforeMount() {
    this.updateNoteStatus()
    this.updateLocalNote()
  },

  mounted() {
    emitter.on('notes-loaded', () => {
      this.updateNoteStatus()
      this.updateLocalNote()
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
</style>