<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input v-model="queryParams.keyword" style="margin-bottom:10px" type="text" prefix-icon="el-icon-search" size="small" placeholder="输入员工姓名全员搜索" @input="changeValue" />
        <!-- 树形组件 -->
        <el-tree
          ref="deptTree"
          node-key="id"
          :data="depts"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          highlight-current
          @current-change="selectNode"
        />
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button size="mini" type="primary">添加员工</el-button>
          <el-button size="mini">excel导入</el-button>
          <el-button size="mini">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data="list">
          <el-table-column prop="staffPhoto" align="center" label="头像">
            <template v-slot="{ row }">
              <el-avatar v-if="row.staffPhoto" :src="row.staffPhoto" :size="30" />
              <span v-else class="username">{{ row.username?.charAt(0) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名" />
          <el-table-column prop="mobile" label="手机号" sortable />
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <template v-slot="{ row }">
              <span>{{ row.formOfEmployment===1 ? '正式' : '非正式' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable />
          <el-table-column label="操作" width="280px">
            <template>
              <el-button size="mini" type="text">查看</el-button>
              <el-button size="mini" type="text">角色</el-button>
              <el-button size="mini" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row style="height: 60px" align="middle" type="flex" justify="end">
          <el-pagination
            layout="total,prev, pager, next"
            :total="total"
            :current-page="queryParams.page"
            :page-size="queryParams.pagesize"
            @current-change="changePage"
          />
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { getDepartment } from '@/api/department'
import { getEmployeeList } from '@/api/employee'
import { transListToTreeData } from '@/utils'
export default {
  name: 'Employee',
  data() {
    return {
      depts: [], // 组织数据
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      // 存储查询参数
      queryParams: {
        departmentId: null,
        page: 1, // 当前页码
        pagesize: 10,
        keyword: '' // 模糊搜索字段
      },
      total: 0, // 记录员工的总数
      list: [] // 员工列表
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.queryParams)
      this.list = rows
      this.total = total
    },
    async getDepartment() {
    // 递归方法 将列表转化成树形
    // let result = await getDepartment()
      this.depts = transListToTreeData(await getDepartment(), 0)
      this.queryParams.departmentId = this.depts[0].id
      // 设置选中节点
      // 树组件渲染是异步的 等到更新完毕
      this.$nextTick(() => {
      // 此时意味着树渲染完毕
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId)
      })
      this.getEmployeeList()
    },
    selectNode(node) {
      this.queryParams.departmentId = node.id // 重新记录了参数
      this.queryParams.page = 1 // 设置第一页
      this.getEmployeeList()
    },
    // 切换页码
    changePage(newPage) {
      this.queryParams.page = newPage // 赋值新页码
      this.getEmployeeList() // 查询数据
    },
    changeValue() {
    // 单位时间内只执行最后一次
    // this的实例上赋值了一个timer的属性
      clearTimeout(this.timer) // 清理上一次的定时器
      this.timer = setTimeout(() => {
        this.queryParams.page = 1
        this.getEmployeeList()
      }, 300)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;
  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }
  .right {
    flex: 1;
    padding: 20px;
    .opeate-tools {
      margin:10px ;
    }
    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display:inline-block;
    }
  }
}

</style>
