<template>
  <div>
    <yc-table :table="table" ref="myTable">
      <template slot="buttons" v-if="$powers('/admin/addAdmin')">
        <div class="base-topBtn" v-if="$powers('/admin/addAdmin')">
          <el-button type="primary" @click="doAdd">新增用户</el-button>
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
            {{ $enums.AdminStatus.getName(props) }}
          </span>
        </div>
      </template>
      <template slot="role" slot-scope="props">
        <template v-if="props && props.length > 0">
          <span v-for="(item, idx) in props" :key="idx">
            <template v-if="idx === props.length - 1">{{
              item.roleName
            }}</template>
            <template v-else>{{ item.roleName }}、</template>
          </span>
        </template>
      </template>
      <template slot="action" slot-scope="props">
        <el-button type="text" @click="doEdit(props)" v-if="$powers('/admin/updateAdmin')">编辑</el-button>
        <el-button
          type="text"
          class="reject"
          @click="doOperate(props.id, 'delete')"
          v-if="$powers('/admin/deleteAdmin')"
          >删除</el-button>
        <el-button
          v-if="props.adminStatus === 'ENABLE' && $powers('/admin/disableAdmin')"
          type="text"
          @click="doOperate(props.id, 'disable')"
          >禁用</el-button>
        <el-button
          v-if="props.adminStatus === 'DISABLE' && $powers('/admin/enableAdmin')"
          type="text"
          @click="doOperate(props.id, 'enable')"
          >启用</el-button>
        <el-button
          type="text"
          class="del"
          @click="doReset(props.id)"
          v-if="$powers('/admin/resetPassword')"
          >重置密码</el-button>
      </template>
    </yc-table>
    <el-dialog
      :title="title"
      :visible.sync="userDialogVisible"
      class="role-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="35%"
      center
    >
      <dialogContent
        @on-back="handleClose"
        @on-cancel="handleClose"
        @on-sure="doSubmit"
      >
        <template slot="content">
          <el-form
            :model="form"
            :rules="rules"
            ref="form"
            label-position="left"
            label-width="150px"
            class="user-form"
            style="padding: 0 50px"
            center
          >
            <el-form-item label="手机号：" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号，用户名即手机号" />
            </el-form-item>
            <el-form-item label="姓名：" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入真实姓名" />
            </el-form-item>
            <el-form-item label="是否启用：" prop="adminStatus">
              <el-radio-group v-model="form.adminStatus">
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
      :title="title"
      :visible.sync="passwordDialogVisible"
      class="password-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="25%"
      center
    >
      <dialogContent
        @on-back="handleClose"
        @on-cancel="handleClose"
        @on-sure="handleClose"
        sureText="确认"
      >
        <template slot="content">
          <span class="text" v-if="newPassword">{{newPassword}}</span>
          <div v-if="showUserInfo" class="showUserBox">
            <span>用户名：{{showUserInfo.phone}}</span>
            <span>姓名：{{showUserInfo.nickName}}</span>
            <span>密码：{{showUserInfo.password}}</span>
          </div>
        </template>
      </dialogContent>
    </el-dialog>
  </div>
</template>

