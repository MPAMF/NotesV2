<template>
  <div class="column is-one-quarter">
    <b-field :label="note.name">
      <p class="control has-icons-right">
        <vue-numeric class="input" v-bind:precision="2"
                     v-bind:min="0"
                     v-bind:max="note.denominator"
                     v-model.lazy="userNote"
                     :disabled="!getCanEdit"
        ></vue-numeric>
        <span class="icon is-small is-right" style="color: #714dd2">
                <b class="is-primary">{{ ' / ' + note.denominator }}</b>
              </span>
      </p>
    </b-field>
  </div>
</template>

<script>
import VueNumeric from 'vue-numeric'
import {mapGetters} from "vuex";

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
      localNote: -1
    }
  },

  computed: {
    ...mapGetters(['getNote', 'getCanEdit']),
    userNote: {
      get() {
        return this.localNote
      },
      set(value) {
        this.localNote = value
        this.$store.dispatch('setNote', {
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

  beforeMount() {
    let foundNote = this.getNote(this.course.id, this.note.id)
    this.localNote = foundNote < 0 ? this.note.denominator / 2 : foundNote
  },
}
</script>

<style scoped>

</style>