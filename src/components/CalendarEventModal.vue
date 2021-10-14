<template>
  <div class="modal-card" :class="{'dark-mode':isDarkMode}">
    <header class="modal-card-head" :style="{'background-color':eventData.backgroundColor+' !important'}">
      <p class="modal-card-title"><b>{{eventData.extendedProps.matiere}}</b></p>
      <button
          type="button"
          class="delete"
          @click="$emit('close')"/>
    </header>
    <section class="modal-card-body">
      <div class="box">
            <p class="subtitle">Type : {{eventData.extendedProps.type}}</p>
            <p class="subtitle">Coefficient : {{eventData.extendedProps.coeff}}%</p>
            <p class="subtitle">Date : {{eventData.extendedProps.date}}</p>
            <p class="subtitle">Heure : {{eventData.extendedProps.debut}} - {{eventData.extendedProps.fin}}</p>
            <p class="subtitle">Durée : {{eventData.extendedProps.duree}}</p>
            <p class="subtitle">Salle : {{eventData.extendedProps.salle}}</p>
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
.modal-card-title {
    color: white;
}
.modal-card-head .delete:hover {
    background-color: black !important;
}
.modal-card-body .box {
  box-shadow: none;
}
.modal-card-body button {
    color: white !important;
}
</style>