<script>
import enumRadio from '@partial/enum-radio'
import dialogContent from '@global/dialog'
const FORM = {
  nickName: null,
  adminStatus: 'ENABLE',
  phone: null
}
export default {
  components: {
    enumRadio,
    dialogContent
  },
  data(vm) {
    const validatePhone = (rule, value, callback) => {
      if (!vm.$_.isEmpty(value)) {
        let reg = /^1[3456789]\d{9}$/
        if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号格式'))
        }
        callback()
      } else {
        callback(new Error('请输入手机号'))
      }
    }
    // const validatePassword = (rule, value, callback) => {
    //   if (!vm.$_.isEmpty(value)) {
    //     var regx =/^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{8,15}$/;
    //     if (!regx.test(value)) {
    //       callback(new Error('请输入正确的格式: 字母大写+字母小写+数字,8-15位'))
    //     }
    //     callback()
    //   } else {
    //     callback(new Error('请输入密码'))
    //   }
    // }
    return {
      table: {
        api: this.$api.adminQueryAdminPage,
        query: {},
        searchData: [
          {
            title: '用户名',
            type: 'input',
            model: 'username',
            placeholder: '请输入'
          },
          {
            title: '姓名',
            type: 'input',
            model: 'nickName',
            placeholder: '请输入'
          },
          {
            title: '手机号',
            type: 'input',
            model: 'phone',
            placeholder: '请输入'
          },
          {
            title: '用户状态',
            type: 'select',
            model: 'adminStatus',
            enumType: 'AdminStatus',
            placeholder: '请选择'
          },
          {
            title: '权限名称',
            type: 'cascader',
            modelName: ['authCode'],
            option: [],
            props: {
              checkStrictly: true,
              label: 'authName',
              value: 'id',
              children: 'childrenNodes'
            },
            hideAllLevels: true,
            placeholder: '请选择'
          },
          {
            title: '角色',
            type: 'customSelect',
            options: [],
            model: 'roleId',
            placeholder: '请选择'
          },
        ],
        columns: [
          {
            title: '用户名',
            key: 'username'
          },
          {
            title: '姓名',
            key: 'nickName'
          },
          {
            title: '手机号',
            key: 'phone'
          },
          {
            title: '用户角色',
            render(h, ctx) {
              return h(
                'div',
                vm.$refs.myTable.$scopedSlots.role(ctx.row.adminRoleItemList)
              )
            }
          },
          {
            title: '账号状态',
            render(h, ctx) {
              return h(
                'div',
                vm.$refs.myTable.$scopedSlots.status(ctx.row.adminStatus)
              )
            }
          },
          // {
          //   title: "创建时间",
          //   key: "createdTime",
          // },
          {
            title: '更新时间',
            key: 'updateTime'
          },
          {
            title: '操作',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      },
      form: this.$_.cloneDeep(FORM),
      rules: {
        nickName: { required: true, message: '请输入姓名', trigger: 'blur' },
        phone: {
          required: true,
          validator: validatePhone,
          trigger: ['blur', 'change']
        },
        adminStatus: {
          required: true,
          message: '请选择状态',
          trigger: 'change'
        }
      },
      userDialogVisible: false,
      passwordDialogVisible: false,
      mode: null,
      title: null,
      subLoading: false,
      roleList: [],
      newPassword: null,
      showUserInfo: null
    }
  },
  created() {
    this.getPermissonTree();
    this.initRoleData()
  },
  methods: {
    async initRoleData() {
      let res = await this.$api.roleQueryRolePage({
        pageNo: 1,
        pageSize: 9999
      })
      this.roleList = res.records
        ? res.records.map((m) => {
            return {
              value: m.id,
              label: m.roleName
            }
          })
        : []
    
      this.table.searchData[5].options = this.roleList;
    },
    doAdd() {
      this.title = '新增用户'
      this.mode = 'add'
      this.userDialogVisible = true
    },
    doEdit(row) {
      this.form = {
        "adminStatus": row.adminStatus,
        "id": row.id,
        "nickName": row.nickName,
        "phone": row.phone,
        "username": row.username
      }
      this.title = '编辑用户'
      this.mode = 'edit'
      this.userDialogVisible = true
    },
    doSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        this.subLoading = true
        let isEdit = this.mode === 'edit'
        try {
          let api = null
          if (isEdit) {
            api = 'adminUpdateAdmin'
          } else {
            api = 'adminAddAdmin'
          }
          let res = await this.$api[api](this.form)
          
          let showUserInfo = null;
          if(!isEdit){
            this.title = "用户信息";
            showUserInfo = {
              phone: this.form.phone,
              nickName: this.form.nickName,
              password: res.password
            }
          }
          this.$message.success(isEdit ? '编辑成功' : '新增成功')
          this.$refs.myTable.refresh()
          this.clearAll()
          //显示弹窗
          if(!isEdit){
            this.showUserInfo = showUserInfo;
            this.passwordDialogVisible = true;
          }
        } finally {
          this.subLoading = false
        }
      })
    },
    handleClose() {
      this.clearAll()
    },
    clearAll() {
      this.form = this.$_.cloneDeep(FORM)
      if(this.$refs['form'])this.$refs['form'].resetFields()
      this.passwordDialogVisible = false;
      this.userDialogVisible = false
      this.newPassword = null;
      this.showUserInfo = null;
    },
    //  禁用/启用/删除
    doOperate(id, type) {
      this.$confirm(`是否要${this.operateTxt(type)}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let api = null
          if (type === 'disable') {
            api = 'adminDisableAdmin'
          } else if (type === 'enable') {
            api = 'adminEnableAdmin'
          } else if (type === 'delete') {
            api = 'adminDeleteAdmin'
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
        case 'reset':
          return '重置密码'
        default:
          return val
      }
    },
    async getPermissonTree(){
      let data = await this.$api.permissionQueryPermissionTree({str: null});
      data.map(it=>{
        this.doWhile(it);
      })
      this.table.searchData[4].option = data;
    },
    doWhile(child){
      if(child.childrenNodes && child.childrenNodes.length){
        child['authName'] = child.data.authName;

        child.childrenNodes.map(it=>{
          it['authName'] = it.data.authName;
          this.doWhile(it);
        })
      }else{
        child['authName'] = child.data.authName;
        child.childrenNodes = null;
      }
    },
    //重置
    async doReset(id){
      try{
        let res = await this.$api.adminResetPassword({id})
        this.newPassword = res.password;
        this.title = '重置新密码';
        this.passwordDialogVisible = true;
      }catch(e){}
    }
  }
}
</script>

<style lang="sass" scoped>
.user-form
  .el-select
    width: 100%
.text
  margin-left: 50%
  transform: translateX(-50%)
  text-align: center
.showUserBox
  @include ver
  align-items: center
</style>
