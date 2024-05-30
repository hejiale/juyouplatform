import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const state = {
    isCollapse: false, //  菜单栏展开/收起
    auditDetail: {}, // 审核详情
    managementDetail: {}, // 商户管理详情
}

const mutations = {
    setCollapse (state, isCollapse) {
        state.isCollapse = isCollapse
    },
    setAuditDetail(state, data) {
        state.auditDetail= JSON.parse(JSON.stringify(data))
    },
    setManagementDetail(state, data) {
        state.managementDetail = JSON.parse(JSON.stringify(data))
    }
}

const store = new Vuex.Store({
    state,
    mutations,
    plugins: [createPersistedState({
        storage: window.sessionStorage
    })]
})

export default store
