import request from '@/utils/request'

// 登录方法
export function login(data) {
  return request({
    url: '/ent/public/login/imgcode',
    method: 'post',
    data: data
  })
}
export function mobileLogin(data) {
  return request({
    url: '/ent/public/login/smscode',
    method: 'post',
    data: data
  })
}
// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/ent/public/imgcode',
    method: 'get'
  })
}
//获取短信验证码
export function loginSms(data) {
  return request({
    url: '/ent/public/login/smscode/send',
    method: 'post',
    data: data
  })
}
//忘记密码获取短信验证码
export function forgetpwdSms(data) {
  return request({
    url: '/ent/public/forgetpwd/smscode/send',
    method: 'post',
    data: data
  })
}
// 用户密码重置
export function updateUserPwd(data) {
  return request({
    url: '/ent/public/forgetpwd',
    method: 'post',
    data: data
  })
}