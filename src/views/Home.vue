<template>
  <div>

    <div class="container">
      <course v-for="(course, index) in getCourses" :key="index" :course="course" style="margin-bottom: 5vh"></course>
    </div>

    <div class="container box" style="position: sticky; bottom:0">
      <h1 class="title">Moyenne générale: 20/20</h1>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src

import Course from "../components/Course";
import {mapGetters} from "vuex";

export default {
  name: 'Home',
  components: {
    Course
  },
  computed: {
    ...mapGetters(['getCourses'])
  }
}
</script>
