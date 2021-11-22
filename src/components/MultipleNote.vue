<template>
  <div class="column is-one-quarter">
    <b-field :label="note.name">
      <p class="control has-icons-left has-icons-right">
        <span class="icon is-left is-clickable" style="height: 100%" @click="activated = !activated">
            <i :class="activated ? 'mdi-close' : 'mdi-check'" class="mdi mdi-24px"
               style="color: #714dd2"></i>

        </span>
        <vue-numeric v-model.lazy="userNote" :disabled="!getCanEdit || !activated"
                     class="input"
                     v-bind:max="note.denominator"
                     v-bind:min="0"
                     v-bind:precision="2"
                     @change="updateNote"
        ></vue-numeric>
        <span :style="{'color': (activated ? '#714dd2' : '#7a7a7a')}" class="icon is-small is-right">
                <b :style="{'font-weight': (activated ? 'bold' : 'normal')}"
                   class="is-primary">{{ ' / ' + note.denominator }}</b>
        </span>
      </p>
    </b-field>
  </div>
</template>

<script>
import VueNumeric from 'vue-numeric'
import {mapGetters} from "vuex"
import emitter from 'tiny-emitter/instance'

export default {
  name: "MultipleNote",
  components: {
    VueNumeric
  },

  props: {
    note: {},
    course: {}
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
          courseId: this.course.id,
          type: 1
        })
        this.$emit('update-avg')
      }
    },
  },

  methods: {
    updateNote() {
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

    updateLocalNote() {
      let foundNote = this.getNote(this.course.id, this.note.id)
      this.localNote = foundNote < 0 ? this.note.denominator / 2 : foundNote
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

</style>
