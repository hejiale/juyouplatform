<template>
  <div>
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="信息" name="basicInformation"><add /></el-tab-pane>
      <el-tab-pane label="票房本配置" name="boxOffice" v-if="isBoxOffice"><boxOffice ref="boxOffice"/></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import add from './components/add.vue'
import boxOffice from './components/boxOffice.vue'
export default {
  components: {
    add,
    boxOffice
  },
  data() {
    return {
      activeName: 'basicInformation',
      isBoxOffice: false
    }
  },
  watch:{
    activeName(val){
      if(val === 'boxOffice'){
        this.$nextTick(_=>{
          this.$refs.boxOffice.refresh();
        })
      }
    }
  },
  activated() {
    this.activeName = "basicInformation";
    this.isBoxOffice = Boolean(this.$route.query.isBoxOffice)
  }
}
</script>
<style></style>
