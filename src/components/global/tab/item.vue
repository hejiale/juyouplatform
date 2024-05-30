<template>
  <div class="yc-tab-item" v-show="isShow">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'TabItemComponent',
  props: ['label', 'value'],
  data () {
    return {
      isShow: false
    }
  },
  watch: {
    label () {
      this.$parent.init()
    }
  }
}
</script>

<style lang="scss" scoped></style>
