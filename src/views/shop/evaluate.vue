<template>
  <div>
    <el-radio-group v-model="radio">
      <el-radio-button label="当前评价"></el-radio-button>
      <el-radio-button label="历史记录"></el-radio-button>
    </el-radio-group>
    <yc-table :table="table" ref="myTable" :isAutoLoad="false">
      <template slot="dm" slot-scope="props">
        {{ props.dmuserInfo ? props.dmuserInfo.nickName : '' }}
      </template>
      <template slot="drama" slot-scope="props">
        {{ props.dramaDetailVo ? props.dramaDetailVo.dramaName : '' }}
      </template>
      <template
        slot="attachments"
        slot-scope="props"
        v-if="props.attachments && props.attachments.length"
      >
        <div class="coverBox" @click="onPreView(props.attachments)">
          <el-image :src="props.attachments[0].fileUrl" fit="cover"></el-image>
          <div class="numBox" v-if="props.attachments.length > 1">
            +{{ props.attachments.length }}
          </div>
        </div>
      </template>
      <template slot="action" slot-scope="props" v-if="radio === '当前评价'">
        <el-button type="text" @click="doDelete(props.id)">删除</el-button>
      </template>
    </yc-table>
    <image-dialog
        :show.sync="dialogImageVisible"
        :dialogImageUrl="dialogImageUrl"
        :dialogImageUrlList="dialogImageUrlList"
      />
  </div>
</template>

<script>
import ImageDialog from '@partial/image-dialog'
export default {
  components:{
    ImageDialog
  },
  data(vm) {
    return {
      radio: '当前评价',
      table: {
        api: this.$api.evaluatePageList,
        query: {
          statusEnum: 'ENABLE',
          storeId: this.$route.query.id
        },
        columns: [
          {
            title: '评价人',
            key: 'nickName',
            showTooltip: true
          },
          {
            title: '时间',
            key: 'updatedTime'
          },
          {
            title: '来源',
            key: 'evaluationSource',
            enumType: 'EvaluateSourceType'
          },
          {
            title: '基本评价',
            key: 'summarizeEvaluate',
            enumType: 'EvaluateType'
          },
          {
            title: '环境',
            key: 'environmentScore'
          },
          {
            title: '服务',
            key: 'serviceScore'
          },
          {
            title: 'DM',
            key: 'dmScore'
          },
          {
            title: '评语',
            key: 'comment',
            showTooltip: true
          },
          {
            title: '配图',
            render(h, ctx) {
              return h(
                'div',
                vm.$refs.myTable.$scopedSlots.attachments(ctx.row)
              )
            }
          },
          {
            title: '关联的DM',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.dm(ctx.row))
            },
            showTooltip: true
          },
          {
            title: '关联的剧本',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.drama(ctx.row))
            },
            showTooltip: true
          },
          {
            title: '操作',
            width: '200px',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      },
      dialogImageVisible: false,
      dialogImageUrl: null,
      dialogImageUrlList: []
    }
  },
  watch: {
    radio() {
      this.table.query.statusEnum =
        this.radio === '当前评价' ? 'ENABLE' : 'DISABLE'
      this.$refs.myTable.refresh()
    }
  },
  methods: {
    refresh() {
      this.$nextTick((_) => {
        this.$refs.myTable.refresh()
      })
    },
    doDelete(id) {
      this.$confirm(`确定删除吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await this.$api.evaluateEdit({
            id,
            status: 'DISABLE'
          })
          this.$refs.myTable.refresh()
        } catch (e) {}
      })
    },
    onPreView(list){
      this.dialogImageUrl = null;
      this.dialogImageUrlList = [];

      if(list.length === 1){
        this.dialogImageUrl = list[0].fileUrl;
      }else{
        this.dialogImageUrlList = list.map(v=>v.fileUrl);
      }
      this.dialogImageVisible = true;
    }
  }
}
</script>

<style lang="sass" scoped>
.coverBox
  position: relative
  width: 100px
  height: 100px
  cursor: pointer
  .numBox
    @include abscenter
    background: rgba(0, 0, 0, 0.5)
    z-index: 1
    color: #fff
    font-size: 20px
    @include hor-center-center
</style>
