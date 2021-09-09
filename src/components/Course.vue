<template>
  <div class="card">
    <div class="card-content" :style="{'background-color':course.color,'border':course.color+' 4px solid'}"
         style="padding: 0; border-radius: 10px">
      <section class="hero" style="">
        <div class="hero-body">
          <div class="columns">
            <div class="column is-9" style="user-select: none;">
              <p class="title" style="color: white;">
                {{ course.name }}
              </p>
              <p class="subtitle" style="color: white;">
                {{ course.ects }} ECTS
              </p>
            </div>
            <div class="column is-3">
              <div class="box">
                <h1 class="title is-unselectable" :style="{ 'color' : getAvgColor()}">{{ calculateAvg.toFixed(2) }} /
                  20</h1>
              </div>
            </div>
          </div>
        </div>
        <div class="has-text-centered" style="height:0">
          <button class="button is-white collapse-button" @click="open = !open">
            <b-icon :icon="!open ? 'chevron-down-circle-outline' : 'chevron-up-circle-outline'"
                    size="is-medium"></b-icon>

            <!-- <i class="fa-solid fa-circle-caret-down"></i> -->
            <!-- <i class="fa-solid fa-circle-caret-up"></i> -->
          </button>
        </div>
      </section>

      <!-- <b-button @click="row.toggleDetails" >
        <b-icon :icon="row.detailsShowing ? 'chevron-up-circle' : 'chevron-down-circle'"></b-icon> 
        Details
      </b-button> -->

      <b-collapse animation="slide" :open="open">
        <div class="content box">
          <div class="columns is-multiline">
            <note v-for="(note, index) in course.notes" :note="note" :key="index"
                  :user-note="{note: 17, id: 'qsdqsdqsd'}" :color="course.color"></note>
          </div>
        </div>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import Note from "./Note";

export default {
  name: 'Course',
  components: {Note},
  props: {
    course: {}
  },
  data() {
    return {
      open: false
    }
  },
  computed: {
    calculateAvg: {
      get() {
        let avg = 0.0;

        for (const [key, value] of Object.entries(this.course.notes)) {
          console.log(`${key}: ${value}`);
        }

        return avg;
      }
    }
  },
  methods: {
    getAvgColor() {
      return 'darkolivegreen';
    }
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
