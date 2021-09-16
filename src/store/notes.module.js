import axios from "axios";

const state = {
    notes: [],
    sessionId: '',

    // saving
    modifiedNotes: [],
    runnable: -1,
    canEdit: true
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

    createSession({commit}) {
        commit('startFetching')
        return new Promise(((resolve, reject) => axios.post('sessions/').then(({data}) => {
            commit('setSessionId', data['session_key'])
            resolve()
        }).catch(error => {
            reject(error)
        }).finally(() => commit('stopFetching'))))
    },

    loadSession({state, commit}) {
        commit('startFetching')
        return new Promise(((resolve, reject) => axios.get('sessions/' + state.sessionId + '/').then(({data}) => {
            console.log(data)
            commit('setUserNotes', data.notes)
            resolve()
        }).catch(error => {
            reject(error)
        }).finally(() => commit('stopFetching'))))
    },

    // eslint-disable-next-line no-unused-vars
    editNote({state, commit}, {id, value}) {

        if (state.runnable >= 0) clearTimeout(state.runnable)
        state.modifiedNotes[id] = value

        state.runnable = setTimeout(() => {
            commit('setCanEdit', false)

            // save here
           axios.post('sessions/' + state.sessionId + '/', {
               notes: state.modifiedNotes
           }).finally(() => {
               state.modifiedNotes = []
               commit('setCanEdit', true)
           })

        }, 3000)

    }

}

const getters = {
    getNote: state => (courseId, uuid) => courseId in state.notes ? (uuid in state.notes[courseId] ? state.notes[courseId][uuid] : -1) : -1,
    getNotesByCourse: state => courseId => courseId in state.notes ? state.notes[courseId] : [],
    getSessionId: state => state.sessionId,
    getCanEdit: state => state.canEdit
}

export default {
    state,
    mutations,
    actions,
    getters
}