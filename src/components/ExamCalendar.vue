<template>
  <div>
    <FullCalendar :key="test" ref="fullCalendar" :options="calendarOptions"/>
  </div>

</template>

<script>

import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import emitter from 'tiny-emitter/instance'
import CalendarEventModal from "./CalendarEventModal";
import {mapGetters} from "vuex";


export default {
  name: 'ExamCalendar',
  components: {
    FullCalendar
  },
  computed: {
    ...mapGetters(['getExamDates', 'getSelectedTp', 'getNoteById', 'getLocalisation']),

    examDates: {
      get() {
        if (this.getSelectedTp == null)
          return []
        let exams = this.getExamDates(this.getSelectedTp.semester.number, this.getSelectedTp.id)
        let result = []

        for (const exam of exams) {
          let note = this.getNoteById(exam.note)
          let loc = this.getLocalisation(exam.localisation)
          if (note == null) continue
          let name = note.name + '(' + (note.coeff * 100) + ')'
          if (loc != null)
            name += ', ' + loc.name

          result.push({
            title: name,
            start: exam.start,
            end: exam.end,
            allDay: false,
            backgroundColor: '#D57417',
            borderColor: '#D57417',
            extendedProps: {
              coeff: note.coeff.toString(),
              salle: loc.name,
              duree: '00:45:00',
              type: 'CC1',
              matiere: note.course
            }
          })
        }

        return result
      }
    }
  },
  data() {
    return {
      test: 0,
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
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
        firstDay: 1,
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
                title: 'TP noté (25%), T03, Génie Logiciel',
                start: '2021-11-04T15:30:00',
                end: '2021-11-04T17:30:00',
                allDay: false,
                backgroundColor: 'red',
                borderColor: '',
                extendedProps: {
                  matiere: 'Génie Logiciel',
                  type: 'TP noté',
                  coeff: '25',
                  date: '04/11/2021',
                  debut: '15:30',
                  fin: '17:30',
                  duree: '00:45',
                  salle: 'T03'
                },
              },
              {
                title: 'CC1 (33%), GAM, Graphes',
                start: '2021-11-05T17:30:00',
                end: '2021-11-05T18:30:00',
                allDay: false,
                backgroundColor: '#D57417',
                borderColor: '#D57417',
                extendedProps: {
                  matiere: 'Graphes',
                  type: 'CC1',
                  coeff: '33',
                  duree: '00:45:00',
                  salle: 'GAM'
                },
              },
              {
                title: 'CC1 (33%), C9, IGCP',
                start: '2021-11-08T17:30:00',
                end: '2021-11-08T18:30:00',
                allDay: false,
                backgroundColor: '#1778D5',
                borderColor: '#1778D5',
                extendedProps: {
                  matiere: 'Graphes',
                  type: 'CC1',
                  coeff: '33',
                  duree: '00:45:00',
                  salle: 'GAM'
                },
              },
              {
                title: 'TP noté (40%), T02, Probabilités et Statistique 2',
                start: '2021-11-10T13:30:00',
                end: '2021-11-10T15:30:00',
                allDay: false,
                backgroundColor: '#D317D5',
                borderColor: '#D317D5',
                extendedProps: {
                  matiere: 'Graphes',
                  type: 'CC1',
                  coeff: '33',
                  duree: '00:45:00',
                  salle: 'GAM'
                },
              },
              {
                title: 'Dossier & Oral (70%), C9, Projet Professionnel Etudiant 2',
                start: '2021-11-10T17:30:00',
                end: '2021-11-10T19:30:00',
                allDay: false,
                backgroundColor: '#17D574',
                borderColor: '#17D574',
                extendedProps: {
                  matiere: 'Graphes',
                  type: 'CC1',
                  coeff: '33',
                  duree: '00:45:00',
                  salle: 'GAM'
                },
              },
              {
                title: 'CC2 (33%), GAM, Graphes',
                start: '2021-11-15T17:30:00',
                end: '2021-11-15T18:30:00',
                allDay: false,
                backgroundColor: '#D57417',
                borderColor: '#D57417',
                extendedProps: {
                  matiere: 'Graphes',
                  type: 'CC1',
                  coeff: '33',
                  duree: '00:45:00',
                  salle: 'GAM'
                },
              },
              {
                title: 'CC1 (40%), GAM, Algorithmes des Réseaux',
                start: '2021-11-16T17:30:00',
                end: '2021-11-16T18:30:00',
                allDay: false,
                backgroundColor: '#D51719',
                borderColor: '#D51719',
                extendedProps: {
                  matiere: 'Graphes',
                  type: 'CC1',
                  coeff: '33',
                  duree: '00:45:00',
                  salle: 'GAM'
                },
              },
              {
                title: 'TP noté (20%), T02, Architecture des Systèmes d\'Exploitation',
                start: '2021-11-17T17:30:00',
                end: '2021-11-17T19:30:00',
                allDay: false,
                backgroundColor: '#7417D5',
                borderColor: '#7417D5',
                extendedProps: {
                  matiere: 'Graphes',
                  type: 'CC1',
                  coeff: '33',
                  duree: '00:45:00',
                  salle: 'GAM'
                },
              },
              {
                title: 'CC1 (50%), GAM, Probabilités et Statistique 2',
                start: '2021-11-25T15:00:00',
                end: '2021-11-25T17:00:00',
                allDay: false,
                backgroundColor: '#D317D5',
                borderColor: '#D317D5',
                extendedProps: {
                  matiere: 'Graphes',
                  type: 'CC1',
                  coeff: '33',
                  duree: '00:45:00',
                  salle: 'GAM'
                },
              },
              {
                title: 'Projet (40%), T40, Algorithmes des Réseaux',
                start: '2021-11-29T17:30:00',
                end: '2021-11-29T19:30:00',
                allDay: false,
                backgroundColor: '#D51719',
                borderColor: '#D51719',
                extendedProps: {
                  matiere: 'Graphes',
                  type: 'CC1',
                  coeff: '33',
                  duree: '00:45:00',
                  salle: 'GAM'
                },
              },
            ],
          }
        ],
        eventClick: (info) => {
          this.loadModal(info.event);
        }
      }
    }
  },
  mounted() {
    emitter.on('update-calendar', () => {
      this.test = this.test ? 0 : 1

      console.log()
    })
  },
  methods: {
    loadModal(eventData) {
      this.$buefy.modal.open({
        parent: this,
        component: CalendarEventModal,
        hasModalCard: true,
        trapFocus: true,
        canCancel: true,
        props: {
          eventData: eventData
        }
      })
    },
  }
}
</script>

<style>

@media screen and (max-width: 768px) {
  .fc .fc-toolbar {
    flex-direction: column;
  }

  .fc .fc-toolbar-title {
    padding: 0.5rem;
  }

  .fc .fc-daygrid-week-number {
    top: unset;
    bottom: 0;
  }
}

</style>