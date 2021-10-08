import axios from "axios";

const state = {
    notes: [],
    noteStatus: [],
    sessionId: '',
    notesLoaded: false,

    // saving
    modifiedNotes: {},
    runnable: -1,
    canEdit: true,

    // courses
    selectedCourses: []
}

const mutations = {
    setNote(state, {courseId, note}) {
        if (!(courseId in state.notes)) state.notes[courseId] = []
        state.notes[courseId][note.id] = note.value
    },

    setNoteStatus(state, {courseId, note}) {
        if (!(courseId in state.noteStatus)) state.noteStatus[courseId] = []
        state.noteStatus[courseId][note.id] = note.activated
    },

    setSessionId(state, id) {
        state.sessionId = id
    },

    clearNotes(state) {
        state.notes = []
    },

    saveSessionId(state) {
        localStorage.setItem('session_id', state.sessionId)
    },

    setCanEdit(state, value) {
        state.canEdit = value
    },

    setNotesLoaded(state, value) {
        state.notesLoaded = value
    },

    // eslint-disable-next-line no-unused-vars
    setSelectedCourse(state, {course, semester}) {
        state.selectedCourses.push({
            course: course.course,
            semester: semester.number
        })
    }
}

const actions = {

    setNote({commit}, value) {
        // update to DB
        commit('setNote', value)
    },

    createSession({commit}) {
        commit('startFetching')
        return new Promise(((resolve, reject) => axios.post('sessions/', {notes: []}).then(({data}) => {
            commit('setSessionId', data['session_key'])
            commit('setNotesLoaded', true)
            resolve()
        }).catch(error => {
            reject(error)
        }).finally(() => commit('stopFetching'))))
    },

    loadSession({state, commit, rootGetters}) {
        commit('startFetching')
        return new Promise(((resolve, reject) => axios.get('sessions/' + state.sessionId + '/').then(({data}) => {
            for (const note of data.notes) {
                let course = rootGetters['getCourseByNote'](note.note)
                let obj = {
                    courseId: course.id,
                    note: {
                        id: note.note,
                        value: note.value,
                        activated: note.activated
                    }
                }
                commit('setNote', obj)
                commit('setNoteStatus', obj)
            }


            for (const selectedCourse of data.selected_courses) {
                if(!selectedCourse.activated)
                    continue
                commit('setSelectedCourse', {
                    course: selectedCourse,
                    semester: rootGetters['getSemesterByCourse'](selectedCourse.course)
                })
            }

            resolve()
        }).catch(error => {
            reject(error)
            console.log(error)
        }).finally(() => commit('stopFetching'))))
    },

    editNote({state, commit}, {note}) {
        if (state.runnable >= 0) clearTimeout(state.runnable)
        state.modifiedNotes[note.id] = note.value

        let arr = []
        for (const [key, value] of Object.entries(state.modifiedNotes)) {
            arr.push({
                note: key,
                value: value,
                activated: note.activated
            })
        }

        state.runnable = setTimeout(() => {
            commit('setCanEdit', false)

            // save here
            axios.put('sessions/' + state.sessionId + '/', {
                notes: arr
            }).finally(() => {
                state.modifiedNotes = {}
                commit('setCanEdit', true)
                state.runnable = -1
            })

        }, 3000)

    }

}

const getters = {
    getNote: state => (courseId, uuid) => courseId in state.notes ? (uuid in state.notes[courseId] ? state.notes[courseId][uuid] : -1) : -1,
    getNoteStatus: state => (courseId, uuid) => courseId in state.noteStatus ? (uuid in state.noteStatus[courseId] ? state.noteStatus[courseId][uuid] : true) : true,
    getNotesByCourse: state => courseId => courseId in state.notes ? state.notes[courseId] : [],
    getCourseByNote: (state, rootGetters) => noteId => {
        let courses = rootGetters.getAllCourses
        for (let i = 0; i < courses.length; i++) {
            let course = courses[i]

            for (let j = 0; j < course.notes.length; j++) {
                let note = course.notes[j]

                if (note.id === noteId)
                    return course

                if (!note.multiple) continue

                for (let k = 0; k < note.notes.length; k++) {
                    let subNote = note.notes[k]
                    if (subNote.id === noteId)
                        return course
                }

            }

        }
    },
    getSessionId: state => state.sessionId,
    getCanEdit: state => state.canEdit,
    getRunnable: state => state.runnable
}

export default {
    state,
    mutations,
    actions,
    getters
}