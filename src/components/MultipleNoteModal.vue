<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title"><b>Examen à notes multiples: {{ avg.toFixed(2) + '/20' }}</b></p>
      <button
          type="button"
          class="delete"
          @click="$emit('close')"/>
    </header>
    <section class="modal-card-body">
      <div class="columns is-multiline is-centered">
        <multiple-note @update-avg="updateAvg" v-for="(note, index) in note.notes" :key="index" :note="note"
                       :course="course"></multiple-note>
      </div>
    </section>
    <footer class="modal-card-foot">
      <b-button type="is-primary"
                label="OK"
                @click="$emit('close')" expanded/>
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
    ...mapGetters(['getNote', 'getNoteStatus'])
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