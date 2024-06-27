import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    // 定义你的状态
    groupStudent: null,
  },
  mutations: {
    // 定义你的 mutations
    updateGroupStudent(state, groupStudent) {
      state.groupStudent = groupStudent;
    },
  },
  actions: {
  },
});

export default store;