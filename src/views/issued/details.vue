<template>
  <div>
    <yc-tab v-model="activeName" backBtnText="返回发行库" @onBack="onBack">
      <yc-tab-item label="基础信息" value="base"> </yc-tab-item>
      <yc-tab-item
        label="团队管理"
        value="team"
        v-if="$powers('/publish/getPublisherTeam')"
      >
      </yc-tab-item>
    </yc-tab>
    <base-info ref="base-info" hideTitle v-if="activeName === 'base'"/>
    <team-manage ref="team-info" v-if="activeName === 'team'"/>
  </div>
</template>

<script>
import baseInfo from './components/edit.vue'
import teamManage from './team-manage'
export default {
  components: {
    baseInfo,
    teamManage
  },
  data() {
    return {
      activeName: this.$route.query.type || 'base'
    }
  },
  activated() {
    if (sessionStorage.getItem('storeActive')) {
      this.activeName = sessionStorage.getItem('storeActive')
    } else {
      this.activeName = this.$route.query.type
    }
    this.loadPage()
  },
  methods:{
    onBack() {
      this.$router.push({
        name: 'issuedInfo'
      })
    },
    loadPage(){
      if(this.activeName === 'base'){
        this.$nextTick(_=>{
          this.$refs['base-info'].refresh();
        })
      }else if(this.activeName === 'team'){
        this.$nextTick(_=>{
          this.$refs['team-info'].initData();
        })
      }
    }
  },
  destroyed() {
    sessionStorage.removeItem('storeActive')
  }
}
</script>

<style scoped></style>
