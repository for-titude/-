import request from '@/utils/request'

// 获取组织架构数据
export function getDepartment() {
  return request({
    url: '/company/department'
  })
}

// 获取部分负责人数据
export function getManagerList() {
  return request({
    url: '/sys/user/simple'
  })
}

// 添加部门
export function addDepartment(data) {
  return request({
    method: 'post',
    url: '/company/department',
    data
  })
}
