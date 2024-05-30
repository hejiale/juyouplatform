<template>
  <yc-table :table="table" ref="myTable" :isAutoLoad="false">
    <template slot="publisher" slot-scope="props">
        <span v-for="(item, idx) in props" :key="idx">
          <template v-if="idx === props.length - 1">{{item.publisherName}}</template>
          <template v-else>{{item.publisherName}}、</template>
        </span>
    </template>
    <template slot="action" slot-scope="props">
      <el-button type="text" @click="doDetail(props.id)">查看</el-button>
      <!-- <el-button type="text" @click="doEdit(props.id)" v-if="$powers('shopInfo-scriptInfo-modify')">编辑</el-button>
      <el-button type="text" class="del" @click="doDelete(props.id)" v-if="$powers('shopInfo-scriptInfo-delete')">删除</el-button> -->
    </template>
  </yc-table>
</template>

<script>
export default {
  data (vm) {
    return {
      table: {
        api: this.$api.storeDramaQueryDramaPageWithStore,
        query: {
          storeId: this.$route.query.id
        },
        searchData: [],
        columns: [
          {
            title: '剧本名称',
            key: 'dramaName',
            showTooltip: true
          },
          {
            title: '剧本封面',
            width: 140,
            key: 'dramaCover',
            isImage: true
          },
          {
            title: '发行工作室',
            showTooltip: true,
            render (h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.publisher(ctx.row.publisherItemList))
            }
          },
          {
            title: '发售方式',
            key: 'sellType',
            enumType: 'SellType'
          },
          {
            title: '剧本价格',
            key: 'dramaPrice',
            filter: 'currency',
            showTooltip: true
          },
          {
            title: '操作',
            width: '200px',
            render (h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      }
    }
  },
  methods: {
    //手动刷新列表
    refresh(){
      this.table.query['storeId'] = this.$route.query.id;

      this.$nextTick(_=>{
        this.$refs.myTable.refresh();
      })
    },
    // doEdit (id) {
    //   this.$router.push({
    //     name: 'scriptInfoEdit',
    //     params: {
    //       id
    //     },
    //     query: {
    //       isStore: 1
    //     }
    //   })
    // },
    doDetail (id) {
      this.$router.push({
        path: '/script/info/detail',
        query: {
          id,
          isStore: 1,
          storeId: this.$route.query.id
        }
      })
    },
    // doDelete (id) {
    //   this.$confirm(`此操作将删除该剧本, 是否继续?`, '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(async () => {
    //     await this.$api.storeDramaDeleteStoreDrama({
    //       storeId: this.$route.params.id,
    //       dramaId: id
    //     })
    //     this.$message({
    //       type: 'success',
    //       message: `删除成功!`
    //     })
    //     this.$refs.myTable.refresh()
    //   }).catch(() => {
    //   })
    // }
  }
}
</script>

<style scoped>

</style>
