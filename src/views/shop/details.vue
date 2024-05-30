<template>
  <div>
    <yc-tab v-model="activeName" backBtnText="返回店铺" @onBack="onBack">
      <yc-tab-item label="店铺详情" value="base"></yc-tab-item>
      <yc-tab-item label="团队管理" value="team"></yc-tab-item>
      <yc-tab-item label="店铺剧本" value="script"></yc-tab-item>
      <yc-tab-item label="店铺评价" value="evaluate"></yc-tab-item>
      <!-- <yc-tab-item
      label="剧本信息"
      value="script"
      v-if="$powers('shopInfo-scriptInfo-view')"
    >
      <script-info />
    </yc-tab-item>
    <yc-tab-item label="组局信息" value="brueau">
      <brueauInfo />
    </yc-tab-item>
    <yc-tab-item label="剧本票房" value="ticket">
      <ticketInfo />
    </yc-tab-item>
    <yc-tab-item label="同城店铺" value="local">
      <localInfo />
    </yc-tab-item> -->
    </yc-tab>
    <base-info hideTitle ref="base-info" v-if="activeName === 'base'" />
    <team-info ref="team-info" v-if="activeName === 'team'" />
    <script-info ref="script-info" v-if="activeName === 'script'" />
    <evaluate ref="evaluate" v-if="activeName === 'evaluate'"/>
  </div>
</template>

<script>
import baseInfo from './components/editShop.vue'
import teamInfo from './teams'
import scriptInfo from './script-info'
import evaluate from './evaluate.vue'
// import brueauInfo from './brueauInfo'
// import ticketInfo from './ticketOffice.vue'
// import localInfo from './localCityShop.vue'
export default {
  components: {
    baseInfo,
    teamInfo,
    scriptInfo,
    evaluate
    // brueauInfo,
    // ticketInfo,
    // localInfo
  },
  data() {
    return {
      activeName: this.$route.query.type || 'base'
    }
  },
  watch: {
    activeName() {
      this.loadPage()
    }
  },
  activated() {
    if (sessionStorage.getItem('storeActive')) {
      this.activeName = sessionStorage.getItem('storeActive')
      sessionStorage.removeItem('storeActive')
    } else {
      this.activeName = this.$route.query.type
    }
    this.loadPage()
  },
  methods: {
    onBack() {
      this.$router.push({
        name: 'shopInfo'
      })
    },
    loadPage() {
      if (this.activeName === 'base') {
        this.$nextTick((_) => {
          this.$refs['base-info'].initDetailData()
        })
      } else if (this.activeName === 'team') {
        this.$nextTick((_) => {
          this.$refs['team-info'].refresh()
        })
      } else if (this.activeName === 'script') {
        this.$nextTick((_) => {
          this.$refs['script-info'].refresh()
        })
      } else if (this.activeName === 'evaluate') {
        this.$nextTick((_) => {
          this.$refs['evaluate'].refresh()
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
