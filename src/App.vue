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

/* global */

#app {
  font-family: Karla, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  box-sizing: border-box;
  /* height: 100% !important; */
  background-color: #141d26;
}

html, body {
  background-color: #141d26;
  color: white;
  min-height: 100;
  height: 100%;
}

.dark-mode .title, .dark-mode .subtitle{
  color: white !important;
}

/* tabs */

.dark-mode .tabs.is-boxed li.is-active a, .dark-mode .b-tabs .tabs.is-boxed li a:focus {
  background: linear-gradient(#232b32, #141d26);
}

.dark-mode .tabs.is-boxed a:hover {
  background-color: #232b32;
}

.dark-mode .tabs.is-boxed a {
  border-bottom: none !important;
}

.dark-mode .tabs li.is-active a {
  color: white;
}


/* parameters */

.dark-mode .box {
  background-color: #232b32;
}

.dark-mode .column .box {
  border: solid 1px white;
}

.dark-mode button span {
  color: #7957d5 !important;
}

.dark-mode .box button {
  border: solid 1px #7957d5;
}

.dark-mode label span {
  color: white !important;
}

/* popup parameters */

.dark-mode .modal-card-body {
  background-color: #232b32 !important;
}

.dark-mode .modal-card-body .box {
  box-shadow: none;
}

.dark-mode .modal-card-body input::placeholder {
  color: #54585B !important;
}

/* notes */

.dark-mode .card {
  background-color: #141d26;
}

.dark-mode .card button, .dark-mode .card button:hover {
  background-color: #232b32;
}

.dark-mode .card span {
  color: white !important;
}

.dark-mode .card h1 {
  color: white !important;
}

.dark-mode .card .collapse-content button {
  background-color: white;
}

/* notes multiple*/

.dark-mode .modal-card-head, .dark-mode .modal-card-foot{
  background-color: #232b32 !important;
}

.dark-mode .modal-card-title, .dark-mode .modal-card-body label,
  .dark-mode .modal-card-foot button span {
  color: white !important;
}

.dark-mode .modal-card-foot {
  border-top: none;
}



.dark-mode .modal-card-head .delete:hover {
  background-color: #7957d5 !important;
}


</style>
