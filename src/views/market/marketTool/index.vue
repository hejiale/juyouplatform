<template>
  <div class="container">
    <div class="container-title">营销</div>
    <div class="container-box">
      <div class="container-box-menuBox" @click="onGoInfo">
        <div>直接发券</div>
        <p>平台直接发给店铺使用</p>
      </div>
      <div class="container-box-menuBox" @click="onGoInfoAuto">
        <div>自动发券（消费促活）</div>
        <p>满足消费条件发券</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    onGoInfo() {
      this.$router.push({
        name: 'marketToolInfo'
      })
    },
    onGoInfoAuto() {
      this.$router.push({
        name: 'marketToolInfoAuto'
      })
    }
  }
}
</script>
<style lang="sass" scoped>
.container
    width: 87vw
    height: 90vh
    background: #fff
    border-radius: 10px
    &-title
        padding-top: 28px
        margin-left: 28px
        font-size: 24px
        font-weight: 500
    &-box
        display: flex
        &-menuBox
            margin-top: 10px
            width: 240px
            height: 74px
            padding: 10px 20px
            margin-left: 28px
            border-radius: 8px
            border: 1px solid $orange
            @include ver
            align-items: flex-start
            cursor: pointer
            div:nth-child(1)
                text-align: center
                font-size: 16px
                color: $orange
                font-weight: 600
            p:nth-child(2)
                text-align: center
                font-size: 12px
                color: #999
</style>
