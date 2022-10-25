export const state = () => {
  return {
    auth: '',
    userName: '',
    title: 'DataPipe',
    errorText: '',
    infoText: '',
    breadcrumbs: [],
    getPage: {},
    lastRetrieval: '0',
    snackbar: false
  }
}

export const mutations = {
  setAuth(state, authData) {
    state.auth = authData.Token
    state.userName = authData.Name
    this.$cookie.set('auth', authData.Token)
    this.$cookie.set('userName', authData.Name)
  },

  setPage(state, data) {
    state.getPage = data
  },

  clearAuth(state) {
    state.auth = ''
    state.userName = ''
    this.$cookie.set('auth', '')
    this.$cookie.set('groupId', '')
  },

  setBreadcrumb(state, bc) {
    state.breadcrumbs = bc
  },

  setTitle(state, title) {
    state.title = title
  },

  setErrorText(state, msg) {
    state.errorText = msg
  },

  clearErrorText(state) {
    state.errorText = ''
  },

  setInfoText(state, msg) {
    state.infoText = msg
  },

  setSnackbar(state, msg) {
    state.snackbar = msg.active
    state.infoText = msg.text
  },

  clearInfoText(state) {
    state.infoText = ''
  },

  setLastRetrieval(state, data) {
    state.lastRetrieval = data
  },
}
