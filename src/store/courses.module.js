const state = {
    courses: [
        {
            id: '52e294ac-3175-4a76-abf1-8873dbadb757',
            name: 'ASE',
            notes: [
                {
                    id: 'a2298958-dc43-44d5-9343-ee88c3cc5fcc',
                    name: 'TD',
                    notes: [
                        // Si plusieurs notes
                    ],
                    coeff: 2,
                },
            ],
            coeff: 2,
            prof: 'Pierre David'
        }
    ],
    fetching: false
}

const mutations = {}

const actions = {}

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