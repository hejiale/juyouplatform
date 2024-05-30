<template>
  <div>
    <el-radio-group v-model="radio" class="mb20">
      <el-radio-button label="当前热本"></el-radio-button>
      <el-radio-button label="全部记录"></el-radio-button>
    </el-radio-group>
    <yc-table
      :table="table"
      ref="myTable"
      :hideTableTitle="true"
      :isShowPagination="radio === '当前热本' ? false : true"
    >
      <template slot="buttons">
        <div class="base-topBtn">
          <el-button type="primary" @click="doAdd">新增热本</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="onRefresh"
            >刷新</el-button
          >
        </div>
      </template>
      <template slot="dicts" slot-scope="props">
        <span v-for="(item, idx) in props" :key="idx" class="textTable">
          <template v-if="idx === props.length - 1">{{
            item.dictValue
          }}</template>
          <template v-else>{{ item.dictValue }}、</template>
        </span>
      </template>
      <template slot="gameTime" slot-scope="props">
        {{ props.gameTime }}小时
      </template>
      <template slot="gamer" slot-scope="props">
        {{
          props.minGamerNum === props.maxGamerNum
            ? `${props.minGamerNum}`
            : `${props.minGamerNum}~${props.maxGamerNum}`
        }}人({{ props.maleGamerNum }}男{{ props.femaleGamerNum }}女)
      </template>
      <template slot="action" slot-scope="props" v-if="radio === '当前热本'">
        <el-button type="text" @click="doDelete(props)" class="reject"
          >删除</el-button
        >
      </template>
      <template slot="store" slot-scope="props">
        <el-button type="text" @click="doLookStore(props)">查看</el-button>
      </template>
      <template slot="gather" slot-scope="props">
        <el-button type="text" @click="doLookGather(props)">查看</el-button>
      </template>
      <template slot="gatherCount" slot-scope="props">
        {{ props.completeGatherCount || 0 }}场
      </template>
      <template slot="avgEvaluateScore" slot-scope="props">
        {{ props.avgEvaluateScore || 0 }}分
      </template>
      <template slot="updateScore" slot-scope="props">
        <el-input v-model="props.sumScore" @blur="onUpdateScore(props)" :disabled="radio !== '当前热本'"/>
      </template>
    </yc-table>
    <el-dialog
      :visible.sync="addShowDialog"
      title="新增剧本"
      center
      width="400px"
      :show-close="false"
    >
      <dialogContent
        @on-cancel="handleClose"
        @on-sure="doSubmit"
        sureText="保存"
      >
        <template slot="content">
          <el-form ref="form" label-position="left">
            <el-form-item label="剧本名称：">
              <el-select
                v-model="dramaId"
                filterable
                remote
                reserve-keyword
                placeholder="请输入剧本关键字查询..."
                :remote-method="remoteMethod"
              >
                <el-option
                  ref="option"
                  v-for="item in options"
                  :key="item.id"
                  :label="item.dramaName"
                  :value="item.id"
                  :disabled="item.popularRecommendPosition === 'ENABLE'"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
      </dialogContent>
    </el-dialog>
    <el-dialog
      :visible.sync="storeShowDialog"
      title="可玩店铺"
      center
      width="800px"
      :show-close="false"
    >
      <yc-table :table="storeTable" ref="storeTable" :isAutoLoad="false">
        <template slot="city" slot-scope="props">
          <span>{{ props.provinceName }}{{ props.cityName }}</span>
        </template>
      </yc-table>
    </el-dialog>
    <el-dialog
      :visible.sync="gatherShowDialog"
      title="正在组局"
      center
      width="800px"
      :show-close="false"
    >
      <yc-table :table="gatherTable" ref="gatherTable" :isAutoLoad="false">
      </yc-table>
    </el-dialog>
  </div>
</template>

