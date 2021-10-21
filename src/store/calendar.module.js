import axios from "axios";
import ICAL from "ical.js"

const state = {
    events: []
}
const mutations = {
    // eslint-disable-next-line no-unused-vars
    processEvent(state, {event, eventSummary, type, course, darkMode}) {
        let location = event.location || ''

        let idxLoc = location.indexOf('(')
        if (idxLoc !== -1)
            location = location.substr(0, idxLoc - 1)

        if(location === 'Grand Amphi de Maths-Frenkel')
            location = 'GAM'

        if(location === 'Petit Amphi de Maths')
            location = 'PAM'

        let startDate = event.startDate.toJSDate()
        let endDate = event.endDate.toJSDate()
        let color = ''

        if (course == null) {
            color = "#" + ((1 << 24) * Math.random() | 0).toString(16)
        } else {
            color = darkMode ? course.dark_color : course.color
        }

        let acronym = course != null ? course.acronym : eventSummary

        state.events.push({
            title: acronym + ', ' + location,
            start: startDate,
            end: endDate,
            allDay: false,
            backgroundColor: color,
            borderColor: color,
            extendedProps: {
                calendarType: 'calendar',
                salle: location,
                duree: '',//this.calculateDuration(startDate, endDate),
                type: type,
                matiere: eventSummary,
                acronym: acronym,
                date: startDate.toLocaleDateString('fr-FR'),
                debut: startDate.toLocaleTimeString('fr-FR')
            }
        })
    }
}
const actions = {
    fetchCalendar({commit, rootGetters}, url) {
        commit('startFetching', 'fetchCalendar')
        return new Promise(((resolve, reject) => axios.get(url).then(({data}) => {
            let jcalData = ICAL.parse(data)
            let comp = new ICAL.Component(jcalData);

            for (const component of comp.getAllSubcomponents()) {
                let event = new ICAL.Event(component);
                let eventSummary = event.summary
                if (eventSummary.includes('CONTROLE'))
                    continue

                let type = eventSummary.includes('TD') ? 'TD' : (eventSummary.includes('TP') ? 'TP' : 'CM')
                let idxSummary = eventSummary.indexOf(' ' + type)
                if (idxSummary !== -1)
                    eventSummary = eventSummary.substr(0, idxSummary)

                let course = rootGetters['getCourseByName'](eventSummary)

                commit('processEvent', {
                    event: event,
                    type: type,
                    eventSummary: eventSummary,
                    course: course,
                    darkMode: rootGetters['isDarkMode']
                })
            }

            resolve()
        }).catch(error => {
            reject(error)
        }).finally(() => commit('stopFetching', 'fetchCalendar'))))
    },
}
const getters = {
    getCalendarEvents: state => state.events
}

export default {
    state,
    mutations,
    actions,
    getters
}