import request from '@/utils/request'

// 查询列表
export function list(query) {
  return request({
    url: '/ent/entFeedback/list',
    method: 'get',
    params: query
  })
}
export function listsub(recordId) {
  return request({
    url: '/ent/entFeedback/list/'+recordId,
    method: 'get',
  })
}
export function balance(Id) {
  return request({
    url: '/ent/entFeedback/balance/'+Id,
    method: 'get',
  })
}

export function entFeedback(data) {
  return request({
    url: '/ent/entFeedback',
    method: 'post',
    data: data
  })
}

export function feedbackDetail(recordId) {
  return request({
    url: '/ent/entFeedback/'+recordId,
    method: 'get',
  })
}
