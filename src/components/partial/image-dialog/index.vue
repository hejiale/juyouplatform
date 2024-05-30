<template>
  <el-dialog
    :visible.sync="visible"
    @close="OnClose"
    center
    :key="visibleKey"
    :modal="modal"
  >
    <img :src="dialogImageUrl" alt="" v-if="dialogImageUrl" />
    <div v-else>
      <el-carousel
        :autoplay="false"
        height="600px"
        @change="carouselChange"
        :initial-index="index - 1"
      >
        <el-carousel-item v-for="item in dialogImageUrlList" :key="item">
          <img :src="item" alt="" style="object-fit: contain" />
          <!-- <el-image :src="item" fit="scale-down"></el-image> -->
        </el-carousel-item>
      </el-carousel>
      <div class="bottom-font" v-if="dialogImageUrlList.length > 1">
        {{ index + '/' + dialogImageUrlList.length }}
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogImageUrl: {
      type: String,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    },
    dialogImageUrlList: {
      type: Array,
      default: null
    },
    modal: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      index: 1,
      visibleKey: 1
    }
  },
  methods: {
    OnClose() {
      this.$emit('update:show', false)
    },
    carouselChange(index) {
      this.index = index + 1
    }
  },
  watch: {
    show: {
      immediate: true,
      handler(show) {
        this.visible = show
        if (!show) {
          this.index = 1
          this.$emit('update:dialogImageUrlList', [])
          this.visibleKey = 1
        } else {
          this.visibleKey = 2
        }
      }
    }
  }
}
</script>

<style lang="sass">
.bottom-font
  text-align: center
  font-size: 20px
  margin-top: 10px
</style>
