<template>
  <div>
    <el-radio-group v-model="radio">
      <el-radio-button label="30天内最多人玩"></el-radio-button>
      <el-radio-button label="人气总榜"></el-radio-button>
      <el-radio-button label="口碑榜"></el-radio-button>
      <el-radio-button label="期待榜"></el-radio-button>
    </el-radio-group>
    <yc-table :table="table" ref="myTable" :showPageSize="false">
      <template slot="rankSort" slot-scope="props">{{
        props.index + (table.pagination.pageNo - 1) * 10 + 1
      }}</template>
      <template slot="sumScore" slot-scope="props">
        <el-input v-model="props.sumScore" @blur="onUpdate($event, props)" :disabled="!$powers('/backend/drama/editServiceScore')"/>
      </template>
      <template
        slot="action"
        slot-scope="props"
        v-if="$powers('/backend/drama/editServiceScore')"
      >
        <el-button type="text" @click="doReset(props)">重置</el-button>
      </template>
    </yc-table>
  </div>
</template>
<script>
export default {
  data(vm) {
    return {
      radio: '30天内最多人玩',
      table: {
        api: this.$api.aggregationRankPage,
        query: {
          rankType: 'HOT_RANK'
        },
        columns: [
          {
            title: '排名',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.rankSort(ctx))
            }
          },
          {
            title: '剧本名称',
            key: 'dramaName'
          },
          {
            title: '30天内组局数（场）',
            key: 'realityScore'
          },
          {
            title: '修正后组局数（场）',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.sumScore(ctx.row))
            },
            width: 100
          },
          {
            title: '操作',
            width: '200px',
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
      if (this.radio === '30天内最多人玩') {
        this.table.columns[2].title = '30天内组局数（场）'
        this.table.columns[3].title = '修正后组局数（场）'
        this.table.query.rankType = 'HOT_RANK'
      } else if (this.radio === '人气总榜') {
        this.table.columns[2].title = '30天内组局数（场）'
        this.table.columns[3].title = '修正后组局数（场）'
        this.table.query.rankType = 'GATHER_SUM_RANK'
      } else if (this.radio === '口碑榜') {
        this.table.columns[2].title = '玩家推荐数'
        this.table.columns[3].title = '修正后的推荐数'
        this.table.query.rankType = 'PRAISE_RANK'
      } else {
        this.table.columns[2].title = '想玩数'
        this.table.columns[3].title = '修正后的想玩数'
        this.table.query.rankType = 'FOCUS_RANK'
      }
      this.$refs.myTable.refresh()
    }
  },
  methods: {
    doReset(props) {
      this.$confirm(`确定重置吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await this.$api.editServiceScore({
            dramaId: props.id,
            rankType: this.$enums.RankType.getValue(this.radio),
            realityCount: props.realityScore,
            sumCount: props.realityScore
          })
          this.$refs.myTable.refresh()
        } catch (e) {
            console.log(e)
        }
      })
    },
    async onUpdate(event, props){
        try {
          await this.$api.editServiceScore({
            dramaId: props.id,
            rankType: this.$enums.RankType.getValue(this.radio),
            realityCount: props.realityScore,
            sumCount: props.sumScore
          })
          this.$refs.myTable.refresh()
        } catch (e) {
            console.log(e)
            this.$refs.myTable.refresh()
        }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>