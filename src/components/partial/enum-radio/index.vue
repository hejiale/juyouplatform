<template>
  <el-radio-group v-model="radioVal" :disabled="disabled">
    <el-radio :label="item.value"  v-for="item in $enums[enumType].list" :key="item.value">{{item.label}}</el-radio>
  </el-radio-group>
</template>

<script>
export default {
  props: {
    value: {
      required: true,
      default: null
    },
    enumType: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    radioVal: {
      get () {
        return this.value
      },
      set (newVal) {
        this.$emit('update:value', newVal)
      }
    }
  }

}
</script>

<style scoped>

</style>
