//import axios from "axios";
import axios from "axios";

const state = {
    semesters: [],
    fetching: false,
}

const mutations = {
    startFetching(state) {
        state.fetching = true
    },
    stopFetching(state) {
        state.fetching = false
    },
    fetchSuccess(state, data) {

        for (let semester of data) {
            for (let course of data.courses) {
                for (let note of course.notes) {
                    note.multiple = note.notes.length > 0
                    if (!note.multiple) continue
                    note.notes = note.notes.sort((a, b) => b.weight - a.weight)
                }
                course.notes = course.notes.sort((a, b) => b.weight - a.weight)
            }

            semester.courses = data.sort((a, b) => b.weight - a.weight)
            state.semesters.push(semester)
        }

    },
    // eslint-disable-next-line no-unused-vars
    setSelectedCourses(state, courses) {

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

    }

}

const getters = {
    getCourses: state => state.courses,
    isFetching: state => state.fetching,
    // eslint-disable-next-line no-unused-vars
    getOptionalCourses: state => semester => state.courses,
    // eslint-disable-next-line no-unused-vars
    getSelectedCourses: state => semester => state.courses
}

export default {
    state,
    mutations,
    actions,
    getters
}