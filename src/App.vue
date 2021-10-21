<template>
  <div id="app" :class="{'dark-mode':isDarkMode}">
    <b-loading :active="isFetching" :can-cancel="false" :is-full-page="true"></b-loading>
    <router-view/>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  computed: {
    ...mapGetters(['isFetching', 'isDarkMode']),
  },

  beforeCreate() {
    this.$store.dispatch('loadDarkMode').then(() => {
      const el = document.documentElement

      if (this.isDarkMode) {
        el.classList.add('dark-mode-background')
      } else {
        el.classList.remove('dark-mode-background')
      }
    })
  },

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
}

.box button.main-button span {
  color: white !important;
}

.box button.main-button {
  border-color: #7957d5 !important;
  background: #7957d5;
}

.box button.scd-button span {
  color: white !important;
}

.box button.scd-button {
  border: solid 1px #7957d5;
  background-color: #DBD0FB;
}

.dark-mode #app {
  background-color: #141d26;
}

.dark-mode-background {
  background-color: #141d26;
  color: white;
  min-height: 100%;
  height: 100%;
}

.dark-mode .title, .dark-mode .subtitle {
  color: white !important;
}

hr {
  height: 1px;
  background-image: linear-gradient(to left, #ccc, #232b32, #ccc);
}

.dark-mode hr {
  background-image: linear-gradient(to left, #232b32, #ccc, #232b32);
}

/* cloud icon */

.sk-circle span i {
  color: #7957d5 !important;
}

.average .sk-circle span i, .dark-mode .sk-circle span i {
  color: #BCA8EA !important;
}

/* modals */

.modal-card-body .button.is-fullwidth:hover:enabled, .main-button:hover:enabled {
  opacity: 0.8 !important;
}

/* tabs */

.dark-mode .tabs.is-boxed li.is-active a, .dark-mode .b-tabs .tabs.is-boxed li a:focus {
  background: linear-gradient(#232b32, #141d26);
}

.dark-mode .tabs.is-boxed li.is-active span {
  color: #CCBDF6;
}

.dark-mode .tabs.is-boxed a:hover {
  background-color: #232b32;
}

.dark-mode .tabs.is-boxed a {
  border-bottom: none !important;
  color: white;
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

.dark-mode .switch span.control-label {
  color: white;
}

/* popup parameters */

.modal-card-body .box input:not(:placeholder-shown) {
  text-transform: uppercase !important;
  color: #7957d5;
}

.dark-mode .box small.counter {
  color: white;
}

.dark-mode .modal-card-body {
  background-color: #232b32 !important;
}

.dark-mode .modal-card-body input::placeholder {
  color: #54585B !important;
}

/* course */

.dark-mode .hero-body .box {
  border-color: #141d26;
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

.dark-mode .card h1 span i {
  color: #CCBDF6 !important;
  margin-left: 0.5rem;
}

.dark-mode .card h1 {
  color: white !important;
}

.dark-mode .card .collapse-content button {
  background-color: white;
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

.dark-mode .modal-card-head, .dark-mode .modal-card-foot {
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

/* calendar */

.fc-toolbar-title, .fc-col-header-cell-cushion {
  color: #2C3E50;
  text-transform: capitalize;
}

.fc-col-header-cell-cushion:hover {
  text-decoration: underline;
}

.fc-daygrid-day-number {
  color: black !important;
}

.fc-day-today, .fc-day-disabled {
  background-color: #D8EAFD !important;
}

.fc-daygrid-week-number {
  background-color: inherit !important;
  color: #7957d5 !important;
}

a.fc-daygrid-more-link:hover {
  text-decoration: underline;
}

.fc-list-table .fc-list-day-cushion {
  background-color: #EBEBEB !important;
}

.fc-list-table .fc-list-day-cushion a {
  color: #2C3E50;
}

.fc-list-table .fc-list-day-cushion a:first-of-type {
  text-transform: capitalize;
}

/* DARKMODE calendar */

.dark-mode .fc-toolbar-title, .dark-mode .fc-col-header-cell-cushion {
  color: white;
}

.dark-mode .fc-col-header-cell-cushion {
  color: #BCE8F1;
}

.dark-mode .fc-daygrid-day-number, .dark-mode .fc-button-group button span, .dark-mode .fc-list-empty {
  color: white !important;
}

.dark-mode table, .dark-mode td, .dark-mode th {
  border-color: #232b32 !important;
}

.dark-mode .fc-day-today {
  background-color: #2C3E50 !important;
}

.dark-mode .fc-daygrid-week-number {
  background-color: inherit !important;
  color: #CCBDF6 !important;
}

.dark-mode .fc-list-empty, .dark-mode .fc-popover-header {
  background-color: #232b32 !important;
  color: white !important;
}

.dark-mode .fc-popover-body {
  background-color: #2C3E50 !important;
}

.dark-mode a.fc-daygrid-more-link {
  color: white !important;
}

.dark-mode .fc-list-table .fc-list-day-cushion {
  background-color: #141d26 !important;
  border-bottom: solid 1px #141d26;
}

.dark-mode .fc-list-table .fc-list-day-cushion a {
  color: white;
}

.dark-mode .fc-list .fc-scroller {
  background-color: #232b32 !important;
}

.dark-mode .fc-list-event .fc-list-event-time, .dark-mode .fc-list-event a {
  color: white !important;
}

.dark-mode .fc-list-event:hover .fc-list-event-time, .dark-mode .fc-list-event:hover .fc-list-event-title, .dark-mode .fc-list-event:hover .fc-list-event-graphic {
  background-color: #2C3E50 !important;
}

</style>
