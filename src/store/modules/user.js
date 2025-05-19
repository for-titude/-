import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo, updatePassword } from '@/api/user'

const state = {
  token: getToken(),
  userInfo: {} // Fixed spelling from userInfor to userInfo
}
const mutations = {
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken()
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  }
}
const actions = {
  // context上下文，传入参数
  async login(context, data) {
    console.log(data)
    // todo: 调用登录接口
    const token = await login(data)
    // 返回一个token 123456
    context.commit('setToken', token)
  },
  // 获取用户资料
  async getUserInfo(context) {
    const res = await getUserInfo()
    context.commit('setUserInfo', res)
    console.log(context.userInfo)
  },
  // 退出登录,清空token和用户资料
  logout(context) {
    context.commit('removeToken')
    context.commit('setUserInfo', {})
  },
  // 跟新密码
  async updatePassword(context, data) {
    await updatePassword(data)
  }

}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
