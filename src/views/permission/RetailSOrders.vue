<template>
  <div class="app-container">
asldhashda
 {{totalPrice}}





    <el-button type="primary" @click="handleAddRole">add new Item</el-button>

    <el-table :data="selectedItems" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="Item id" width="220">
        <template slot-scope="scope">
          {{ scope.row.ItemDetials.itemName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="price" width="220">
        <template slot-scope="scope">
          {{ scope.row.qty }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="quntity">
        <template slot-scope="scope">
          {{ scope.row.driverStatus }}
        </template>
      </el-table-column>
    
       
      
      <el-table-column align="center" label="Operations">
        <template slot-scope="scope">
          <!-- <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button> -->
          <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'Edit Driver Details':'New Driver Details'">
      <el-form :model="role" label-width="180px" label-position="left">
       

   <!--     <div style="display:inline-block;"> -->
    <label class="radio-label">Book Type: </label>
    <el-select v-model="outputItem" style="width:70%;">
      <el-option
        v-for="item in itemLis"
        :key="item.id"
        :label="item.itemName"
        :value="item"
      />
    </el-select>

    
    
   


     <el-form-item label="Item Name">
          {{outputItem.itemName}}
        </el-form-item>
        <el-form-item label=" Item Price">
            {{outputItem.price}}
        </el-form-item>
        <el-form-item label="Item Qty">
          {{outputItem.quantity}}
        </el-form-item>
    <!--  </div>  -->

   <el-form-item label="Rquesting Qty">
          <el-input v-model="qty" placeholder="Role Name" />
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
        <el-button type="primary" @click="addItemtoCart()">add</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getRoutes, getRoles, addRole, deleteRole, deleteDriver,updateDriver,addDriver,getItems, updateRole, getDrivers } from '@/api/role'

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
      totalPrice:[],
      qty:"",
      selectedItems:[],
      outputItem:"",
      rolesList: [],
      driverList: [],
      itemLis: [],
      options: ['xlsx', 'csv', 'txt'],
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
    // this.getItems() 
  },
  methods: {
    async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
      this.routes = this.generateRoutes(res.data)
    },


     async getItems() {
      const res = await getItems()
      console.log('Driver Details', res._embedded)
      this.itemLis = res._embedded.warehouseItemList
      console.log("Sample",this.itemLis)

      // this.serviceRoutes = res.data
      // this.routes = this.generateRoutes(res.data)
    },

    calculateTotalPrice(){
// ItemDetials:this.outputItem,qty:this.qty
      let total=0;

     for (let i = 0; i < this.selectedItems; i++) {
        total+=this.selectedItems[i].ItemDetials.price * this.selectedItems[i].qty
}


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
      this.getItems()
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
      // this.$confirm('Confirm to remove the driver?', 'Warning', {
      //   confirmButtonText: 'Confirm',
      //   cancelButtonText: 'Cancel',
      //   type: 'warning'
      // })
      this.selectedItems.splice($index, 1)
        // .then(async() => {
        //   await deleteDriver(row.id)
        //   console.log("Id",row.id)
        //   this.driverList.splice($index, 1)
        //   console.log("Id","sucess")
        //   this.$message({
        //     type: 'success',
        //     message: 'Delete succed!'
        //   })
        // })
        // .catch(err => { console.error(err) })
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
     async addItemtoCart(){
       if(this.outputItem.quantity<this.qty){

         this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Key: Quantity is exceeded</div>
          `,
        type: 'error'
      })


       }else{
       this.selectedItems.push({ItemDetials:this.outputItem,qty:this.qty})
       this.dialogVisible = false
       }

     },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      // const checkedKeys = this.$refs.tree.getCheckedKeys()
      // this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)

      if (isEdit) {
        console.log("ssssamm",this.role)
        await updateDriver(this.role.id, this.role)
        for (let index = 0; index < this.driverList.length; index++) {
          if (this.driverList[index].id === this.role.id) {
            this.driverList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
        console.log(this.role)
        var dataSent =   {
              name: this.role.name,
              idNumber:this.role.idNumber,
              contactNumber: this.role.contactNumber,
              driverStatus: this.role.driverStatus,
              vehicle: {
          
                  vehicleNumber: this.role.vehicleNumber,
                  brand: this.role.brand
              }
            }

           

         var dataRes  = await addDriver(dataSent)
        console.log("Response",dataRes)
        // this.role.key = data.key
        this.driverList.push(dataRes)
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
