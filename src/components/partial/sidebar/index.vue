<template>
  <div class="m-sidebar">
    <div class="logo">
      <img src="@img/logo.png" alt="" />
    </div>
    <div class="m-sidebar-menuBox">
      <div
        class="m-sidebar-menuBox-menu"
        v-for="(item, index) in menuList"
        :key="index"
        :class="menuSelect === index ? 'select' : ''"
        @click="onClickMenu(item, index)"
      >
        <yc-svg-icon
          :name="item.icon + '-select'"
          v-if="menuSelect === index"
        ></yc-svg-icon>
        <yc-svg-icon :name="item.icon" v-else></yc-svg-icon>
        <span
          :style="menuSelect === index ? 'color: #fff' : 'color: #737F93'"
          >{{ item.authName }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      menuList: [],
      menuSelect: 0
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    onClickMenu(item, index) {
      this.menuSelect = index
      this.$router.push({ path: item.permissionList[0].path })
      sessionStorage.setItem('subMenu', item.permissionList[0].path)
      this.$emit('on-select-menu', item)
    },
    //点击菜单切换
    refresh(isInit) {
      let { menuList } = JSON.parse(sessionStorage.getItem('permission'))
    
      if (!menuList || menuList.length === 0)
        return this.$router.replace({ name: 'Login' })
      this.menuList = menuList

      if (isInit) {
        this.menuSelect = 0
        this.$router.push({ path: menuList[0].permissionList[0].path })
        sessionStorage.setItem('subMenu', menuList[0].permissionList[0].path)
        this.$emit('on-select-menu', menuList[0])
      } else {
        let index = -1

        menuList.map((v, idx) => {
          v.permissionList.map((i) => {
            if (i.path === this.$route.path) {
              index = idx
            }
          })
        })
        if (index === -1) {
          menuList.map((v, idx) => {
            v.permissionList.map((i) => {
              if (i.path === sessionStorage.getItem('subMenu')) {
                index = idx
              }
            })
          })
        }

        this.menuSelect = index
        this.$emit('on-select-menu', menuList[index])
      }
    },
    //路由切换动作
    changeMenu(url) {
      if(!sessionStorage.getItem('permission'))return;
      
      const { menuList } = JSON.parse(sessionStorage.getItem('permission'))
      if (!menuList || menuList.length === 0)
        return this.$router.replace({ name: 'Login' })

      menuList.map((v, idx) => {
        v.permissionList.map((it) => {
          if (it.path === url) {
            this.menuSelect = idx
            sessionStorage.setItem('subMenu', url)
          }
        })
      })
    }
  }
}
</script>
<style lang="sass">
.m-sidebar
  background: url('../../../assets/images/leftMenu-bg.png')
  background-size: 100% 100%
  background-repeat: no-repeat
  width: 130px
  overflow: auto
  height: 100vh
  padding-bottom: 20px
  &-menuBox
    @include ver
    &-menu
      margin-left: 30px
      margin-top: 26px
      @include hor
      align-items: center
      cursor: pointer
      span
        margin-left: 6px
        font-size: 14px
        font-family: PingFang SC-Regular, PingFang SC
        font-weight: 400
        line-height: 16px
    .select
      background: url('../../../assets/images/menu-selectBox.png')
      background-size: 100% 100%
      background-repeat: no-repeat
      width: 94px
      height: 76px
      margin-left: 20px
      margin-top: 0
      padding-left: 10px
.logo
  margin-left: 30px
  margin-top: 20px
  img
    width: 54px
    height: 54px
</style>
