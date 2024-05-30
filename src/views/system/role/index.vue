<template>
  <div>
    <yc-table :table="table" ref="myTable">
      <template slot="buttons" v-if="$powers('/role/addRole')">
        <div class="base-topBtn">
          <el-button type="primary" @click="doAdd">新增角色</el-button>
        </div>
      </template>
      <template slot="status" slot-scope="props">
        <div class="table-row-status">
          <span
            :class="
              props === 'ENABLE'
                ? 'table-row-status-enable'
                : 'table-row-status-disable'
            "
          >
            {{ $enums.RoleStatus.getName(props) }}
          </span>
        </div>
      </template>
      <template slot="action" slot-scope="props">
        <el-button type="text" @click="doEdit(props.id)" v-if="$powers('/role/updateRole')">编辑</el-button>
        <el-button type="text" @click="doPermisson(props.id)" v-if="$powers('/role/queryPermissionTree')"
          >权限配置</el-button
        >
        <el-button type="text" @click="doAuthorize(props)" v-if="$powers('/role/toGrantAuthorized')">授权用户</el-button>
        <el-button
          type="text"
          class="reject"
          @click="doOperate(props.id, 'delete')"
          v-if="$powers('/role/deleteRole')"
          >删除</el-button
        >
      </template>
    </yc-table>
    <el-dialog
      :title="title"
      :visible.sync="roleDialogVisible"
      class="role-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="600px"
      center
    >
      <dialogContent @on-cancel="handleClose" @on-sure="doSubmit">
        <template slot="content">
          <el-form
            :model="form"
            :rules="rules"
            ref="form"
            label-position="right"
            label-width="150px"
          >
            <el-form-item label="角色名称：" prop="roleName">
              <el-input
                v-model="form.roleName"
                placeholder="请输入"
                :disabled="isDisabled"
                style="width: 320px"
              />
            </el-form-item>
            <el-form-item label="角色描述：">
              <el-input
                type="textarea"
                v-model="form.roleDescribe"
                placeholder="请输入"
                :disabled="isDisabled"
                style="width: 320px"
              />
            </el-form-item>
            <el-form-item label="是否启用：" prop="roleStatus" v-if="mode === 'edit'">
              <el-radio-group v-model="form.roleStatus">
                <el-radio
                  :label="item.value"
                  v-for="item in $enums.AdminStatus.list"
                  :key="item.value"
                  >{{ item.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-form>
        </template>
      </dialogContent>
    </el-dialog>
    <el-dialog
      title="权限配置"
      :visible.sync="treeDialogVisible"
      class="tree-dialog"
      :show-close="false"
      width="600px"
      center
    >
      <dialogContent @on-cancel="handleClose" @on-sure="doSubmitTree">
        <template slot="content">
          <el-tree
            :data="treeData"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            ref="tree"
            :check-strictly="true"
          >
          </el-tree>
        </template>
      </dialogContent>
    </el-dialog>
  </div>
</template>
<script>
import dialogContent from '@global/dialog'
const FORM = {
  roleName: null,
  roleDescribe: null,
  roleStatus: null
}
export default {
  components: {
    dialogContent
  },
  data(vm) {
    return {
      tooltipDisabled: true,
      table: {
        api: this.$api.roleQueryRolePage,
        query: {},
        searchData: [
          {
            title: '角色名称',
            type: 'input',
            model: 'roleName',
            placeholder: '请输入'
          },
          {
            title: '权限名称',
            type: 'cascader',
            modelName: ['authName'],
            option: [],
            props: {
              checkStrictly: true,
              label: 'authName',
              value: 'id',
              children: 'childrenNodes'
            },
            hideAllLevels: true,
            placeholder: '请选择'
          }
        ],
        columns: [
          {
            title: '角色名',
            key: 'roleName'
          },
          {
            title: '描述',
            key: 'roleDescribe'
          },
          {
            title: '已授权用户数',
            key: 'userNum'
          },
          {
            title: '状态',
            render(h, ctx) {
              return h(
                'div',
                vm.$refs.myTable.$scopedSlots.status(ctx.row.roleStatus)
              )
            }
          },
          {
            title: '操作',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      },
      title: null,
      roleDialogVisible: false,
      treeDialogVisible: false,
      form: this.$_.cloneDeep(FORM),
      rules: {
        roleName: {
          required: true,
          message: '请输入角色名称',
          trigger: 'blur'
        }
      },
      subLoading: false,
      currentRoleId: null,
      defaultProps: {
        label: 'authName',
        children: 'permissionList'
      },
      treeData: null,
      checkedArr: [],
      mode: null
    }
  },
  created() {
    this.getPermissonTree()
  },
  methods: {
    doAdd() {
      this.title = '新增角色'
      this.mode = 'add'
      this.roleDialogVisible = true
    },
    async doEdit(id) {
      this.title = '编辑角色'
      this.mode = 'edit'
      this.roleDialogVisible = true
      this.currentRoleId = id
      let res = await this.$api.roleQueryRoleDetail({
        id
      })

      this.form = {
        id: res.role.id,
        roleName: res.role.roleName,
        roleDescribe: res.role.roleDescribe,
        roleStatus: res.role.roleStatus
      }
    },
    async doDetail(id) {
      this.title = '查看角色'
      this.mode = 'detail'
      this.roleDialogVisible = true
      this.currentRoleId = id
      let res = await this.$api.roleQueryRoleDetail({
        id
      })

      this.form = {
        id: res.role.id,
        roleName: res.role.roleName,
        roleDescribe: res.role.roleDescribe
      }
    },
    async doPermisson(id) {
      this.currentRoleId = id
      this.initRoleTree(id)
      this.treeDialogVisible = true
    },
    doAuthorize(row) {
      this.$router.push({
        name: 'systemRoleAuthorize',
        query: {
          id: row.id,
          roleName: row.roleName
        }
      })
    },
    async getPermissonTree() {
      let data = await this.$api.permissionQueryPermissionTree({ str: null })
      data.map((it) => {
        this.doWhile(it)
      })
      this.table.searchData[1].option = data
    },
    doWhile(child) {
      if (child.childrenNodes && child.childrenNodes.length) {
        child['authName'] = child.data.authName

        child.childrenNodes.map((it) => {
          it['authName'] = it.data.authName
          this.doWhile(it)
        })
      } else {
        child['authName'] = child.data.authName
        child.childrenNodes = null
      }
    },
    async initRoleTree(id) {
      this.treeData = await this.$api.roleQueryPermissionTree({ id })
      this.treeData.map((it) => {
        this.doWhileTree(it)
      })

      this.$refs.tree.setCheckedKeys(this.checkedArr)
    },
    doWhileTree(tree) {
      if (tree.authorizeStatus === 'AUTHORIZATION') {
        this.checkedArr.push(tree.id)
      }
      if (tree.permissionList && tree.permissionList.length) {
        tree.permissionList.map((it) => {
          this.doWhileTree(it)
        })
      }
    },
    handleClose() {
      this.clearAll()
    },
    clearAll() {
      this.btnPowerList = []
      this.currentTreeId = null
      if (this.$refs.tree) this.$refs.tree.setCheckedKeys([])
      if (this.$refs['form']) this.$refs['form'].resetFields()
      this.form = this.$_.cloneDeep(FORM)
      this.roleDialogVisible = false
      this.treeDialogVisible = false
      this.checkedArr = []
      this.treeData = null;
    },
    doSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        this.subLoading = true
        
        try {
          if (this.mode === 'add') {
            await this.$api.roleAddRole(this.form)
          } else {
            await this.$api.roleUpdateRole(this.form)
          }
          this.$message.success('操作成功')
          this.$refs.myTable.refresh()
          this.clearAll()
        } finally {
          this.subLoading = false
        }
      })
    },
    async doSubmitTree() {
      let arr = this.$refs.tree.getCheckedKeys()
      if (arr && arr.length > 0) {
        arr = arr.map((m) => {
          return {
            permissionId: m,
            authorizeStatus: 'AUTHORIZATION'
          }
        })
      }
      try {
        await this.$api.roleSavePermissionTree({
          roleId: this.currentRoleId,
          rolePermissionList: arr
        })
        this.$message.success('操作成功')
        this.clearAll()
      } catch (e) {}
    },
    //  禁用/启用/删除
    doOperate(id, type) {
      this.$confirm(
        `此操作将${this.operateTxt(type)}该角色, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          let api = null
          if (type === 'disable') {
            api = 'roleDisableRole'
          } else if (type === 'enable') {
            api = 'roleEnableRole'
          } else if (type === 'delete') {
            api = 'roleDeleteRole'
          }
          await this.$api[api]({ id })
          this.$message({
            type: 'success',
            message: `${this.operateTxt(type)}成功!`
          })
          this.$refs.myTable.refresh()
        })
        .catch(() => {})
    },
    operateTxt(val) {
      switch (val) {
        case 'disable':
          return '禁用'
        case 'enable':
          return '启用'
        case 'delete':
          return '删除'
        default:
          return val
      }
    }
  },
  computed: {
    isDisabled() {
      return this.mode === 'detail'
    }
  }
}
</script>

<style lang="sass">
.role-dialog
  .custom-tree-node
    .is-active
      color: $primaryColor
  &__box
    display: flex
    .box-item
      flex: 1
      height: 270px
      &:first-child
        width: 232px
        flex: none
    .box-title
      width: 100%
      padding: 0 10px
      @include hor-start-center
      height: 36px
      .gary
        color: $gray
        margin-left: 10px
        font-size: $font-small
    .box-content
      height: 233px
      padding-bottom: 7px
      overflow-y: scroll
    .box-btnItem
      @include hor-start-center
      margin-left: 15px
      margin-top: 15px
      .el-radio
        margin-right: 12px
      &__span
        display: inline-block
        width: 200px
        @include text-overflow
</style>
