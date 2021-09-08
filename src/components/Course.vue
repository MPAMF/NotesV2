<template>
  <div class="card">
    <div class="card-content" style="background-color: #7957d5; padding: 0; border: 4px solid #7957d5; border-radius: 10px">
      <section class="hero is-primary" style="">
        <div class="hero-body" >
          <div class="columns">
            <div class="column is-9" style="user-select: none;">
              <p class="title">
                {{ course.name }}
              </p>
              <p class="subtitle">
                {{ course.ects }} ECTS
              </p>
            </div>
            <div class="column is-3">
              <div class="box">
                <h1 class="title" style="user-select: none; color: darkolivegreen">{{ '19.69 / 20' }}</h1>
              </div>
            </div>
          </div>
        </div>
        <div class="has-text-centered" style="height:0">
          <button class="button is-white" style="top:-18px; border-radius:50%; border:solid 1px black;" @click="open = !open" v-if="!open">
            <b-icon icon="arrow-drop-down-circle" size="is-small"></b-icon>
            <!-- <i class="fa-solid fa-circle-caret-down"></i> -->
            <!-- <i class="fa-solid fa-circle-caret-up"></i> -->
          </button>
        </div>
      </section>

      <!-- <b-button @click="row.toggleDetails" >
        <b-icon :icon="row.detailsShowing ? 'chevron-up-circle' : 'chevron-down-circle'"></b-icon> 
        Details
      </b-button> -->

        <b-collapse  animation="slide" class="content box">
          <div class="columns is-multiline">
            <note v-for="(note, index) in course.notes" :note="note" :key="index"
                  :user-note="{note: 17, id: 'qsdqsdqsd'}"></note>
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
  data(){
    return {
      open: false,
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
