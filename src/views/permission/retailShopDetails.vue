<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">New Shop</el-button>

    <el-table :data="retailShopList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="Shop Name" width="220">
        <template slot-scope="scope">
          {{ scope.row.shopName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Contact Number" width="220">
        <template slot-scope="scope">
          {{ scope.row.contactNumber }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="Address">
        <template slot-scope="scope">
          {{ scope.row.address }}
        </template>
      </el-table-column>
    
      
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Shop Details':'New Shop Details'">
      <el-form :model="role" label-width="180px" label-position="left">
        <el-form-item label="Name">
          <el-input v-model="role.shopName" placeholder="Shop Name" />
        </el-form-item>
        <el-form-item label="Contact Number">
          <el-input v-model="role.contactNumber" placeholder="contactNumber" />
        </el-form-item>
        <el-form-item label="Address">
          <el-input v-model="role.address" placeholder="Address" />
        </el-form-item>
        

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
import {deleteDriver,updateDriver,addDriver, updateRole, getDrivers, getRetailShopDetails, addRetailShopDetails, updateRetailShopDetails, deleteRetailShopDetails } from '@/api/role'

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
      retailShopList: [],
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
    this.getRetailShopDetails()
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

    async getRetailShopDetails() {
      const res = await getRetailShopDetails()
      console.log('Retail Shop Details', res)
      this.retailShopList = res._embedded.retailShopList
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
          await deleteRetailShopDetails(row.id)
          console.log("Id",row.id)
          this.retailShopList.splice($index, 1)
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
        await updateRetailShopDetails(this.role.id, this.role)
        for (let index = 0; index < this.retailShopList.length; index++) {
          if (this.retailShopList[index].id === this.role.id) {
            this.retailShopList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
        console.log(this.role)
        var dataSent =   {
              shopName: this.role.shopName,
              // idNumber:this.role.idNumber,
              contactNumber: this.role.contactNumber,
              address: this.role.address,
              
            }

           

         var dataRes  = await addRetailShopDetails(dataSent)
        console.log("Response",dataRes)
        // this.role.key = data.key
        this.retailShopList.push(dataRes)
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
