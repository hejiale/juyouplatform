<template>
  <div>
    <yc-table :table="table" ref="myTable">
      <template slot="action" slot-scope="props">
        <el-button
          type="text"
          @click="doDetail(props.id)"
          >编辑</el-button
        >
      </template>
    </yc-table>
  </div>
</template>
<script>
export default {
  components: {},
  data(vm) {
    return {
      table: {
        api: this.$api.exhibitionList,
        query: {
        },
        searchData: [
        ],
        columns: [
          {
            title: '展会名称',
            key: 'exhibitionName',
            width: 100
          },
          {
            title: '操作',
            fixed: 'right',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      }
    }
  },
  methods: {
    doDetail(id){
      this.$router.push({
        path: '/activity/detail',
        query: {
          id
        }
      })
    }
  }
}
</script>
<style lang="sass"></style>
