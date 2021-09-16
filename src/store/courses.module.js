//import axios from "axios";
import axios from "axios";

const state = {
    courses: [],
    fetching: false
}

const mutations = {
    startFetching(state) {
        state.fetching = true
    },
    stopFetching(state) {
        state.fetching = false
    },
    fetchSuccess(state, data) {
        for(let course of data)
            for(let note of course.notes)
                note.multiple = note.notes.length > 0
        state.courses = data
    }
}

const actions = {
    // eslint-disable-next-line no-unused-vars
    fetchData({commit}) {
        commit('startFetching')
        return new Promise(((resolve, reject) => axios.get('courses').then(({data}) => {
            commit('fetchSuccess', data)
            resolve()
        }).catch(error => {
            reject(error)
        }).finally(() => commit('stopFetching'))))
    }
}

const getters = {
    getCourses: state => state.courses,
    isFetching: state => state.fetching,
}

export default {
    state,
    mutations,
    actions,
    getters
}