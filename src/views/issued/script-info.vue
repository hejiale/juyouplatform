<template>
  <yc-table :table="table" ref="myTable">
    <template slot="publisher" slot-scope="props">
      <div v-for="(item, idx) in props" :key="idx" class="textTable">
        <template v-if="idx === props.length - 1">{{
          item.publisherName
        }}</template>
        <template v-else>{{ item.publisherName }}、</template>
      </div>
    </template>
    <template slot="action" slot-scope="props">
      <el-button
        type="text"
        @click="doDetail(props.id)"
        v-if="$powers('issuedInfo-scriptInfo-view')"
        >查看</el-button
      >
      <el-button
        type="text"
        @click="doEdit(props.id)"
        v-if="$powers('issuedInfo-scriptInfo-modify')"
        >编辑</el-button
      >
      <el-button
        type="text"
        class="del"
        @click="doDelete(props.id)"
        v-if="$powers('issuedInfo-scriptInfo-delete')"
        >删除</el-button
      >
    </template>
  </yc-table>
</template>

<script>
export default {
  data () {
    const vm = this
    return {
      table: {
        api: this.$api.dramaPublisherQueryDramaPublisherPage,
        query: {
          publisherId: this.$route.params.id
        },
        searchData: [
          {
            title: '剧本名称',
            type: 'input',
            model: 'keywords',
            placeholder: '请输入'
          },
          {
            title: '发售方式',
            type: 'select',
            model: 'sellType',
            enumType: 'SellType',
            placeholder: '请选择'
          }
        ],
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
          // {
          //   title: "发行工作室",
          //   key: "publisherName",
          //   showTooltip: true,
          // },
          {
            title: '发行工作室',
            showTooltip: true,
            width: 120,
            render (h, ctx) {
              return h(
                'div',
                vm.$refs.myTable.$scopedSlots.publisher(
                  ctx.row.publisherItemList
                )
              )
            }
          },
          {
            title: '发售方式',
            key: 'sellType',
            enumType: 'SellType'
          },
          {
            title: '发售价格',
            key: 'sellPrice',
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
    doEdit (id) {
      this.$router.push({
        name: 'scriptInfoEdit',
        params: {
          id
        },
        query: {
          isStore: 1
        }
      })
    },
    doDetail (id) {
      this.$router.push({
        name: 'scriptInfoDetail',
        params: {
          id
        },
        query: {
          isStore: 1
        }
      })
    },
    doDelete (id) {
      this.$confirm(`此操作将删除该剧本, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$api.dramaDeleteDrama({ id })
          this.$message({
            type: 'success',
            message: `删除成功!`
          })
          this.$refs.myTable.refresh()
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped></style>
