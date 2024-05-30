<template>
  <div class="yc-radio">
    <el-radio-group>
      <el-radio :label="itme.value"  v-for="itme in $enums[enumName].list" :key="itme.value">{{itme.label}}</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
import vModel from '@/mixins/v-model'
export default {
  mixins: [vModel],
  props: {
    value: {
      type: Object,
      default: null
    },
    enumName: {
      type: String,
      default: null
    }
  },
  methods: {

  }
}
</script>

<style lang="sass">
  .yc-radio

</style>
