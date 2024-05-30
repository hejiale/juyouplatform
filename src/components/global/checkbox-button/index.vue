<template>
  <div class="yc-checkbox-button">
    <el-checkbox-group v-model="checkVal" size="medium" :disabled="disabled">
      <el-checkbox-button
        :label="item.id"
        v-for="item in list"
        :key="item.id"
        >{{ item.label }}</el-checkbox-button
      >
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    },
    dictType: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {},
  computed: {
    checkVal: {
      get() {
        return this.value
      },
      set(newVal) {
        let k = []
        let data = null
        newVal.map((e, i) => {
          data = null
          data = this.list.find((m) => m.id === e)
          if (data) {
            k.push(e)
          }
        })
        console.log(k)
        this.$emit('update:value', k)
      }
    }
  }
}
</script>

<style lang="sass">
.yc-checkbox-button
  .el-checkbox-group
    .el-checkbox-button
      margin-right: 24px
    .el-checkbox-button__inner
      border-radius: 4px !important
      border: 1px solid #DCDFE6
    .el-checkbox-button.is-checked.is-disabled
      .el-checkbox-button__inner
        background-color: #F2F6FC
        color: #C0C4CC
    .el-checkbox-button--medium .el-checkbox-button__inner
      padding: 0
      width: 70px
      @include vertical(36px)
</style>