<script>
import dialogContent from '@global/dialog'
export default {
  components: {
    dialogContent
  },
  data(vm) {
    return {
      radio: '当前热本',
      addShowDialog: false,
      storeShowDialog: false,
      gatherShowDialog: false,
      table: {
        api: this.$api.popularList,
        query: {
          type: 1
        },
        columns: [
          {
            title: '剧本封面',
            width: 140,
            key: 'dramaCover',
            isImage: true
          },
          {
            title: '剧本名称',
            key: 'dramaName',
            showTooltip: true
          },
          {
            title: '标签',
            render(h, ctx) {
              return h(
                'div',
                vm.$refs.myTable.$scopedSlots.dicts(ctx.row.dicts)
              )
            },
            showTooltip: true
          },
          {
            title: '类型',
            key: 'sellType',
            enumType: 'SellType'
          },
          {
            title: '人数',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.gamer(ctx.row))
            }
          },
          {
            title: '时长',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.gameTime(ctx.row))
            }
          },
          {
            title: '评分',
            render(h, ctx) {
              return h(
                'div',
                vm.$refs.myTable.$scopedSlots.avgEvaluateScore(ctx.row)
              )
            }
          },
          {
            title: '已组局',
            render(h, ctx) {
              return h(
                'div',
                vm.$refs.myTable.$scopedSlots.gatherCount(ctx.row)
              )
            }
          },
          {
            title: '可玩店铺',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.store(ctx.row))
            }
          },
          {
            title: '正在组局',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.gather(ctx.row))
            }
          },
          {
            title: '真实热度值',
            key: 'aggPopularScore'
          },
          {
            title: '修改后热度值',
            render(h, ctx) {
              return h(
                'div',
                vm.$refs.myTable.$scopedSlots.updateScore(ctx.row)
              )
            }
          },
          {
            title: '操作',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      },
      storeTable: {
        api: this.$api.storeJoinSearchPage,
        query: {},
        columns: [
          {
            title: '店铺编号',
            key: 'storeNumber',
          },
          {
            title: '店铺名称',
            key: 'storeName'
          },
          {
            title: '门店LOGO',
            key: 'storeLogo',
            isImage: true
          },
          {
            title: '所在城市',
            render(h, ctx) {
              return h('div', vm.$refs.storeTable.$scopedSlots.city(ctx.row))
            },
            showTooltip: true
          },
          {
            title: '详细地址',
            key: 'address',
            showTooltip: true,
          }
        ]
      },
      gatherTable: {
        api: this.$api.gatherJoinSearchPage,
        query: {},
        columns: [
          {
            title: '剧本名称',
            key: 'dramaName',
          },
          {
            title: '店铺名/店铺ID',
            key: 'storeName',
            showTooltip: true
          },
          {
            title: '组团号',
            key: 'gatheringNo',
          },
          {
            title: '开场时间',
            key: 'gameStartTime',
          }
        ]
      },
      options: [],
      dramaId: null
    }
  },
  watch: {
    radio() {
      this.$nextTick((_) => {
        if(this.radio === '当前热本'){
          this.table.api = this.$api.popularList;
          this.table.query.type = 1;
        }else{
          this.table.api = this.$api.removeShelvesDramaPage;
          this.table.query = {};
        }
        this.$refs.myTable.refresh()
      })
    }
  },
  mounted() {
  },
  methods: {
    doLookStore(v) {
      this.storeTable.query.dramaId = v.id
      this.storeShowDialog = true
      this.$nextTick((_) => {
        this.$refs.storeTable.refresh()
      })
    },
    doLookGather(v) {
      this.gatherTable.query.dramaId = v.id
      this.gatherShowDialog = true
      this.$nextTick((_) => {
        this.$refs.gatherTable.refresh()
      })
    },
    onRefresh() {
      this.$refs.myTable.refresh()
    },
    async onUpdateScore(v) {
      try {
        await this.$api.editPopularPosition({
          aggPopularScore: v.aggPopularScore,
          dramaId: v.id,
          sumScore: parseInt(v.sumScore)
        })
        this.$refs.myTable.refresh()
      } catch (e) {
        this.$refs.myTable.refresh()
      }
    },
    handleClose() {
      this.dramaId = null;
      this.options = [];
      this.addShowDialog = false
      this.$refs.myTable.refresh()
    },
    async doDelete(v) {
      this.$confirm(`是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await this.$api.editPopularPosition({
            dramaId: v.id,
            popularRecommendPosition: 'DISABLE'
          })
          this.$refs.myTable.refresh()
        } catch (e) {
          this.$refs.myTable.refresh()
        }
      })
    },
    async doSubmit() {
      if(!this.dramaId){
        return this.$message.warning('请选择剧本！')
      }
      try {
        await this.$api.editPopularPosition({
          dramaId: this.dramaId,
          popularRecommendPosition: 'ENABLE'
        })
        this.addShowDialog = false
        this.dramaId = null;
        this.options = [];
        this.$refs.myTable.refresh()
      } catch (e) {}
    },
    //  添加剧本
    doAdd() {
      this.addShowDialog = true
    },
    async remoteMethod(query) {
      this.options = [];
      try {
        let data = await this.$api.dramaQueryDramaPage({
          dramaNameKeyword: query,
          pageNo: 1,
          pageSize: 100,
          dramaStatus: 'ENABLED'
        })
        this.options = data.records
      } catch (e) {}
    }
  }
}
</script>

<style scoped></style>
