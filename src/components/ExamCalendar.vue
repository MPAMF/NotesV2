<template>
  <div>
    <FullCalendar :options="calendarOptions"/>
  </div>
  
</template>

<script>

import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';


export default {
  name: 'ExamCalendar',
  components: {
    FullCalendar
  },
  data() {
    return {
      calendarOptions: {
        plugins: [ dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin ],
        locale: 'fr',
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        buttonText: {
          today: 'Aujourd\'hui',
          month: 'Mois',
          week: 'Semaine',
          day: 'Jour',
          list: 'Liste'
        },
        contentHeight: 800,
        fixedWeekCount: false,
        nowIndicator: true,
        slotMinTime: "08:00:00",
        slotMaxTime: "21:30:00",
        allDaySlot: false,
        navLinks: true,
        // weekends: false,
        weekNumbers: true,
        weekText: 'S.',
        weekNumberFormat: {
          week: 'short'
        },
        eventColor: '#7957d5',
        eventTextColor: 'white',
        eventTimeFormat: {
          hour: 'numeric',
          minute: '2-digit',
          meridiem: false
        },
        displayEventTime: true,
        displayEventEnd: true,
        eventOrder: 'start',
        eventDisplay: 'block',
        progressiveEventRendering: false,
        forceEventDuration: true,
        dayMaxEventRows: 2,
        eventSources: [
          {
            events: [ 
              {
                title  : 'TP noté (25%), T03, Génie Logiciel',
                start  : '2021-11-04T15:30:00',
                end    : '2021-11-04T17:30:00',
                allDay : false,
                backgroundColor: '',
                borderColor: ''
              },
              {
                title  : 'CC1 (33%), GAM, Graphes',
                start  : '2021-11-05T17:30:00',
                end    : '2021-11-05T18:30:00',
                allDay : false,
                backgroundColor: '#D57417',
                borderColor: '#D57417'
              },
              {
                title  : 'CC1 (33%), C9, IGCP',
                start  : '2021-11-08T17:30:00',
                end    : '2021-11-08T18:30:00',
                allDay : false,
                backgroundColor: '#1778D5',
                borderColor: '#1778D5'
              },
              {
                title  : 'TP noté (40%), T02, Probabilités et Statistique 2',
                start  : '2021-11-10T13:30:00',
                end    : '2021-11-10T15:30:00',
                allDay : false,
                backgroundColor: '#D317D5',
                borderColor: '#D317D5'
              },
              {
                title  : 'Dossier & Oral (70%), C9, Projet Professionnel Etudiant 2',
                start  : '2021-11-10T17:30:00',
                end    : '2021-11-10T19:30:00',
                allDay : false,
                backgroundColor: '#17D574',
                borderColor: '#17D574'
              },
              {
                title  : 'CC2 (33%), GAM, Graphes',
                start  : '2021-11-15T17:30:00',
                end    : '2021-11-15T18:30:00',
                allDay : false,
                backgroundColor: '#D57417',
                borderColor: '#D57417'
              },
              {
                title  : 'CC1 (40%), GAM, Algorithmes des Réseaux',
                start  : '2021-11-16T17:30:00',
                end    : '2021-11-16T18:30:00',
                allDay : false,
                backgroundColor: '#D51719',
                borderColor: '#D51719'
              },
              {
                title  : 'TP noté (20%), T02, Architecture des Systèmes d\'Exploitation',
                start  : '2021-11-17T17:30:00',
                end    : '2021-11-17T19:30:00',
                allDay : false,
                backgroundColor: '#7417D5',
                borderColor: '#7417D5'
              },
              {
                title  : 'CC1 (50%), GAM, Probabilités et Statistique 2',
                start  : '2021-11-25T15:00:00',
                end    : '2021-11-25T17:00:00',
                allDay : false,
                backgroundColor: '#D317D5',
                borderColor: '#D317D5'
              },
              {
                title  : 'Projet (40%), T40, Algorithmes des Réseaux',
                start  : '2021-11-29T17:30:00',
                end    : '2021-11-29T19:30:00',
                allDay : false,
                backgroundColor: '#D51719',
                borderColor: '#D51719'
              },
            ],
          }
        ]
      }
    }
  }
}
</script>

<style>

</style>