<template>
  <div :class="{'dark-mode':isDarkMode}" class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title"><b>{{ note.name }} : {{ avg.toFixed(2) + '/20' }}</b></p>
      <button
          class="delete"
          type="button"
          @click="$emit('close')"/>
    </header>
    <section class="modal-card-body">
      <div class="columns is-multiline is-centered">
        <multiple-note v-for="(note, index) in note.notes" :key="index" :course="course" :note="note"
                       @update-avg="updateAvg"></multiple-note>
      </div>
    </section>
    <footer class="modal-card-foot">
      <b-button expanded
                label="OK"
                type="is-primary" @click="$emit('close')"/>
    </footer>
  </div>
</template>

<script>
import MultipleNote from "./MultipleNote";
import {mapGetters} from "vuex";

export default {
  name: "MultipleNoteModal",
  data() {
    return {
      avg: 0.0
    }
  },
  props: {
    note: {},
    course: {}
  },

  components: {
    MultipleNote,
  },

  computed: {
    ...mapGetters(['getNote', 'getNoteStatus', 'isDarkMode'])
  },

  methods: {
    updateAvg() {
      let avg = 0.0
      let count = 0
      this.note.notes.forEach(val => {
        let foundNote = this.getNote(this.course.id, val.id)
        if (!this.getNoteStatus(this.course.id, val.id)) return
        avg += ((foundNote < 0 ? val.denominator / 2 : foundNote) * 20.0) / val.denominator
        count++
      })
      this.avg = count === 0 ? 0 : avg / count
    }
  },

  beforeMount() {
    this.updateAvg()
  },

}
</script>

<style scoped>
input[type="tel"] {
  font-family: Karla, sans-serif;
}
</style>