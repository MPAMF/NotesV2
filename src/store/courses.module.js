//import axios from "axios";
import axios from "axios";

const state = {
    semesters: [],
    fetching: false,
    //
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
                for (let note of course.notes) {
                    note.multiple = note.notes.length > 0
                    if (!note.multiple) continue
                    note.notes = note.notes.sort((a, b) => b.weight - a.weight)
                }
                course.notes = course.notes.sort((a, b) => b.weight - a.weight)
            }
            semester.courses = semester.courses.sort((a, b) => b.weight - a.weight)
            state.semesters.push(semester)

        }
        // sort semesters by number
        state.semesters = state.semesters.sort((a, b) => a.number - b.number)
    },
    // eslint-disable-next-line no-unused-vars
    setSelectedCourses(state, courses) {

    },

    removeCourseOption(state, course) {
        let found = state.selectedCourses.findIndex(obj => obj.course === course.id)
        if (found <= -1)
            return
        state.selectedCourses.splice(found, 1)
    }
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

    // eslint-disable-next-line no-unused-vars
    editCourseOption({commit}, {course, select}) {
        commit(select ? 'addCourseOption' : 'removeCourseOption', course)
    }

}

const getters = {
    getCourses: (state, getters) => semester =>{
        return  getters.getSemester(semester).courses
    },
    getSemester: state => nb => {
        return state.semesters.find(e => e.number === nb)
    },
    getSemesterByCourse: state => course => {
        for (const semester of state.semesters)
            for (const courseElement of semester.courses)
                if(courseElement.id === course)
                    return semester
        return null
    },
    getSemesters: state => state.semesters,
    isFetching: state => state.fetching,
    // eslint-disable-next-line no-unused-vars
    getOptionalCourses: state => semester => state.courses || [],
    // eslint-disable-next-line no-unused-vars
    getSelectedCourses: state => semester => {
        return [] //state.selectedNotes.filter(obj => obj.)
    },
    // eslint-disable-next-line no-unused-vars
    getSelectedAndRequiredCourses: state => semester => [],
    getAllCourses: state => {
        let courses = []
        for (let semester of state.semesters)
            Array.prototype.push.apply(courses, semester.courses)
        return courses
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}