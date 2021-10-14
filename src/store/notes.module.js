import axios from "axios";

const state = {
    notes: [],
    noteStatus: [],
    sessionId: '',
    notesLoaded: false,

    // saving
    modifiedNotes: {},
    modifiedSelectedCourses: {},
    modifiedSelectedTp: null,
    runnable: -1,
    canEdit: true,

    // courses
    selectedCourses: [],
    selectedTp: null
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
    },

    setSelectedTp(state, tp) {
        state.selectedTp = tp
    },

    addSelectedCourse(state, {selectedCourse, semester}) {
        state.selectedCourses.push({
            course: selectedCourse.id,
            semester: semester
        })
    },

    removeSelectedCourse(state, removedCourse) {
        let found = state.selectedCourses.findIndex(obj => obj.course === removedCourse.id)
        if (found <= -1)
            return
        state.selectedCourses.splice(found, 1)
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

    loadSession({state, commit, getters, rootGetters}) {
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
                if (!selectedCourse.activated) continue
                let course = getters.getCourseById(selectedCourse.course)
                if (!course.optional) continue
                commit('setSelectedCourse', {
                    course: selectedCourse,
                    semester: rootGetters['getSemesterByCourse'](selectedCourse.course)
                })
            }
            let group = getters.findTpGroup(data.tp_group)
            commit('setSelectedTp', data.tp_group == null ? null : group)
            resolve()
        }).catch(error => {
            reject(error)
            console.log(error)
        }).finally(() => commit('stopFetching'))))
    },
    /*
        type = 0 : Notes
        type = 1 : Set selected TP
        type = 2 : Set selected courses
     */
    editSession({state, commit}, {type, obj}) {
        if (state.runnable >= 0) clearTimeout(state.runnable)

        switch (type) {
            case 0:
                state.modifiedNotes[obj.id] = {
                    value: obj.value,
                    activated: obj.activated
                }
                break
            case 1:
                state.modifiedSelectedTp = obj.id
                break
            case 2:
                state.modifiedSelectedCourses[obj.id] = {
                    activated: obj.activated
                }
                break
            default:
                break
        }

        let notesArr = []
        for (const [key, value] of Object.entries(state.modifiedNotes)) {
            notesArr.push({
                note: key,
                value: value.value,
                activated: value.activated
            })
        }

        let coursesArr = []
        for (const [key, value] of Object.entries(state.modifiedSelectedCourses)) {
            coursesArr.push({
                course: key,
                activated: value.activated
            })
        }

        let data = {}

        if (notesArr.length > 0)
            data['notes'] = notesArr

        if (coursesArr.length > 0)
            data['selected_courses'] = coursesArr

        if (state.modifiedSelectedTp != null)
            data['tp_group'] = state.modifiedSelectedTp

        state.runnable = setTimeout(() => {

            if (Object.keys(data).length === 0)
                return

            commit('setCanEdit', false)

            // save here
            axios.put('sessions/' + state.sessionId + '/', data).catch(() => {
                this.$buefy.toast.open({
                    duration: 5000,
                    message: `Une erreur est survenue lors de la sauvegarde de vos modifications.\nVeuillez recharger la page et réessayer.`,
                    type: 'is-danger'
                })
            }).finally(() => {
                state.modifiedNotes = {}
                state.modifiedSelectedCourses = {}
                state.modifiedSelectedTp = null
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
    getSelectedCourses: (state) => semester => state.selectedCourses.filter(obj => obj.semester === semester),
    getSelectedCoursesConverted: (state, getters) => semester => {
        let selectedCourses = getters.getSelectedCourses(semester)
        let result = []
        for (const selectedCourse of selectedCourses) {
            result.push(getters.getCourseById(selectedCourse.course))
        }
        return result
    },
    getSelectedAndRequiredCourses: (state, rootGetters) => semester => {
        let courses = rootGetters.getSelectedCoursesConverted(semester)
        Array.prototype.push.apply(courses, rootGetters.getCourses(semester).filter(course => !course.optional))
        courses.sort((a, b) => b.weight - a.weight)
        return courses
    },
    getCourseById: (state, rootGetters) => id => {
        return rootGetters.getAllCourses.find(course => course.id === id)
    },
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
    findTpGroup: (state, rootGetters) => tpGroupId => {
        return rootGetters.getAllGroups.find(group => group.id === tpGroupId)
    },
    getSessionId: state => state.sessionId,
    getCanEdit: state => state.canEdit,
    getRunnable: state => state.runnable,
    getSelectedTp: state => state.selectedTp
}

export default {
    state,
    mutations,
    actions,
    getters
}