<template>
  <div>
    <yc-table :table="table" ref="myTable" :isAutoLoad="false"></yc-table>
  </div>
</template>

<script>
export default {
  data () {
    const vm = this
    return {
      table: {
        api: this.$api.publisherUserQueryPublisherUserPage,
        query: {},
        columns: [
          {
            title: '头像',
            key: 'avatar'
          },
          {
            title: '用户昵称',
            key: 'nickName',
            isImage: true
          },
          {
            title: '手机号',
            key: 'phone'
          },
          {
            title: '性别',
            key: 'sex',
            enumType: 'Sex'
          },
          {
            title: '用户状态',
            render (h, ctx) {
              return h(
                'div',
                vm.$refs.myTable.$scopedSlots.userStatus(ctx.row.userStatus)
              )
            }
          }
        ]
      }
    }
  },
  methods: {
    async initData () {
      this.table.query['id'] = this.$route.query.id;

      this.$nextTick(_=>{
        this.$refs.myTable.refresh();
        this.$refs.myTable.update();
      })
    }
  }
}
</script>
<style lang="sass">
</style>
