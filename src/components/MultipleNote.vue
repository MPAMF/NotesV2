<template>
  <div class="column is-one-quarter">
    <b-field :label="note.name">
      <p class="control has-icons-left has-icons-right">
        <span class="icon is-left is-clickable" @click="activated = !activated" style="height: 100%">
            <i class="mdi mdi-24px" :class="activated ? 'mdi-close' : 'mdi-check'"
               style="color: #714dd2"></i>

        </span>
        <vue-numeric class="input" v-bind:precision="2"
                     v-bind:min="0"
                     v-bind:max="note.denominator"
                     v-model.lazy="userNote"
                     :disabled="!getCanEdit || !activated"
                     @change="updateNote"
        ></vue-numeric>
        <span class="icon is-small is-right" :style="{'color': (activated ? '#714dd2' : '#7a7a7a')}">
                <b class="is-primary"
                   :style="{'font-weight': (activated ? 'bold' : 'normal')}">{{ ' / ' + note.denominator }}</b>
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
          courseId: this.course.id
        })
        this.$emit('update-avg')
      }
    },
  },

  methods: {
    updateNote() {
      this.$store.dispatch('editNote', {
        note: {
          id: this.note.id,
          value: this.localNote,
          activated: this.activated
        },
        courseId: this.course.id
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
