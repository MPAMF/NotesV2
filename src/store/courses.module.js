//import axios from "axios";
import axios from "axios";

const state = {
    semesters: [],
    fetching: false,
    //
    currentSemester: 5
}

const mutations = {
    startFetching(state) {
        state.fetching = true
    },
    stopFetching(state) {
        state.fetching = false
    },
    fetchSuccess(state, data) {
        for (let i = 0; i < data.length; i++) {
            let semester = data[i]
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
                        name: 'L' + semester.number + ' TD' + tdGroup.number + ' TP' + tpGroup.number,
                        td: tdGroup.number,
                        tp: tpGroup.number,
                        semester: {number: semester.number},
                        id: tpGroup.id
                    })
                }
            }

            semester.groups = groups

            state.semesters.push(semester)

        }
        // sort semesters by number
        state.semesters = state.semesters.sort((a, b) => a.number - b.number)
    },

}

const actions = {
    // eslint-disable-next-line no-unused-vars
    fetchData({commit}) {
        commit('startFetching')
        return new Promise(((resolve, reject) => axios.get('courses/').then(({data}) => {
            commit('fetchSuccess', data)
            resolve()
        }).catch(error => {
            reject(error)
        }).finally(() => commit('stopFetching'))))
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
    getSemesters: state => state.semesters,
    isFetching: state => state.fetching,
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
    // eslint-disable-next-line no-unused-vars
/*    getTpGroup: state => (semester, number) => {
        for (const semesterElement of semester.groups) {

        }
    },
    getExamDates: state => (semester, tpGroup) => {

    }*/
}

export default {
    state,
    mutations,
    actions,
    getters
}