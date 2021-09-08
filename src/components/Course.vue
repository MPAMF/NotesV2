<template>
  <div class="card">
    <div class="card-content">
      <p class="title">
        {{course.name}}
      </p>
      <p class="subtitle">
        {{course.prof}}
      </p>

      <div class="content">
        <div class="columns is-multiline">
          <note v-for="(note, index) in course.notes" :note="note" :key="index"></note>
        </div>
      </div>
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
