const state = {
    notes: [],
    defaultNote: 10.0
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
    }

}

const getters = {
    getNote: state => (courseId, uuid) => courseId in state.notes ? (uuid in state.notes[courseId] ? state.notes[courseId][uuid] : state.defaultNote) : state.defaultNote,
    getNotesByCourse: state => courseId => courseId in state.notes ? state.notes[courseId] : []
}

export default {
    state,
    mutations,
    actions,
    getters
}