import request from '@/utils/request'
import RequestExternal from '@/utils/RequestExternal'
import RequestDelivery from '@/utils/RequestDelivery'
import RequestWarehouse from '@/utils/RequestWarehouse'
import axios from 'axios'
// import RequestWarehouse from '@/utils/RequestWarehouse'
import RequestRetailShop from '@/utils/RequestRetailShop'

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

export function getRetailShopDetails() {
  return RequestRetailShop({
      url: 'retailShop/shops',
      method: 'get'
  })
}

export function getItems() {
  return RequestWarehouse({
    url: 'warehouse/items',
    method: 'get'
  })
}
export function addRetailShopDetails(data) {
  console.log("sample",data)
  return RequestRetailShop({
    url: `retailShop/shops`,
    method: 'post',
    data
  })
}
export function confrimOrder(id,data) {
  return RequestDelivery({
    url: `delivery/pickUpOrders/${id}`,
    method: 'put',
    data
  })
}

export function updateRetailShopDetails(id,data) {
  return RequestRetailShop({
    url: `retailShop/shops/${id}`,
    method: 'put',
    data
  })
}

export function deleteRetailShopDetails(id) {
  return RequestRetailShop({
    url: `retailShop/shops/${id}`,
    method: 'delete'
  })
}

export function getWarehouseItems() {
    return RequestWarehouse({
        url: 'warehouse/items',
        method: 'get'
    })
}

export function addWarehouseItems(data) {
  console.log("sample",data)
  return RequestWarehouse({
    url: `warehouse/items/`,
    method: 'post',
    data
  })
}

export function updateWarehouseItems(id,data) {
  return RequestWarehouse({
    url: `warehouse/items/${id}`,
    method: 'put',
    data
  })
}

export function deleteWarehouseItems(id) {
  return RequestWarehouse({
    url: `warehouse/items/${id}`,
    method: 'delete'
  })
}

export function getOrders() {
  return RequestDelivery({
    url: 'delivery/orders',
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


export function getDriverItems(id) {
  return RequestDelivery({
    url: `delivery/getDeliveryItems/${id}`,
    method: 'get'
  })
}

export function updateDriver(id,data) {
  return RequestDelivery({
    url: `delivery/drivers/${id}`,
    method: 'put',
    data
  })
}

export function addDriver(data) {
  return RequestDelivery({
    url: `delivery/drivers/`,
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'delete'
  })
}

export function deleteDriver(id) {
  return RequestDelivery({
    url: `delivery/drivers/${id}`,
    method: 'delete'
  })
}