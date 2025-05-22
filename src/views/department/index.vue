<template>
  <div class="container">
    <div class="app-container">
      <!-- 树形结构，default-expand-all表示默认展开所有节点，expand-on-click-node=“false”表示点击节点图标才展开 -->
      <el-tree default-expand-all :data="depts" :props="defaultProps" :expand-on-click-node="false">
        <!-- 节点结构 -->
        <!-- v-slot="{ node, data }" 只能作用在template, data表示当前的数据项 -->
        <template v-slot="{ data }">
          <!-- 使用width属性撑满父元素的宽度，justify设置flex布局下水平排列方式，align设置垂直排列方式 -->
          <el-row style="width:100%;height:40px" type="flex" justify="space-between" align="middle">
            <!-- 使用:span来设置列宽，总共24列 -->
            <el-col :span="20">{{ data.name }}</el-col>
            <el-col :span="4">
              <span class="tree-manager">{{ data.managerName }}</span>
              <!-- @command回调函数，$event 实参 表示类型 -->
              <el-dropdown @command="operateDept($event,data.id)">
                <!-- 显示区域内容 -->
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <!-- 下拉菜单选项 -->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <!-- 使用sync相当于<addDept :show-dialog="showDialog" @update:show-dialog="showDialog=$event" /> -->
    <addDept ref="addDept" :show-dialog.sync="showDialog" :current-node-id="currentNodeId" @updateDepartment="getDepartment" />
  </div>
</template>

<script>
import { getDepartment, delDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'
import addDept from './components/add-dept.vue'
export default {
  name: 'Department',
  components: {
    addDept
  },
  data() {
    return {
      // depts存储树形结构数据,defaultProps表示树形结构的配置项,showDialog表示是否显示新增部门的dialog,currentNodeId表示当前节点的id
      depts: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      showDialog: false,
      currentNodeId: null // 当前节点的id
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      const result = await getDepartment()
      this.depts = transListToTreeData(result, 0)
    },
    // 操作部门方法
    operateDept(type, id) {
      if (type === 'add') {
      // 添加子部门
        this.showDialog = true // 显示弹层
        this.currentNodeId = id
      } else if (type === 'edit') {
      // 编辑部门场景
        this.showDialog = true
        this.currentNodeId = id // 记录id 要用它获取数据
        // 更新props- 异步动作
        // 直接调用了子组件的方法 同步的方法
        // 要在子组件获取数据
        // 父组件调用子组件的方法来获取数据
        this.$nextTick(() => {
          this.$refs.addDept.getDepartmentDetail() // this.$refs.addDept等同于子组件的this
        })
      } else {
        this.$confirm('您确认要删除该部门吗').then(async() => {
          await delDepartment(id)
          // 提示消息
          this.$message.success('删除部门成功')
          this.getDepartment()
        })
      }
    }
  }

}
</script>

<style scoped>
.app-container {
padding: 30px 140px;
font-size: 14px;
}
.tree-manager {
width: 70px;
display: inline-block;
margin: 10px;
}
</style>
