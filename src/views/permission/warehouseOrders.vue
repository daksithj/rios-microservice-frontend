<template>
  <div class="app-container">
    

    <el-table :data="warehouseOrderList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="Orders" >
        <template slot-scope="scope">
          
          <el-table :data="scope.row.itemList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="Item Name" >
        <template slot-scope="scopes">
          {{ scopes.row.warehouseItem.itemName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Price">
        <template slot-scope="scopes">
          {{ scopes.row.warehouseItem.price }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Order Amount" >
        <template slot-scope="scopes">
          {{ scopes.row.orderedAmount }}
        </template>
      </el-table-column>
      
      
      
    </el-table>
        </template>

      </el-table-column>
      
      
      
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Item Details':'Add New Item'">
      <el-form :model="role" label-width="180px" label-position="left">
        <el-form-item label="Item Name">
          <el-input v-model="role.itemName" placeholder="Item Name" />
        </el-form-item>
        <el-form-item label="Quantity">
          <el-input v-model="role.quantity" placeholder="Quantity" />
        </el-form-item>
        <el-form-item label="Price">
          <el-input v-model="role.price" placeholder="Price" />
        </el-form-item>
        
        
<!-- 
        <el-form-item label="Desc">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="Role Description"
          />
        </el-form-item>
        
        <el-form-item label="Menus">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          />
        </el-form-item>
        -->

      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="confirmRole">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getRoutes, getRoles, addRole, deleteRole, updateRole, getDrivers, getWarehouseItemsOrders } from '@/api/role'

const defaultRole = {
  key: '',
  name: '',
  description: '',
  routes: []
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      driverList: [],
      oderList: [],
      warehouseItemList: [],
      warehouseOrderList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getRoutes()
    this.getRoles()
    this.getDrivers()
    this.getWarehouseItems()
    this.getWarehouseItemsOrders()
  },
  methods: {
    async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
      this.routes = this.generateRoutes(res.data)
    },

    async getDrivers() {
      const res = await getDrivers()
      console.log('Driver Details', res._embedded.driverList)
      this.driverList = res._embedded.driverList
      // this.serviceRoutes = res.data
      // this.routes = this.generateRoutes(res.data)
    },
    async getWarehouseItems() {
      const res = await getWarehouseItems()
      console.log('Warehouse Details', res)
      this.warehouseItemList = res._embedded.warehouseItemList
      // this.serviceRoutes = res.data
      // this.routes = this.generateRoutes(res.data)
    },
    async getWarehouseItemsOrders() {
      const res = await getWarehouseItemsOrders()
      console.log('Warehouse Order Details', res)
      this.warehouseOrderList = res._embedded.warehouseOrderList
      // this.serviceRoutes = res.data
      // this.routes = this.generateRoutes(res.data)
    },

    async getRoles() {
      const res = await getRoles()
      this.rolesList = res.data
    },

    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title

        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        const routes = this.generateRoutes(this.role.routes)
        this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await deleteWarehouseItems(row.id)
          console.log("Id",row.id)
          this.warehouseItemList.splice($index, 1)
          console.log("Id","sucess")
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      // const checkedKeys = this.$refs.tree.getCheckedKeys()
      // this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)

      if (isEdit) {
        console.log("ssssamm",this.role)
        await updateWarehouseItems(this.role.id, this.role)
        for (let index = 0; index < this.warehouseItemList.length; index++) {
          if (this.warehouseItemList[index].id === this.role.id) {
            this.warehouseItemList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
        console.log(this.role)
        var dataSent =   {
              itemName: this.role.itemName,
              quantity:this.role.quantity,
              price: this.role.price,
              
            }

           

         var dataRes  = await addWarehouseItems(dataSent)
        console.log("Response",dataRes)
        // this.role.key = data.key
        this.warehouseItemList.push(dataRes)
        // this.rolesList.push(this.role)
      }

      const { description, key, name } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Key: ${key}</div>
            <div>Role Name: ${name}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
