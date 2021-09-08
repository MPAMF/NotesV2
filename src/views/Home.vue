<template>
  <div>

    <div class="container">
      <course v-for="(course, index) in getCourses" :key="index" :course="course" style="margin-bottom: 5vh"></course>
    </div>

    <div class="box" style="background: #232B32; position: sticky; bottom:0; border-radius: 8px 8px 0 0; border: solid 3px black; border-bottom: none; width: 100%;">
      <h1 class="title" style="color: white">Moyenne générale : 20/20</h1>
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
