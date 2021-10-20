<template>
  <div class="modal-card" :class="{'dark-mode':isDarkMode}">
    <header class="modal-card-head" :style="{'background-color':eventData.backgroundColor+' !important'}">
      <!-- <p class="modal-card-title"><b>{{eventData.extendedProps.matiere}}</b></p> -->
      <p class="modal-card-title"><b>{{eventData.extendedProps.acronym}}, {{eventData.extendedProps.type}}</b></p>
      <button
          type="button"
          class="delete"
          @click="$emit('close')"/>
    </header>
    <section class="modal-card-body">
      <div class="box">
            <p class="subtitle">{{eventData.extendedProps.matiere}}</p>
            <p class="subtitle">Examen : {{eventData.extendedProps.type}} ({{eventData.extendedProps.coeff}}%)</p>
            <p class="subtitle">Date : {{eventData.extendedProps.date}}, {{eventData.extendedProps.debut}}</p>
            <p class="subtitle">Salle : {{eventData.extendedProps.salle}}</p>
            <p class="subtitle">Durée : {{eventData.extendedProps.duree}}</p>
      </div>
      <div class="box">
            <b-button label="OK" @click="$emit('close')" :style="{'background-color':eventData.backgroundColor+' !important'}" expanded/>
      </div>
    </section>
  </div>
</template>

<script>
import {mapGetters} from "vuex"

export default {
  name: "CalendarEventModal",
  data() {
    return {
    }
  },
  props: {
    eventData: {},
    canCancel: {
      default: false,
      type: Boolean
    }
  },
  computed: {
    ...mapGetters(['isDarkMode'])
  }
}
</script>

<style scoped>
.box {
  text-align: center
}
.modal-card {
  width: auto;
}
.modal-card-title {
    color: white;
}
.modal-card-head .delete:hover {
    background-color: black !important;
}
.modal-card-body .box {
  box-shadow: none;
}
.modal-card-body .box:first-of-type {
    margin: 0;
}
.modal-card-body button {
    color: white !important;
}

@media screen and (min-width: 768px) {
  .modal-card {
    min-width: 400px;
  }
}
</style>