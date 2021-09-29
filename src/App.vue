<template>
  <div id="app" class="dark-mode">
    <b-loading :is-full-page="true" :active="isFetching" :can-cancel="false"></b-loading>
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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  height: 100%;
  /* test */
  background-color: #141d26;
  color: white;
}

.dark-mode .title, .dark-mode span {
  color: white !important;
}

.dark-mode .tabs.is-boxed li.is-active a, .dark-mode .b-tabs .tabs.is-boxed li a:focus {
  /* background: #2c3e50;
  background: #232b32; */
  /* background: #141d26; */
  background: linear-gradient(#232b32, #141d26);
  /* border-bottom-color: transparent !important; */
}

/* selectionner quand pas active */
.tabs.is-boxed a:hover {
  background-color: #2D353d !important;
  border-bottom: solid 1px #dbdbdb;
  border-bottom-right-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}

.tabs.is-boxed a {
  border-bottom: none !important;
}

/* .dark-mode .tabs.is-boxed a {
  border-bottom: none;
} */

/* .dark-mode .b-tabs .tabs.is-boxed li:hover a span {
  color: black !important;
}  */

</style>
