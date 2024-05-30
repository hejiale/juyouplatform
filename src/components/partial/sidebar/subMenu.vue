<template>
  <div class="container">
    <!-- <div class="container-title">{{menuInfo.authName}}</div> -->
    <div v-for="permission in menuInfo.permissionList" :key="permission.id" class="container-menuBox" :class="selectUrl === permission.path ? 'select':''" @click="onRoute(permission)">
        <span class="container-menuBox-menu" :class="selectUrl === permission.path ? 'authMenu':''">{{permission.authName}}</span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectUrl: null,
      firstLoad: true,
      menuInfo: {}
    }
  },
  methods:{
    onRoute(permission){
      sessionStorage.setItem('subMenu', permission.path)
      this.selectUrl = permission.path;

      if (permission.path === this.$route.path) return
      this.$router.push({path: permission.path})
    },
    //点击菜单切换
    refresh(menu){
      this.menuInfo = menu;

      if(sessionStorage.getItem('subMenu')){
        this.selectUrl = sessionStorage.getItem('subMenu');
      }else{
        sessionStorage.setItem('subMenu', this.menuInfo.permissionList[0].path);
        this.selectUrl = this.menuInfo.permissionList[0].path;
      }
    },
    //路由切换动作
    changeUrl(menu, url){
      this.menuInfo = menu;
      this.selectUrl = url;
      sessionStorage.setItem('subMenu', url);
    }
  }
}
</script>
<style lang="sass" scoped>
.container
    position: absolute
    left: 0
    top: 73px
    width: 118px
    height: 100vh
    background: #FFFFFF
    @include ver
    align-items: center
    border-right: 1px solid #EEEEEE
    &-title
        margin-top: 27px
        font-size: 20px
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500
        color: #303030
        line-height: 23px
        padding-bottom: 9px
    &-menuBox
        margin-top: 17px
        cursor: pointer
        padding: 8px 11px
        border-radius: 6px
        width: 90%
        &-menu
            font-size: 13px
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400
            color: #737F93
            line-height: 15px
    .select
        background: #F2F7FF
    .authMenu
        font-family: PingFang SC-Medium, PingFang SC
        font-weight: 500
        color: #3978F7

</style>