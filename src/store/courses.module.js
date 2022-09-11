import axios from "axios";

const state = {
    degrees: [],
    localisations: {},
    localisationImages: {},
    //
    fetching: [],
}

const mutations = {
    startFetching(state, action) {
        state.fetching.push(action)
    },
    stopFetching(state, action) {
        let index = state.fetching.indexOf(action)
        if (index === -1) return
        state.fetching.splice(state.fetching.indexOf(action), 1);
    },
    fetchSuccess(state, {localisations, localisation_images, degrees}) {
        for(let j = 0; j < degrees.length; j++) {
            let semesters = degrees[j].semesters
            for (let i = 0; i < semesters.length; i++) {
                let semester = semesters[i]
                for (let course of semester.courses) {
                    let coeffTotal = 0.0
                    for (let note of course.notes) {
                        note.multiple = note.notes.length > 0
                        coeffTotal += note.coeff
                        if (!note.multiple) continue
                        note.notes = note.notes.sort((a, b) => b.weight - a.weight)
                    }

                    for (let note of course.notes)
                        note.coeff /= coeffTotal

                    course.notes = course.notes.sort((a, b) => b.weight - a.weight)
                }
                semester.courses = semester.courses.sort((a, b) => b.weight - a.weight)
            }

            state.degrees.push({
                name: degrees[j].name,
                acronym: degrees[j].acronym,
                semesters: semesters.sort((a, b) => a.number - b.number)
            })
        }

        for (const localisation of localisations)
            state.localisations[localisation.id] = localisation

        for (const localisationImage of localisation_images)
            state.localisationImages[localisationImage.id] = localisationImage
    },

}

const actions = {
    // eslint-disable-next-line no-unused-vars
    fetchData({commit}) {
        commit('startFetching', 'fetchData')
        return new Promise(((resolve, reject) => axios.get('courses/').then(({data}) => {
            commit('fetchSuccess', data)
            resolve()
        }).catch(error => {
            reject(error)
        }).finally(() => commit('stopFetching', 'fetchData'))))
    },

}

const getters = {
    getDegrees: (state) => {
        return state.degrees
    },
    getDegree: (state) => name => {
        for(const degree of state.degrees)
            if(name === degree.name)
                return degree
        return null
    },
    getCourses: (state, getters) => (degree, semester) => {
        return getters.getSemester(degree, semester).courses
    },
    getSemester: (state, getters) => (degree, nb) => {
        let deg = getters.getDegree(degree)
        if(deg === null) return null
        return deg.semesters.find(e => e.number === nb)
    },
    getSemesterByCourse: state => course => {
        for(const degree of state.degrees)
            for (const semester of degree.semesters)
                for (const courseElement of semester.courses)
                    if (courseElement.id === course)
                        return semester
        return null
    },
    getRealNote: (state, getters) => (degree, semester, selected, noteId) => {
        let courses = selected ? getters.getSelectedAndRequiredCourses(degree, semester) : getters.getCourses(degree, semester)
        for (let course of courses) {
            for (let note of course.notes) {
                if (note.multiple) continue
                if (note.id !== noteId)
                    continue
                return note
            }
        }
        return null
    },
    getSemesters: state => state.semesters,
    isFetching: state => state.fetching.length > 0,
    getOptionalCourses: (state, getters) => (degree, semester) => getters.getCourses(degree, semester).filter(course => course.optional),
    getAllCourses: state => {
        let courses = []
        for(let degree of state.degrees)
            for (let semester of degree.semesters)
                Array.prototype.push.apply(courses, semester.courses)
        return courses
    },
    getExamDates: (state, getters) => (degree, semester) => {
        let foundSemester = getters.getSemester(degree, semester)
        if (!foundSemester) return []
        return foundSemester.examDates
    },

    getLocalisation: state => localisation => state.localisations[localisation]

}

export default {
    state,
    mutations,
    actions,
    getters
}