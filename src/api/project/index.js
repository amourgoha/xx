import request from '@/utils/request'

// 查询列表
export function list(query) {
  return request({
    url: '/ent/project/list',
    method: 'get',
    params: query
  })
}
export function fundType() {
  return request({
    url: '/ent/project/fundType',
    method: 'get',
  })
}
export function itemType(Id) {
  return request({
    url: '/ent/project/itemType/'+Id,
    method: 'get',
  })
}


export function columnGroup(Id) {
  return request({
    url: '/ent/project/columnGroup/'+Id,
    method: 'get',
  })
}
export function column(Id) {
  return request({
    url: '/ent/project/column/'+Id,
    method: 'get',
  })
}

export function areaCodeTree(Id) {
  return request({
    url: '/ent/project/areaCodeTree/'+Id,
    method: 'get',
  })
}
export function projectsub(data) {
  return request({
    url: '/ent/project',
    method: 'post',
    data: data
  })
}

export function projectDetail(groupId,recordId) {
  return request({
    url: '/ent/project/column/'+groupId+'/'+recordId,
    method: 'get',
  })
}
export function projectedit(data) {
  return request({
    url: '/ent/project',
    method: 'put',
    data: data
  })
}
/* export function projectcolumn(query) {
  return request({
    url: '/ent/project/column',
    method: 'get',
    params: query
  })
} */
export function remove(Id) {
  return request({
    url: '/ent/project/'+Id,
    method: 'DELETE',
  })
}
export function projectCheck(recordIds) {
  return request({
    url: '/ent/project/'+recordIds,
    method: 'put',
  })
}