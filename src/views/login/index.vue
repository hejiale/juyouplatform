<template>
  <div class="login">
    <div class="login-container">
      <div class="login-container-tag"></div>
      <div class="login-container-content">
        <div class="login-container-content-icon"></div>
        <el-form class="login-container-content-form" label-position='left' :model='submit' :rules='rules' ref='form' label-width='0px'>
          <el-form-item prop='accountName' class="input-box">
            <el-input v-model='submit.accountName' placeholder='请输入用户名' clearable>
            </el-input>
          </el-form-item>
          <el-form-item prop='password' class="input-box">
            <el-input type='password' @keyup.enter.native='doLogin'  v-model='submit.password' placeholder='请输入密码' clearable>
            </el-input>
          </el-form-item>
          <el-button type='primary' :loading='logging' @click='doLogin'>{{logging ? '登录中...' : '登录'}}</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        submit: {
          accountName: null,
          password: null
        },
        rules: {
          accountName: [{
            required: true,
            message: '用户名不能为空',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          }]
        },
        logging: false
      }
    },
    mounted(){
      sessionStorage.clear();
    },
    methods: {
      // 登录
      async doLogin () {
        this.$refs.form.validate(async valid => {
          if (!valid) return
          this.logging = true
          try {
            let res = await this.$api.authLogin({
              username: this.submit.accountName,
              password: this.submit.password
            })
  
            this.$notify({
              title: '成功',
              message: '登录成功',
              type: 'success'
            })
            res['accountName'] = this.submit.accountName;
            // sessionStorage.setItem('accountName', this.submit.accountName)
            sessionStorage.setItem('user', JSON.stringify(res))
            sessionStorage.setItem('tokenValue', res.tokenValue)
            
            //根据权限判断登陆成功跳转页面
            let permission = await this.$api.authGetRolesAndPermissions({})
            permission.menuList = permission.menuList.filter(v=>v.permissionList.length > 0);
            sessionStorage.setItem('permission', JSON.stringify(permission))

            //处理权限列表，找出第一个有子目录的
            let menuList = permission.menuList.find(v=>v.permissionList.length);
      
            return this.$router.replace({path: menuList.permissionList[0].path});
          } finally {
            this.logging = false
          }
        })
      },
    }
  }
</script>

<!--@formatter:off-->
<style lang="sass">
  .login
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100vh
    @include hor-center-center
    background: url("~@img/login-bg.png") no-repeat left top / 100% 100%
    &-container
      position: relative
      width: 770px
      height: 540px
      &-tag
        position: absolute
        top: 0
        left: 0
        width: 540px
        height: 540px
        background: url("~@img/login-tag-bg.png") no-repeat left top / 100% 100%
      &-content
        position: absolute
        right: 0
        top: 107px
        width: 372px
        height: 358px
        background: #FFFFFF
        border-radius: 10px
        &-icon
          margin: 46px 0 0 36px
          width: 130px
          height: 40px
          background: url("~@img/icon-account.png") no-repeat left top / 100% 100%
        &-form
          @include ver
          align-items: center
          margin-top: 22px
          .el-input__inner
            width: 300px
            height: 48px
            background-color: #F6F8F9 !important
            border-radius: 8px
            border-width: 0
          .el-button
            margin-top: 40px
            width: 300px
            height: 48px
            border-radius: 8px
            font-size: 14px
    // &-content
    //   display: flex
    //   width: 1060px
    //   height: 600px
    //   position: absolute
    //   left: 50%
    //   top: 50%
    //   transform: translate(-50%, -50%)
    //   border-radius: 27px
    //   overflow: hidden
    //   &__lf
    //     flex: 1
    //     @include hor-center-center
    //     background-color: $primaryColor
    //     img
    //       width: 427px
    //       height: 285px
    //   &__rt
    //     flex: 1
    //     padding: 131px 45px 0 45px
    //     background-color: #FFF
    // &-text
    //   font-size: 36px
    //   font-weight: bold
    //   margin-bottom: 40px
    
</style>
