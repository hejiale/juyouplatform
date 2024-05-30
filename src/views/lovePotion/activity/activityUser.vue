<template>
  <div>
    <yc-table :table="table" ref="myTable" :isAutoLoad="false">
      <template slot="seq" slot-scope="props">
        {{ props.index + (table.pagination.pageNo - 1) * 10 + 1 }}
      </template>
      <template slot="price" slot-scope="props">
        {{ props.price / 100 }}
      </template>
      <template slot="action" slot-scope="props">
        <el-button type="text" @click="doDelete(props.id)" v-if="$powers('/LpActivityUser/delete')">删除</el-button>
      </template>
    </yc-table>
  </div>
</template>
  <script>
export default {
  data(vm) {
    return {
      table: {
        api: this.$api.LpActivityUserList,
        query:{
          lpActivityId: vm.$route.query.id
        },
        searchData: [
          {
            title: '姓名/手机号',
            type: 'input',
            model: 'keywords',
            placeholder: '请输入'
          },
          {
            title: '性别',
            type: 'select',
            model: 'sex',
            enumType: 'Sex',
            placeholder: '请选择'
          },
          {
            title: '报名方式',
            type: 'select',
            model: 'lpActivityUserType',
            enumType: 'LpActivityUserType',
            placeholder: '请选择'
          }
        ],
        columns: [
          {
            title: '序号',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.seq(ctx))
            }
          },
          {
            title: '头像',
            isImage: true,
            key: 'avatar'
          },
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '性别',
            key: 'sex',
            enumType: 'Sex'
          },
          {
            title: '手机号',
            key: 'phone'
          },
          {
            title: '报名方式',
            key: 'lpActivityUserType',
            enumType: 'LpActivityUserType'
          },
          {
            title: '报名费用',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.price(ctx.row))
            }
          },
          {
            title: '报名时间',
            key: 'createdTime'
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
  activated(){
    this.table.query.lpActivityId = this.$route.query.id;
    this.$refs.myTable.refresh();

  },
  methods: {
    doDelete(id) {
      this.$confirm(
        `此操作将删除该用户, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          await this.$api.deleteLpActivityUser({id});
          this.$refs.myTable.refresh();
        })
        .catch(() => {})
    }
  }
}
</script>
  <style lang="sass" scoped>
</style>