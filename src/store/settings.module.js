const state = {
    darkMode: false
}

const mutations = {
    setDarkMode(state, status) {
        state.darkMode = status
    }
}

const actions = {
    loadDarkMode({commit}) {
        let darkMode = localStorage.getItem('dark_mode') !== null && localStorage.getItem('dark_mode') === 'true'
        commit('setDarkMode', darkMode)
    },
}

const getters = {
    isDarkMode: state => state.darkMode
}

export default {
    state,
    mutations,
    actions,
    getters
}