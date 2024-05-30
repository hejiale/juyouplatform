<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="安卓" name="android">
        <android />
      </el-tab-pane>
      <el-tab-pane label="IOS" name="ios">
        <ios />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import android from './android.vue'
import ios from './ios.vue'
export default {
  components: {
    android,
    ios
  },
  data() {
    return {
      activeName: 'android'
    }
  },
  methods:{
    handleClick(tab){
      this.activeName = tab.name;
    }
  }
}
</script>

<style></style>
