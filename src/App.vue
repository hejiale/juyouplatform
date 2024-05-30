<template>
  <div id="app" class="app">
    <el-container class="app-content" v-if="!isLogin">
      <el-container>
        <!-- 菜单组件 -->
        <base-sidebar @on-select-menu="onSelectMenu" ref="base-sidebar"/>
        <div class="app-content-container">
          <base-header @on-select-tab="onChangeTab" ref="header"/>
          <el-container>
              <baseSubMenu ref="baseSubMenu"/>
              <div class="app-content-container-routerBox">
                <transition mode="out-in" name="el-fade-in-linear">
                  <el-main>
                    <router-view />
                    <!-- <div class="app-bottom__tip">
                      <a href="https://beian.miit.gov.cn/">苏ICP备2021048789号-1</a>
                      ©剧游宇宙（苏州）文化科技发展有限公司
                    </div> -->
                  </el-main>
                </transition>
              </div>
          </el-container>
        </div>
      </el-container>
    </el-container>
    <div class="view" v-else>
      <transition mode="out-in" name="el-fade-in-linear">
        <router-view class="app-body__router" />
      </transition>
    </div>
  </div>
</template>

<script>
import baseHeader from '@partial/header'
import baseSidebar from '@partial/sidebar'
import baseSubMenu from '@partial/sidebar/subMenu'
export default {
  components: {
    baseHeader,
    baseSidebar,
    baseSubMenu
  },
  data() {
    return {
      currentMenu: null
    }
  },
  created(){
    let vm = this;

    window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))

    this.$router.beforeEach((to, from, next) => {
      if(!sessionStorage.getItem("user")){
        next();
        return;
      }
      //保存路由路径
      let urls = sessionStorage.getItem("urls");
      if(urls){
        urls = JSON.parse(urls);
      }else{
        urls = [];
      }
      //对第三级子菜单做去重处理
      if(to.meta.parentPath){
        let index = urls.findIndex(it=>it.path === to.path);
        
        if(index !== -1){
          urls.splice(index, 1, {
            fullPath: to.fullPath,
            meta: to.meta,
            name: to.name,
            params: to.params,
            path: to.path,
            query: to.query
          });
        }
      }
      //判断是否已存在 
      let index = urls.findIndex(it=>it.path === to.path);
      if(index === -1){
        urls.push({
          fullPath: to.fullPath,
          meta: to.meta,
          name: to.name,
          params: to.params,
          path: to.path,
          query: to.query
        });
      }
      sessionStorage.setItem('urls', JSON.stringify(urls));
      //刷新菜单
      if(this.$refs.header)this.$refs.header.refresh(to.path);

      const { menuList } = JSON.parse(sessionStorage.getItem("permission"));
      if(menuList){
        let fromPath = from.meta.parentPath ? from.meta.parentPath: from.path;
        let toPath = to.meta.parentPath ? to.meta.parentPath: to.path;
        let fromIndex = -1;
        let toIndex = -1;

        menuList.map((v)=>{
          if(fromIndex === -1){
            fromIndex = v.permissionList.findIndex(i=>i.path === fromPath)
          }
        })
        menuList.map((v)=>{
          if(toIndex === -1){
            toIndex = v.permissionList.findIndex(i=>i.path === toPath)
          }
        })
        //同时存在
        this.$nextTick(_=>{
          if(fromIndex !== -1 && toIndex !== -1){
            //切换主菜单
            vm.$refs['base-sidebar'].changeMenu(toPath);
            //切换子菜单
            menuList.map((v)=>{
              v.permissionList.map((it)=>{
                if(it.path === toPath){
                  vm.$refs['baseSubMenu'].changeUrl(v, toPath)
                }
              })
            })
          }
        })
      }
    
      next()
    })
  },
  destroyed(){
    window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
  },
  computed: {
    isLogin() {
      return this.$route.name === null || this.$route.name === 'Login'
    }
  },
  methods: {
    onSelectMenu(menu) {
      this.$nextTick(_=>{
        this.$refs['baseSubMenu'].refresh(menu)
      })
    },
    onChangeTab(){
      this.$refs['base-sidebar'].refresh(true);
    },
    beforeunloadHandler(e){
      // e.returnValue = "提示"
    }
  }
}
</script>

<style lang="sass">
.app
  width: 100%
  min-height: 100vh
  //滚动条的滑块
  ::-webkit-scrollbar-thumb
    background-color: rgba(144,147,153,.3)
    border-radius: 5px
  ::-webkit-scrollbar-track
    display: none
  ::-webkit-scrollbar-track-piece
    display: none
  &-content
    height: 100vh
    margin: 0 auto
    &-container
      position: absolute
      left: 114px
      right: 0
      top: 0
      bottom: 0
      @include ver
      background: #fff
      border-top-left-radius: 16px
      overflow: hidden
      &-routerBox
        position: absolute
        left: 118px
        top: 73px
        right: 0
        bottom: 0
        overflow: auto
  .view
    overflow: auto
    position: relative
    width: 100%
    height: 100vh
  &-bottom__tip
    color: #faa21e
    line-height: 25px
    a
      text-decoration: none
      color: #faa21e
      margin: 0 10px
.app::-webkit-scrollbar
  width: 10px !important
  height: 10px !important
  display: block
</style>
