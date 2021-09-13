import axios from "axios";

const state = {
    notes: [],
    sessionId: 'a2312e58ef'
}

const mutations = {
    setNote(state, {courseId, note}) {
        if (!(courseId in state.notes)) state.notes[courseId] = []
        state.notes[courseId][note.id] = note.value
    }
}

const actions = {

    setNote({commit}, value) {
        // update to DB
        commit('setNote', value)
    },

    fetchSessionData({commit}, value) {
        commit('setNote', value)
    },

    createSession({commit}) {
        commit('startFetching')
        return new Promise(((resolve, reject) => axios.post('session/create').then(({data}) => {
            commit('fetchSuccess', data)
            resolve()
        }).catch(error => {
            reject(error)
            throw new Error(error)
        }).finally(() => commit('stopFetching'))))
    }

}

const getters = {
    getNote: state => (courseId, uuid) => courseId in state.notes ? (uuid in state.notes[courseId] ? state.notes[courseId][uuid] : -1) : -1,
    getNotesByCourse: state => courseId => courseId in state.notes ? state.notes[courseId] : [],
    getSessionId: state => state.sessionId
}

export default {
    state,
    mutations,
    actions,
    getters
}