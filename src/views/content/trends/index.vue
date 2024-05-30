<template>
  <div>
    <el-radio-group v-model="radio">
      <el-radio-button label="当前线上"></el-radio-button>
      <el-radio-button label="历史记录"></el-radio-button>
    </el-radio-group>
    <yc-table :table="table" ref="myTable" :showPageSize="false">
      <template slot="user" slot-scope="props">
        {{
          props.activityPromotion
            ? $enums.JumpType.getName(props.activityPromotion.jumpType)
            : ''
        }}
      </template>
      <template slot="operation" slot-scope="props">
        <el-button
          type="text"
          @click="doDelete(props)"
          v-if="
            $powers('/userDynamicCircle/updateDynamicApplyStatus') &&
            radio === '当前线上'
          "
          >{{ radio === '当前线上' ? '删除动态' : '恢复动态' }}</el-button
        >
        <span v-else>
          {{ props.updatedTime }}
        </span>
      </template>
      <template slot="action" slot-scope="props">
        <el-button
          type="text"
          @click="doRecommd(props)"
          v-if="
            $powers('/userDynamicCircle/updateDynamicApplyStatus') &&
            radio === '当前线上'
          "
          >{{
            props.recommendPosition === 'ENABLE' ? '撤销首页推荐' : '推荐到首页'
          }}</el-button
        >
        <el-button
          type="text"
          @click="doDelete(props)"
          v-if="
            $powers('/userDynamicCircle/updateDynamicApplyStatus') &&
            radio === '历史记录'
          "
          >{{ radio === '当前线上' ? '删除动态' : '恢复动态' }}</el-button
        >
      </template>
    </yc-table>
  </div>
</template>
<script>
export default {
  data(vm) {
    return {
      radio: '当前线上',
      table: {
        api: this.$api.queryManageDynamicPage,
        query: {
          isDelete: false
        },
        columns: [
          {
            title: '发布人',
            key: 'nickName'
          },
          {
            title: '发布时间',
            key: 'createDate'
          },
          {
            title: '评价内容',
            width: 100,
            key: 'content',
            showTooltip: true
          },
          {
            title: '评价图片',
            key: 'fileList',
            isImage: true
          },
          {
            title: '关联对象',
            width: 100,
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.user(ctx.row))
            }
          },
          {
            title: '关联的内容',
            width: 100,
            showTooltip: true
          },
          {
            title: '操作',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.operation(ctx.row))
            }
          },
          {
            title: '操作',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      }
    }
  },
  watch: {
    radio() {
      if (this.radio === '当前线上') {
        this.table.query.isDelete = false
        this.table.columns[6].title = '操作'
      } else {
        this.table.query.isDelete = true
        this.table.columns[6].title = '删除时间'
      }
      this.$refs.myTable.refresh()
    }
  },
  methods: {
    doDelete(props) {
      this.$confirm(`确定${props.isDelete ? '恢复':'删除'}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await this.$api.updateDynamicApplyStatus({
            userDynamicId: props.id,
            isDelete: props.isDelete ? false: true
          })
          this.$refs.myTable.refresh()
        } catch (e) {
          console.log(e)
        }
      })
    },
    async doRecommd(props) {
      try {
        await this.$api.updateDynamicApplyStatus({
          userDynamicId: props.id,
          recommendPosition:
            props.recommendPosition === 'ENABLE' ? 'DISABLE' : 'ENABLE'
        })
        this.$refs.myTable.refresh()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>