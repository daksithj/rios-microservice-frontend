import request from '@/utils/request'
import RequestExternal from '@/utils/RequestExternal'
import RequestDelivery from '@/utils/RequestDelivery'
import axios from 'axios'
import RequestWarehouse from '@/utils/RequestWarehouse'

export function getRoutes() {
    return request({
        url: '/vue-element-admin/routes',
        method: 'get'
    })
}

export function getRoles() {
    return request({
        url: '/vue-element-admin/roles',
        method: 'get'
    })
}

export function getDrivers() {
    return RequestDelivery({
        url: 'delivery/drivers',
        method: 'get'
    })
}

export function getWarehouseItems() {
    return RequestWarehouse({
        url: 'warehouse/items',
        method: 'get'
    })
}

export function addRole(data) {
    return request({
        url: '/vue-element-admin/role',
        method: 'post',
        data
    })
}

export function updateRole(id, data) {
    return request({
        url: `/vue-element-admin/role/${id}`,
        method: 'put',
        data
    })
}

export function deleteRole(id) {
    return request({
        url: `/vue-element-admin/role/${id}`,
        method: 'delete'
    })
}