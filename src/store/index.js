import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userPhoto: 'https://f.08122.cn/w002/2021/11/05/f8f44b669bfbd879207a645ed8efd269798e0c0c.jpg/300.jpg',
    userName: '牛子妹妹'
  },
  getters: {
  },
  mutations: {
    SET_USERPHOTO (state, value) {
      state.userPhoto = value
    },
    SET_USERNAME (state, value) {
      state.userName = value
    }
  },
  actions: {
  },
  modules: {
  }
})
