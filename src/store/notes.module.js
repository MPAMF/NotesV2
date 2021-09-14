import axios from "axios";

const state = {
    notes: [],
    sessionId: ''
}

const mutations = {
    setNote(state, {courseId, note}) {
        if (!(courseId in state.notes)) state.notes[courseId] = []
        state.notes[courseId][note.id] = note.value
    },

    setUserNotes(state, notes) {
        for (let note in notes) {
            console.log(note)
        }
    },

    setSessionId(state, id) {
        state.sessionId = id
    },

    saveSessionId(state) {
        localStorage.setItem('session_id', state.sessionId)
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
        return new Promise(((resolve, reject) => axios.post('sessions/').then(({data}) => {
            commit('setSessionId', data['session_key'])
            resolve()
        }).catch(error => {
            reject(error)
            throw new Error(error)
        }).finally(() => commit('stopFetching'))))
    },

    loadSession({state, commit}) {
        commit('startFetching')
        return new Promise(((resolve, reject) => axios.post('sessions/' + state.sessionId).then(({data}) => {
            commit('setUserNotes', data.notes)
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