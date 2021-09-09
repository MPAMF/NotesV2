<template>
  <div class="card">
    <div class="card-content" :style="{'background-color':course.color,'border':course.color+' 4px solid'}"
         style="padding: 0; border-radius: 10px">
      <section class="hero" style="">
        <div class="hero-body">
          <div class="columns">
            <div class="column is-9" style="user-select: none">
              <p class="title" style="color: white">
                {{ course.name }}
              </p>
              <p class="subtitle" style="color: white">
                {{ course.ects }} ECTS
              </p>
            </div>
            <div class="column is-3">
              <div class="box">
                <h1 class="title is-unselectable" :style="{ 'color' : avgColor}">{{ avgNote.toFixed(2) }} /
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
      <b-collapse animation="slide" :open="open">
        <div class="content box">
          <div class="columns is-multiline">
            <note v-for="(note, index) in course.notes" :note="note" :key="index" :course="course"
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
    ...mapGetters(['getNote']),
  },

  methods: {
    calculateAvg() {
      let avg = 0.0

      this.course.notes.forEach(value => {
        if (value.length > 0) {
          let multipleAvg = 0.0
          value.notes.forEach(val => multipleAvg += (this.getNote(this.course.id, val.id) * 20.0) / val.denominator)
          avg += multipleAvg * value.coeff
        } else {
          avg += this.getNote(this.course.id, value.id) * value.coeff
        }
      })

      this.avgNote = avg

      // set average color
      this.avgColor = this.avgNote < 10 ? 'red' : (this.avgNote < 14) ? 'orange' : 'green';

      // emit main avg update event
      this.$emit('update-main-avg', {
        courseId: this.course.id,
        avg: avg,
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
