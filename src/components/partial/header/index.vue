<template>
  <div class="header">
    <div class="header-lf">
      <el-tabs v-model="editableTabsValue" type="card" :closable="menus.length > 1 ? true: false" style="width: 60vw" @tab-click="onSelectMenu" @tab-remove="onClosePage">
        <el-tab-pane
          v-for="menu in menus"
          :key="menu.path"
          :name="menu.path"
          :label="menu.meta.breadcrumb[0].label"
        >
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="header-rt">
      <div class="header-user">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{ user.accountName
            }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="updatePwd">修改密码</el-dropdown-item>
            <el-dropdown-item command="out">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      title="修改密码"
      width="600px"
      center
    >
      <dialogContent
        :isLoading="loading"
        :sureText="loading ? '修改中...' : '提交'"
        @on-cancel="dialogVisible = false"
        @on-sure="updatePassword"
      >
        <template slot="content">
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            label-position="right"
            label-width="150px"
          >
            <el-form-item prop="oldPassword" label="旧密码">
              <el-input
                v-model="form.oldPassword"
                placeholder="请输入旧密码"
                show-password
                style="width: 320px"
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="newPassword" label="新密码">
              <el-input
                v-model="form.newPassword"
                placeholder="8位以上须包含大小写字母，数字和特殊符号"
                show-password
                style="width: 320px"
                minlength="8"
                maxlength="15"
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="confirmPassword" label="再次输入新密码">
              <el-input
                v-model="form.confirmPassword"
                placeholder="请再次输入新密码"
                show-password
                style="width: 320px"
                minlength="8"
                maxlength="15"
              >
              </el-input>
            </el-form-item>
          </el-form>
        </template>
      </dialogContent>
    </el-dialog>
  </div>
</template>
<script>
import validator from '@utils/validator'
import dialogContent from '@global/dialog'
export default {
  components: {
    dialogContent
  },
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入8位以上须包含大小写字母，数字和特殊符号'))
      } else if (value === this.form.oldPassword) {
        callback(new Error('旧密码与新密码输入一致，请重新输入!'))
      } else {
        callback()
      }
    }
    return {
      dialogVisible: false,
      user: null,
      loading: false,
      form: {
        oldPassword: null,
        newPassword: null
      },
      rules: {
        oldPassword: validator.notEmpty('旧密码'),
        newPassword: [
          validator.notEmpty('8位以上须包含大小写字母，数字和特殊符号'),
          validator.strongPassword,
          { validator: validatePass, trigger: 'blur' }
        ],
        confirmPassword: [
          validator.notEmpty('确认密码'),
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      menus: [],
      editableTabsValue: null
    }
  },
  created() {
    if(!sessionStorage.getItem('user')){
      this.$router.replace({ name: 'Login' })
      return;
    }
    this.user = JSON.parse(sessionStorage.getItem('user'))
    this.form.adminId = this.user.loginId
    this.refresh()
  },
  computed: {
    isSelect() {
      return function (menu) {
        if (this.$route.path === menu.path) {
          return true
        }
        return false
      }
    }
  },
  methods: {
    refresh(path) {
      if(!path)path = this.$route.path;

      this.menus = JSON.parse(sessionStorage.getItem('urls'))
    
      this.$nextTick(_=>{
        this.editableTabsValue = path;
      })
    },
    onClose() {
      this.$refs.form.clearValidate()
      this.$refs.form.resetFields()
    },
    onClosePage(event) {
      let path;
      let urls = JSON.parse(sessionStorage.getItem('urls'))
      let index = urls.findIndex((it) => it.path === event)

      if (urls[index].path === this.$route.path) {
        if (index > 0) {
          let nextMenu = urls[index - 1]
          path = nextMenu.path
          this.$router.push({ path: nextMenu.path, query: nextMenu.query })
        } else {
          let nextMenu = urls[index + 1]
          this.$router.push({ path: nextMenu.path, query: nextMenu.query })
          path = nextMenu.path
        }
      }
      urls.splice(index, 1)
      sessionStorage.setItem('urls', JSON.stringify(urls))
      //刷新
      this.refresh(path)
    },
    updatePassword() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        this.loading = true
        try {
          await this.$api.adminUpdatePassword({...this.form, adminId: JSON.parse(sessionStorage.getItem('user')).loginId})

          sessionStorage.clear()
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.$router.replace({ name: 'Login' })
        } finally {
          this.loading = false
        }
      })
    },
    async handleCommand(command) {
      if (command === 'out') {
        await this.$api.authLogout({})
        sessionStorage.clear()
        this.$router.replace({ name: 'Login' })
        this.$message.success('退出成功')
      } else if (command === 'updatePwd') {
        this.dialogVisible = true
        this.$nextTick(_=>{
          this.form = {
            oldPassword: null,
            newPassword: null
          }
          this.$refs.form.clearValidate();
        })
      }
    },
    onSelectMenu(event) {
      if (event.name === this.$route.path) return
      
      let index = this.menus.findIndex(it=> it.path === event.name)

      this.$router.push({ path: this.menus[index].path, query: this.menus[index].query})
    }
  }
}
</script>
<style>
.el-tabs__header{
  border-bottom: none !important;
}
</style>
<style lang='sass'>
.header
  @include hor
  width: 100%
  background: #fff
  border-bottom: 1px solid #EEEEEE
  height: 73px
  position: relative
  &-lf
    position: absolute
    left: 118px
    bottom: 0px
    width: 60vw
    height: 30px
    @include hor
    align-items: center
    // &-arrowLeft
    //   position: absolute
    //   left: 0
    //   @include hor-center-center
    //   cursor: pointer
    // &-arrowRight
    //   position: absolute
    //   right: 0
    //   @include hor-center-center
    //   cursor: pointer
    // &-menuBox
    //   position: absolute
    //   left: 20px
    //   right: 20px
    //   bottom: 0px
    //   @include hor
    //   align-items: center
    //   overflow: hidden
    //   white-space: nowrap
    //   &-menu
    //     @include hor
    //     align-items: center
    //     cursor: pointer
    //     height: 30px
    //     font-size: 14px
    //     font-family: OPPOSans-Regular, OPPOSans
    //     font-weight: 400
    //     color: #000
    //     background: #F3F3F3
    //     line-height: 30px
    //     padding: 0 10px
    //     margin-right: 1px
    //   .select
    //     background: #0052D9
    //     color: #fff
  &-rt
    position: absolute
    right: 0
    top: 30px
  &-user
    @include hor-start-center
    margin-right: 40px
    img
      @include circle(28px)
      margin-right: 12px
    .el-dropdown-link
      cursor: pointer
</style>
