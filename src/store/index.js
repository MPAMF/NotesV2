import Vue from 'vue'
import Vuex from 'vuex'

import notes from './notes.module'
import courses from './courses.module'
import calendar from './calendar.module'
import settings from './settings.module'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        notes: notes,
        courses: courses,
        calendar: calendar,
        settings: settings
    }
})
