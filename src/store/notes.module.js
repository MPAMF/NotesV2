import axios from "axios";
import Vue from "vue";

const state = {
    notes: [],
    noteStatus: [],
    sessionId: '',
    planningUrl: null,
    notesLoaded: false,

    // saving
    modifiedNotes: {},
    modifiedSelectedCourses: {},
    modifiedSelectedDegree: null,
    modifiedSelectedSemester: null,
    modifiedPlanningUrl: null,
    runnable: -1,
    canEdit: true,

    // courses
    selectedCourses: [],
    selectedDegree: null,
    selectedSemester: null
}

const mutations = {
    setNote(state, {courseId, note, type}) {
        if(!state.notesLoaded && type !== 0) {
            return
        }
        if (!(courseId in state.notes)) state.notes[courseId] = []
        state.notes[courseId][note.id] = note.value
    },

    setNoteStatus(state, {courseId, note, type}) {
        if(!state.notesLoaded && type !== 0) {
            return
        }
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

    setPlanningUrl(state, url) {
        state.planningUrl = url
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
    createSession({commit}) {
        commit('startFetching', 'createSession')
        return new Promise(((resolve, reject) => axios.post('sessions/', {notes: [], tp_group: null}).then(({data}) => {
            commit('setSessionId', data['session_key'])
            commit('setNotesLoaded', true)
            resolve()
        }).catch(error => {
            reject(error)
        }).finally(() => commit('stopFetching', 'createSession'))))
    },

    loadSession({state, commit, getters, rootGetters}) {
        commit('startFetching', 'loadSession')
        return new Promise(((resolve, reject) => axios.get('sessions/' + state.sessionId + '/').then(({data}) => {
            for (const note of data.notes) {
                let course = rootGetters['getCourseByNote'](note.note)

                if (course == null)
                    continue

                let obj = {
                    courseId: course.id,
                    note: {
                        id: note.note,
                        value: note.value,
                        activated: note.activated
                    },
                    type: 0
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
            commit('setPlanningUrl', data.planning_url)
            commit('setNotesLoaded', true)
            resolve()
        }).catch(error => {
            reject(error)
            console.log(error)
        }).finally(() => commit('stopFetching', 'loadSession'))))
    },
    /*
        type = 0 : Notes
        type = 1 : Set selected TP
        type = 2 : Set selected courses
        type = 3 : Set selected planning url
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
            case 3:
                state.modifiedPlanningUrl = obj
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

        if (state.modifiedPlanningUrl)
            data['planning_url'] = state.modifiedPlanningUrl

        state.runnable = setTimeout(() => {

            if (Object.keys(data).length === 0)
                return

            commit('setCanEdit', false)

            // save here
            Vue.prototype.$recaptchaLoaded().then(() => {
                Vue.prototype.$recaptcha("sessions").then(
                    (token) => {
                        data['recaptcha'] = token

                        axios.put('sessions/' + state.sessionId + '/', data).finally(() => {
                            state.modifiedNotes = {}
                            state.modifiedSelectedCourses = {}
                            state.modifiedSelectedTp = null
                            state.modifiedPlanningUrl = null
                            commit('setCanEdit', true)
                            state.runnable = -1
                        })
                    })
            })


        }, 3000)

    }

}

const getters = {
    getNote: state => (courseId, uuid) => courseId in state.notes ? (uuid in state.notes[courseId] ? state.notes[courseId][uuid] : -1) : -1,
    getNoteById: state => uuid => {
        for (const notes of state.notes)
            for (const note of notes)
                if (note.id === uuid)
                    return note
        return null
    },
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
    getCourseByName: (state, rootGetters) => name => {
        return rootGetters.getAllCourses.find(course => course.name.toLowerCase() === name.toLowerCase())
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
        return null
    },
    getSessionId: state => state.sessionId,
    getCanEdit: state => state.canEdit,
    getRunnable: state => state.runnable,
    getSelectedSemester: state => state.selectedSemester,
    getSelectedDegree: state => state.selectedDegree,
    hasSelectedSemester: state => state.selectedDegree !== null && state.selectedSemester !== null,
    findSelectedSemester: (state, rootGetters) => rootGetters.getSemester(state.selectedDegree, state.selectedSemester),
    getPlanningUrl: state => state.planningUrl,
    getNoteLoadingStatus: state => state.notesLoaded,
}

export default {
    state,
    mutations,
    actions,
    getters
}