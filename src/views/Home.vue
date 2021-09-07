<template>
  <div class="container">

    <course v-for="(course, index) in getCourses" :key="index" :course="course"></course>

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
