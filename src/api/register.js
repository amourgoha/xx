import request from '@/utils/request'

// 注册
export function register(data) {
  return request({
    url: '/ent/public/register',
    method: 'post',
    data: data
  })
}
//验证注册
export function check(data) {
  return request({
    url: '/ent/public/register/check',
    method: 'post',
    data: data
  })
}
//获取短信验证码
export function registerSms(data) {
  return request({
    url: '/ent/public/register/smscode/send',
    method: 'post',
    data: data
  })
}

