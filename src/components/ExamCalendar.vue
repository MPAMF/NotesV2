<template>
  <FullCalendar :key="test" ref="fullCalendar" :options="calendarOptions"/>
</template>

<script>

import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import CalendarEventModal from "./CalendarEventModal";
import {mapGetters} from "vuex";
import emitter from 'tiny-emitter/instance'

export default {
  name: 'ExamCalendar',
  components: {
    FullCalendar
  },
  computed: {
    ...mapGetters(['getSelectedDegree', 'getSelectedSemester', 'getExamDates', 'getRealNote', 'getLocalisation', 'getCourseByNote', 'isDarkMode', 'getCalendarEvents']),

    examDates: {
      get() {
        let degree = this.getSelectedDegree
        let semester = this.getSelectedSemester
        let exams = this.getExamDates(degree, semester)
        let result = []

        for (const exam of exams) {
          let note = this.getRealNote(degree, semester, true, exam.note)
          let loc = this.getLocalisation(exam.localisation)
          if (note == null) continue
          let course = this.getCourseByNote(note.id)
          let coeff = Math.round(note.coeff * 100)
          let name = note.name + ' (' + coeff + '%)'
          if (loc != null)
            name += ', ' + loc.name
          let acronyme = course == null ? 'Not Set' : course.acronym
          let matiere = course == null ? 'Non définie' : course.name
          name += ', ' + acronyme
          let color = this.isDarkMode ? course.dark_color : course.color
          let startDate = new Date(exam.start)

          result.push({
            title: name,
            start: exam.start,
            end: exam.end,
            allDay: false,
            backgroundColor: color,
            borderColor: color,
            extendedProps: {
              calendarType: 'exams',
              coeff: coeff.toString(),
              salle: loc.name,
              duree: this.calculateDuration(exam.start, exam.end),
              type: note.name,
              matiere: matiere,
              acronym: acronyme,
              date: startDate.toLocaleDateString('fr-FR'),
              debut: startDate.toLocaleTimeString('fr-FR')
            }
          })
        }
        return result
      }
    },
    calendarEvents: {
      get() {
        return this.getCalendarEvents
      }
    }
  },
  data() {
    return {
      test: 0,
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
        locale: 'fr',
        initialView: 'timeGridWeek',
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
        contentHeight: 'auto',
        fixedWeekCount: false,
        nowIndicator: true,
        slotMinTime: "07:00:00",
        // slotMinTime: "08:00:00",
        // slotMaxTime: "21:30:00",
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
          { // Exam dates
            events: []
          },
          { // Calendar
            events: []
          },
        ],
        eventClick: (info) => {
          this.loadModal(info.event);
        }
      }
    }
  },
  watch: {
    examDates: {
      // eslint-disable-next-line no-unused-vars
      handler(val, oldVal) {
        this.calendarOptions.eventSources[0].events = val
      }
    },
    calendarEvents: {
      // eslint-disable-next-line no-unused-vars
      handler(val, oldVal) {
        this.calendarOptions.eventSources[1].events = val
      }
    }
  },
  mounted() {
    emitter.on('update-calendar', () => {
      this.test = this.test === 0 ? 1 : 0
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
    calculateDuration(d1, d2) {
      let date1 = new Date(d1)
      let date2 = new Date(d2)
      let difference = date2.getTime() - date1.getTime();

      let hoursDifference = Math.floor(difference / 1000 / 60 / 60);
      difference -= hoursDifference * 1000 * 60 * 60

      let minutesDifference = Math.floor(difference / 1000 / 60);
      difference -= minutesDifference * 1000 * 60

      let secondsDifference = Math.floor(difference / 1000);

      hoursDifference = (hoursDifference < 9 ? '0' : '') + hoursDifference.toString()
      minutesDifference = (minutesDifference < 9 ? '0' : '') + minutesDifference.toString()
      secondsDifference = (secondsDifference < 9 ? '0' : '') + secondsDifference.toString()

      return hoursDifference + ':' + minutesDifference + ':' + secondsDifference
    }
  }
}
</script>

<style>

.modal {
  z-index: 10000 !important;
}

.fc-event-main-frame {
  flex-direction: column;
}

/*
@media screen and (min-height: 1300px) {
  table {
    height: 1000px !important;
  }
}

@media screen and (min-height: 1129px) {
  table {
    height: 875px !important;
  }
} */

@media screen and (min-width: 768px) {
  .fc-daygrid-event .fc-event {
    height: 50% !important;
  }
}

@media screen and (max-width: 768px) {
  .fc .fc-toolbar {
    flex-direction: column;
    font-size: 0.75em;
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