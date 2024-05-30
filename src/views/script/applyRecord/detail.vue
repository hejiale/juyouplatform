<template>
  <div class="content">
    <yc-tab v-model="activeName" backBtnText="返回" @onBack="onBack">
      <yc-tab-item label="题目审核" value="score">
        <scoreAudit />
      </yc-tab-item>
      <yc-tab-item label="订单信息" value="order">
        <order />
      </yc-tab-item>
    </yc-tab>
  </div>
</template>
<script>
import order from './order.vue'
import scoreAudit from './scoreAudit.vue'
export default {
  components: {
    order,
    scoreAudit
  },
  data() {
    return {
      activeName: 'score'
    }
  },
  methods: {
    onBack() {
      this.$router.push({
        name: 'scriptApplyRecord'
      })
    }
  }
}
</script>
<style>
.yc-tab__header{
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}
</style>
<style lang="sass" scoped>
.content
  position: relative
</style>