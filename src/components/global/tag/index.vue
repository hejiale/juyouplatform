<template>
  <div>
    <el-tag
      :key="idx"
      v-for="(tag, idx) in dynamicTags"
      closable
      :disable-transitions="false"
      @close="handleClose(tag, idx)"
    >
      {{ tag }}
    </el-tag>
    <!-- <el-input
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      size="small"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    >
    </el-input> -->
    <el-select
      v-model="inputValue"
      placeholder=""
      v-if="inputVisible"
      filterable
      remote
      class="input-new-tag"
      ref="saveTagInput"
      @change="handleInputConfirm"
      :popper-append-to-body="false"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-button v-else class="button-new-tag" size="small" @click="showInput" type="primary"
      >添加</el-button
    >
    <el-button v-if="inputVisible" class="button-new-tag" size="small" @click="hideInput"
      >取消</el-button
    >
  </div>
</template>

<style lang="sass">
.el-tag + .el-tag
  margin-left: 10px

.button-new-tag
  margin-left: 10px !important
  height: 32px
  line-height: 30px
  padding-top: 0
  padding-bottom: 0

.input-new-tag
  width: 90px !important
  margin-left: 10px
  vertical-align: bottom
  .el-input
    width: 90px !important
</style>

<script>
export default {
  data () {
    return {
      inputVisible: false
    //   states: ["Alabama", "Alaska", "Arizona",
    //     "Arkansas", "California", "Colorado",
    //     "Connecticut", "Delaware", "Florida",
    //     "Georgia", "Hawaii", "Idaho", "Illinois",
    //     "Indiana", "Iowa", "Kansas", "Kentucky",
    //     "Louisiana", "Maine", "Maryland",
    //     "Massachusetts", "Michigan", "Minnesota",
    //     "Mississippi", "Missouri", "Montana",
    //     "Nebraska", "Nevada", "New Hampshire",
    //     "New Jersey", "New Mexico", "New York",
    //     "North Carolina", "North Dakota", "Ohio",
    //     "Oklahoma", "Oregon", "Pennsylvania",
    //     "Rhode Island", "South Carolina",
    //     "South Dakota", "Tennessee", "Texas",
    //     "Utah", "Vermont", "Virginia",
    //     "Washington", "West Virginia", "Wisconsin",
    //     "Wyoming"]
    }
  },
  props: {
    dynamicTags: {
      type: Array,
      default: []
    },
    options: {
      type: Array,
      default: []
    },
    inputValue: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClose (tag, idx) {
      console.log(tag)
      this.dynamicTags.splice(idx, 1)
      this.$emit('update:dynamicTags', this.dynamicTags)
    },

    showInput () {
      this.inputVisible = true
      this.$nextTick((_) => {
        // this.$refs.saveTagInput.$refs.input.focus();
      })
    },
    hideInput () {
        this.inputVisible = false
    },
    remoteMethod (query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            this.loading = false
            this.options = this.options.filter(item => {
              return item.label.toLowerCase()
                .indexOf(query.toLowerCase()) > -1
            })
          }, 200)
        } else {
          this.options = []
        }
      },

    handleInputConfirm (index) {
      console.log(index)
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.$emit('update:inputValue', this.inputValue)
    }
  }
}
</script>
