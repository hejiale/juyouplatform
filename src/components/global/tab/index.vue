<template>
  <div class="yc-tab">
    <div class="yc-tab__header">
      <ul class="yc-tab__header-nav">
        <li
          v-for="(item, idx) in labelList"
          :key="idx"
          :class="{ 'is-active': currentValue === item.value }"
          @click="doCheck(item)"
        >
          {{ item.label }}
        </li>
      </ul>
      <template v-if="backBtnText && backBtnText !== 'btn-slot'">
        <el-button type="primary" @click="onBack">{{ backBtnText }}</el-button>
      </template>
      <template v-if="backBtnText && backBtnText === 'btn-slot'">
        <slot name="btn-slot"></slot>
      </template>
    </div>
    <div class="tab__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import vModel from '@/mixins/v-model'
export default {
  mixins: [vModel],
  props: {
    backBtnText: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      labelList: [],
      active: null
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.$children = this.$children.filter(
        (child) => child.$options.name === 'TabItemComponent'
      )
      this.labelList = []
      this.$children.map((v) => {
        if (v.label) {
          this.labelList.push({
            label: v.label,
            value: v.value
          })
        }
        if (v.value === this.currentValue) v.isShow = true
      })
    },
    doCheck(row) {
      this.currentValue = row.value
      this.$children.forEach((v) => {
        v.isShow = false
        if (v.value === row.value) v.isShow = true
      })
    },
    onBack() {
      this.$emit('onBack')
    }
  }
}
</script>

<style lang="sass">
.yc-tab
  &__header
    @include hor-between-center
    background-color: #fff
    padding: $primaryGap
    margin-bottom: 20px
    &-nav
      @include hor-start-center
      li
        padding: 8px 12px
        background-color: #F2F2F2
        color: #8C9AA3
        cursor: pointer
        &.is-active
          background-color: $primaryColor
          color: #fff
</style>
