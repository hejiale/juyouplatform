<template>

  <div>
    <yc-table :table='table' ref='myTable'  class="order-manage__table">

      <template slot='detail' slot-scope='props'>
        <el-button type='text' @click='doDetail(props.userId)'>查看</el-button>
      </template>

      <template slot='action' slot-scope='props'>
        <el-button type='text' @click='doOpt(props.id)'>操作</el-button>
        <el-button type='text' @click='doDelete(props.id)' v-if="$powers('/LpUserMessage/deleteLp')">测试用删除</el-button>
      </template>

      <template slot='seq' slot-scope='props'>
        {{ props.index + (table.pagination.pageNo - 1) * 10 + 1 }}
      </template>
    </yc-table>

    <el-dialog title='会员操作' :visible.sync='dialogVisible' width='40%'>
      <el-form :model='form' :inline='true' label-position='left'>
        <el-form-item style='margin-top: 20px;margin-left: 20px' prop='lpMembershipPackageId' label='会员套餐'
                      label-width='70px'>
          <el-select style='width: 300px' v-model='form.lpMembershipPackageId' placeholder='请选择'>
            <el-option v-for='item in membershipPackageList' :key='item.name' :label='item.name' :value='item.id' />
          </el-select>
        </el-form-item>
      </el-form>
      <!--按钮-->
      <div slot='footer' class='dialog-footer'>
        <el-button @click='dialogClose'>取 消</el-button>
        <el-button type='primary' @click='submitUserPackage'>确 定</el-button>
      </div>
    </el-dialog>
  </div>


</template>
<script>

export default {
  components: {},
  data(vm) {
    return {
      /*弹出框显隐形*/
      dialogVisible: false,
      form: {},
      membershipPackageList: [],
      optItemId : '',
      /*表单*/
      table: {
        api: this.$api.LpUserMessageList,
        query: {},
        searchData: [
          {
            title: '姓名/手机号',
            type: 'input',
            model: 'keyWord',
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
            title: '职业',
            type: 'select',
            model: 'occupation',
            enumType: 'LP_OCCUPATION',
            placeholder: '请输入'
          },
          {
            title: '学历',
            type: 'select',
            model: 'education',
            enumType: 'LP_EDUCATION',
            placeholder: '请输入'
          },
          {
            title: '政治面貌',
            type: 'select',
            model: 'politicalStatus',
            enumType: 'LP_POLITICS',
            placeholder: '请输入'
          },
          {
            title: '是否无服务',
            type: 'selectBool',
            model: 'noService',
            placeholder: '请选择',
            enumType: 'Bool',
          },
          {
            title: '套餐',
            type: 'selectMemberPackage',
            model: 'lpMembershipPackageId',
            placeholder: '请选择',
            option: []
          },

        ],
        columns: [
          {
            title: '序号',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.seq(ctx))
            },
            width: 100
          },
          {
            title: '姓名',
            key: 'name',
            width: 100
          },
          {
            title: '相册',
            key: 'albumUrls',
            isImage: true,
            width: 100
          },
          {
            title: '性别',
            key: 'sex',
            enumType: 'Sex',
            width: 100
          },
          {
            title: '手机号',
            key: 'phone',
            width: 110
          },
          {
            title: '年龄',
            key: 'age',
            width: 100
          },
          {
            title: '职业',
            key: 'occupation',
            width: 100
          },
          {
            title: '学历',
            key: 'education',
            width: 100
          },
          {
            title: '身高',
            key: 'height',
            width: 100
          },
          {
            title: '体重',
            key: 'weight',
            width: 100
          },
          {
            title: '籍贯',
            key: 'cityName',
            width: 100
          },
          {
            title: '政治面貌',
            key: 'politicalStatus',
            width: 100
          },
          {
            title: '套餐',
            key: 'lpMembershipPackageName',
            width: 100
          },
          {
            title: '会员费用',
            key: 'payPrice',
            width: 100,
            render: (h, params) => {
              return h('div', (params.row.payPrice / 100).toFixed(2) + ' 元');
            }
          },
          {
            title: '会员入驻时间',
            key: 'entryTime',
            width: 100
          },
          {
            title: '会员生效时间',
            key: 'effectiveTime',
            width: 100
          },
          {
            title: '会员失效时间',
            key: 'expirationTime',
            width: 100
          },

          {
            title: '更多信息',
            fixed: 'right',
            render(h, ctx) {
              if (ctx.row.id) {
                return h('div', vm.$refs.myTable.$scopedSlots.detail(ctx.row))
              }
            }
          },
          {
            title: '会员操作',
            fixed: 'right',
            width: 200,
            render(h, ctx) {
              if (ctx.row.id) {
                return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
              }
            }
          }
        ]
      }
    }
  },
  activated() {
    this.queryMessageList();
  },
  methods: {
    doDetail(id) {
      this.$router.push({
        path: '/lovePotion/LpUserMessageDetail',
        query: {
          id
        }
      })
    },
    async doOpt(id) {
      this.form = {}
      this.membershipPackageList = {}
      this.optItemId = '';
      this.dialogVisible = true
      this.form = this.$refs.myTable.table.data.find(item => item.id === id)
      this.optItemId = id

      let res = await this.$api.lpMembershipPackageList()
      this.membershipPackageList = JSON.parse(JSON.stringify(res))
    },
    async submitUserPackage(){
      this.user = JSON.parse(sessionStorage.getItem('user'))
      await this.$api.LpUserMessageSubscribe({
        lpUserId : this.form.id,
        optUserId : this.user.loginId,
        membershipPackageId : this.form.lpMembershipPackageId
      })
      // 刷新页面
      this.dialogClose();
      this.$refs.myTable.refresh();
    },
    dialogClose() {
      console.log("close 被调用")
      this.dialogVisible = false
      this.form = {}
      this.membershipPackageList = {}
    },
    async queryMessageList(){
      let res = await this.$api.lpMembershipPackageList({});
      this.table.searchData[6].option = res.filter((m) => m.id != null).map((m) => {
        return {
          label: m.name,
          value: m.id
        }
      })
    },
    async doDelete(id){
      await this.$api.LpActivityUserDelete({id});
      this.$refs.myTable.refresh();
    }
  }
}
</script>
<style lang="sass">
.order-manage__table
  .el-table__body-wrapper::-webkit-scrollbar
    width: 6px
    height: 10px
    background-color: rgba(240, 240, 240, 1)
    display: block

</style>