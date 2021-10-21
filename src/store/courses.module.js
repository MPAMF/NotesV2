import axios from "axios";

const state = {
    semesters: [],
    localisations: {},
    localisationImages: {},
    //
    fetching: [],
    //
    currentSemester: 5
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
    fetchSuccess(state, {localisations, localisation_images, semesters}) {
        for (let i = 0; i < semesters.length; i++) {
            let semester = semesters[i]
            for (let course of semester.courses) {
                let coeffTotal = 0.0
                for (let note of course.notes) {
                    note.multiple = note.notes.length > 0
                    coeffTotal += note.coeff
                    if (!note.multiple) continue
                    note.notes = note.notes.sort((a, b) => b.weight - a.weight)
                }

                for (let note of course.notes)
                    note.coeff /= coeffTotal

                course.notes = course.notes.sort((a, b) => b.weight - a.weight)
            }
            semester.courses = semester.courses.sort((a, b) => b.weight - a.weight)

            let groups = []
            for (let tdGroup of semester.td_groups) {
                for (let tpGroup of tdGroup.tp_groups) {
                    groups.push({
                        name: 'S' + semester.number + ' TD' + tdGroup.number + ' TP' + tpGroup.number,
                        td: tdGroup.number,
                        tp: tpGroup.number,
                        semester: {number: semester.number},
                        id: tpGroup.id
                    })
                }
            }

            state.semesters.push({
                activated: semester.activated,
                number: semester.number,
                courses: semester.courses,
                groups: groups,
                examDates: semester.exam_dates
            })

        }
        // sort semesters by number
        state.semesters = state.semesters.sort((a, b) => a.number - b.number)

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
    getSemester: state => nb => {
        return state.semesters.find(e => e.number === nb)
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
    getOptionalCourses: (state, getters) => semester => getters.getCourses(semester).filter(course => course.optional),
    getAllCourses: state => {
        let courses = []
        for (let semester of state.semesters)
            Array.prototype.push.apply(courses, semester.courses)
        return courses
    },
    getAllGroups: state => {
        let groups = []
        for (let semester of state.semesters)
            Array.prototype.push.apply(groups, semester.groups)
        return groups
    },
    getExamDates: (state, getters) => (semester, tpGroup) => {
        let foundSemester = getters.getSemester(semester)
        if (!foundSemester) return []

        let result = []
        for (let examDate of foundSemester.examDates) {
            if (examDate.tp_group != null && examDate.tp_group !== tpGroup)
                continue
            result.push(examDate)
        }
        return result
    },

    getLocalisation: state => localisation => state.localisations[localisation]

}

export default {
    state,
    mutations,
    actions,
    getters
}