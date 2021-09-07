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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Course',
  props: {
    course: []
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
