<template>
  <div class="column">
    <h1 :style="{'color':course.color}" style="user-select: none; font-size: 24px">{{ note.name }} <b
        style="font-size: 20px">({{
        (note.coeff * 100).toFixed(0)
      }}%)</b>
    </h1>
    <vue-numeric class="input" v-bind:precision="2"
                 v-model.lazy="userNote"
                 v-bind:min="0"
                 v-bind:max="20"
    ></vue-numeric>
  </div>
</template>

<script>
import VueNumeric from 'vue-numeric'
import {mapGetters} from "vuex";

export default {
  name: "Note",
  components: {
    VueNumeric
  },
  props: {
    course: {},
    note: {},
  },
  computed: {
    ...mapGetters(['getNote']),
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
        this.$emit("update-avg")
      }
    }
  },
  beforeMount() {
    this.localNote = this.getNote(this.course.id, this.note.id)
  },
  data() {
    return {
      localNote: -1
    }
  }
}
</script>

<style scoped>
input[type="tel"] {
  font-size: 20px;
  text-align: center;
  font-family: Karla, sans-serif;
}
</style>