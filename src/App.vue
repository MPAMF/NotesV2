<template>
  <div id="app">
    <b-loading :is-full-page="true" :active="isFetching" :can-cancel="false"></b-loading>

      <h1 class="title" style="margin-top: 20px">Notes de L3</h1>
    <router-view/>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  computed: {
    ...mapGetters(['isFetching']),
  }
}
</script>


<style>

#app {
  font-family: Karla, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  box-sizing: border-box;
}
</style>
