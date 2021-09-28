<template>
  <div class="card">
    <div :style="{'background-color':course.color,'border':course.color+' 4px solid'}" class="card-content"
         style="padding: 0; border-radius: 10px">
      <section class="hero" style="">
        <div class="hero-body">
          <div class="columns">
            <div class="column is-9" style="user-select: none">
              <p class="title is-size-5-mobile" style="color: white">
                {{ course.name }}
              </p>
              <p class="subtitle is-size-6-mobile" style="color: white">
                {{ course.ects }} ECTS
              </p>
            </div>
            <div class="column is-3">
              <div class="box">
                <h1 :style="{ 'color' : avgColor}" class="title is-unselectable is-size-5-mobile">{{
                    avgNote.toFixed(2)
                  }} /
                  20</h1>
              </div>
            </div>
          </div>
        </div>
        <div class="has-text-centered" style="height:0">
          <button class="button is-white collapse-button" @click="open = !open">
            <b-icon :icon="!open ? 'chevron-down-circle-outline' : 'chevron-up-circle-outline'"
                    size="is-medium"></b-icon>
          </button>
        </div>
      </section>
      <b-collapse :open="open" animation="slide">
        <div class="content box">
          <div class="columns is-multiline">
            <note v-for="(note, index) in course.notes" :key="index" :course="course" :note="note"
                  @update-avg="calculateAvg"></note>
          </div>
        </div>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import Note from "./Note";
import {mapGetters} from "vuex";

export default {
  name: 'Course',
  components: {Note},

  props: {
    course: {}
  },

  data() {
    return {
      open: false,
      avgColor: 'orange',
      avgNote: 10.0
    }
  },

  mounted() {
    this.calculateAvg()
  },

  computed: {
    ...mapGetters(['getNote', 'getNoteStatus']),
  },

  methods: {
    calculateAvg() {
      let avg = 0.0
      let coeffTotal = 0.0

      this.course.notes.forEach(value => {
        if (value.multiple) {
          let multipleAvg = 0.0
          let count = 0
          value.notes.forEach(val => {
            if (!this.getNoteStatus(this.course.id, val.id)) return
            let foundNote = this.getNote(this.course.id, val.id)
            multipleAvg += ((foundNote < 0 ? val.denominator / 2 : foundNote) * 20.0) / val.denominator
            count++
          })
          avg += count === 0 ? 0 : ((multipleAvg / count) * value.coeff)
          coeffTotal += value.coeff
        } else {
          if (!this.getNoteStatus(this.course.id, value.id)) return
          let note = this.getNote(this.course.id, value.id)
          avg += (note < 0 ? 10 : note) * value.coeff
          coeffTotal += value.coeff
        }
      })

      this.avgNote = avg / coeffTotal

      // set average color
      this.avgColor = Math.round(this.avgNote) < 10 ? 'red' : (Math.round(this.avgNote) < 14) ? 'orange' : 'green';

      // emit main avg update event
      this.$emit('update-main-avg', {
        courseId: this.course.id,
        avg: avg / coeffTotal,
        coeff: this.course.ects
      })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.collapse-button {
  top: -18px;
  border-radius: 50%;
}
</style>
