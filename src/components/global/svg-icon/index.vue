<template functional>
  <svg
    class="svg-icon"
    :class="'svg-icon-' + props.name"
    aria-hidden="true"
    v-on="$listeners"
  >
    <use :xlink:href="'#icon-' + props.name" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIconComponent'
}
</script>

<style lang="sass">
.svg-icon
  width: 20px
  height: 20px
  vertical-align: middle
  fill: currentColor
  overflow: hidden
</style>
