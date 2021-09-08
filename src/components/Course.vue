<template>
  <div class="card">
    <div class="card-content" style="padding: 0;">
      <section class="hero is-primary">
        <div class="hero-body">
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
      </section>

      <div class="content box" style="border: 4px solid #7957d5; border-radius: 0">
        <div class="columns is-multiline">
          <note v-for="(note, index) in course.notes" :note="note" :key="index"
                :user-note="{note: 17, id: 'qsdqsdqsd'}"></note>
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
