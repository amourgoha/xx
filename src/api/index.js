import request from '@/utils/request'

// 预算树
export function budgettree(query) {
  return request({
    url: '/ent/info/budget/tree',
    method: 'get',
    params: query
  })
}
export function areacodetree(query) {
  return request({
    url: '/ent/info/areacode',
    method: 'get',
    params: query
  })
}
export function update(data) {
  return request({
    url: '/ent/info/update',
    method: 'post',
    data: data
  })
}

// 查询站内性
export function listMessage(query) {
  return request({
    url: '/ent/entHomeLog/message/list',
    method: 'get',
    params: query
  })
}

// 查询代办事项个数
export function getWaitCount() {
  return request({
    url: '/ent/entHomeLog/waitCount',
    method: 'get'
  })
}
// 行业
export function industry() {
  return request({
    url: '/ent/info/industry/',
    method: 'get'
  })
}
export function assigned() {
  return request({
    url: '/ent/info/industry/assigned',
    method: 'get'
  })
}
export function unassigned(query) {
  return request({
    url: '/ent/info/industry/unassigned',
    method: 'get',
    params: query
  })
}