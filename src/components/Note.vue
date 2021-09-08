<template>
  <div class="column">
    <h1 style="user-select: none; color: #7957d5; font-size: 24px">{{note.name}} <b style="font-size: 20px">({{note.coeff}}%)</b></h1>
    <vue-numeric class="input" v-bind:precision="2"
                 v-model="test"
                 v-bind:min="0"
                 v-bind:max="20"
    ></vue-numeric>
  </div>
</template>

<script>
import VueNumeric from 'vue-numeric'

export default {
  name: "Note",
  components: {
    VueNumeric
  },
  props: {
    note: {},
    userNote: {}
  },
  data() {
    return {
      test: 17
    }
  }
}
</script>

<style scoped>
input[type="tel"]
{
  font-size:20px;
  text-align: center;
  font-family: Karla, sans-serif;
}
</style>