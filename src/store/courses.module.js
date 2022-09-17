import axios from "axios";

const state = {
    semesters: [],
    localisations: {},
    localisationImages: {},
    //
    fetching: [],
}

const mutations = {
    startFetching(state, action) {
        state.fetching.push(action)
    },
    stopFetching(state, action) {
        let index = state.fetching.indexOf(action)
        if (index === -1) return
        state.fetching.splice(state.fetching.indexOf(action), 1);
    },
    fetchSuccess(state, {localisations, localisation_images, degrees}) {
        for (let j = 0; j < degrees.length; j++) {
            let dSemesters = degrees[j].semesters
            for (let i = 0; i < dSemesters.length; i++) {
                let semester = dSemesters[i]
                semester.degree = {
                    acronym: degrees[j].acronym,
                    name: degrees[j].name
                }
                for (let course of semester.courses) {
                    let coeffTotal = 0.0
                    for (let note of course.notes) {
                        note.multiple = note.notes.length > 0
                        coeffTotal += note.coeff
                        if (!note.multiple) continue
                        note.notes = note.notes.sort((a, b) => a.weight - b.weight)
                    }

                    for (let note of course.notes)
                        note.coeff /= coeffTotal

                    course.notes = course.notes.sort((a, b) => a.weight - b.weight)
                }
                semester.courses = semester.courses.sort((a, b) => a.weight - b.weight)
                semester.optionName = semester.degree.name + " Semestre " + semester.number

                state.semesters.push(semester)
            }
        }

        for (const localisation of localisations)
            state.localisations[localisation.id] = localisation

        for (const localisationImage of localisation_images)
            state.localisationImages[localisationImage.id] = localisationImage
    },

}

const actions = {
    // eslint-disable-next-line no-unused-vars
    fetchData({commit}) {
        commit('startFetching', 'fetchData')
        return new Promise(((resolve, reject) => axios.get('courses/').then(({data}) => {
            commit('fetchSuccess', data)
            resolve()
        }).catch(error => {
            reject(error)
        }).finally(() => commit('stopFetching', 'fetchData'))))
    },

}

const getters = {
    getCourses: (state, getters) => semester => {
        return getters.getSemester(semester).courses
    },
    getSemester: (state) => id => {
        return state.semesters.find(e => e.id === id)
    },
    getSemesterByCourse: state => course => {
            for (const semester of state.semesters)
                for (const courseElement of semester.courses)
                    if (courseElement.id === course)
                        return semester
        return null
    },
    getRealNote: (state, getters) => (semester, selected, noteId) => {
        let courses = selected ? getters.getSelectedAndRequiredCourses(semester) : getters.getCourses(semester)
        for (let course of courses) {
            for (let note of course.notes) {
                if (note.multiple) continue
                if (note.id !== noteId)
                    continue
                return note
            }
        }
        return null
    },
    getSemesters: state => state.semesters,
    isFetching: state => state.fetching.length > 0,
    getOptionalCourses: (state, getters) => semester_id => getters.getCourses(semester_id).filter(course => course.optional),
    getAllCourses: state => {
        let courses = []
        for (let semester of state.semesters)
            Array.prototype.push.apply(courses, semester.courses)
        return courses
    },
    getExamDates: (state, getters) => id => {
        let foundSemester = getters.getSemester(id)
        if (!foundSemester) return []
        return foundSemester.examDates
    },

    getLocalisation: state => localisation => state.localisations[localisation]

}

export default {
    state,
    mutations,
    actions,
    getters
}