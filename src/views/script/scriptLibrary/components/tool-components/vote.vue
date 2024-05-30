<template>
  <div>
    <yc-table
      :table="table"
      ref="myTable"
      :hideTableTitle="true"
      :topTitle="topTitle"
      :isShowPagination="false"
      :isAutoLoad="false"
    >
      <template slot="buttons">
        <div class="base-topBtn">
          <el-button type="primary" @click="dialogVisible = true" v-if="$powers('/murderMysteryTool/addToolForVote')"
            >新增投票工具</el-button
          >
        </div>
      </template>
      <template slot="action" slot-scope="props">
        <el-button type="text" @click="doEdit(props)" v-if="$powers('/murderMysteryTool/updateToolForVote')">编辑</el-button>
        <el-button type="text" class="reject" @click="doDel(props.id)" v-if="$powers('/murderMysteryTool/deleteToolForVote')"
          >删除</el-button
        >
      </template>
    </yc-table>
    <el-dialog
      :title="form.id ? '编辑投票工具':'新增投票工具'"
      :visible.sync="dialogVisible"
      class="role-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="800px"
      center
    >
      <dialogContent
        :isLoading="subLoading"
        @on-back="handleClose"
        @on-cancel="handleClose"
        @on-sure="doSubmit"
      >
        <template slot="content">
          <el-form
            :model="form"
            :rules="rules"
            ref="form"
            label-position="left"
            label-width="80px"
            class="user-form"
            style="padding: 0 50px"
            center
          >
            <el-form-item label="类型" prop="voteType">
              <el-select v-model="form.voteType" placeholder="请选择">
                <el-option
                  v-for="i in $enums.VoteType.list"
                  :label="i.label"
                  :value="i.value"
                  :key="i.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="标题" prop="title">
              <el-input
                type="textarea"
                :rows="5"
                v-model="form.title"
                placeholder="请输入"
                style="width: 300px"
              />
            </el-form-item>
            <el-form-item label="选项"></el-form-item>
            <el-table
              ref="multipleTable"
              :data="form.opts"
              class="mb20 info-table"
              style="width: 100%"
            >
              <el-table-column label="文字内容" prop="content" :align="'left'">
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.content"
                    placeholder="请输入"
                    style="width: 500px"
                  />
                </template>
              </el-table-column>
              <el-table-column label="选项" :align="'left'" width="100">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    class="reject"
                    @click="doDelContent(scope)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-button type="primary" @click="addContent">添加选项</el-button>
          </el-form>
        </template>
      </dialogContent>
    </el-dialog>
  </div>
</template>

<script>
import dialogContent from '@global/dialog'
const FORM = {
  title: '',
  opts: []
}
export default {
  components: {
    dialogContent
  },
  data(vm) {
    return {
      table: {
        customTopTitle: true,
        api: this.$api.murderMysteryToolToolForVoteList,
        query: {
          dramaId: this.$route.query.id
        },
        searchData: [
          {
            title: '标题',
            type: 'input',
            model: 'title',
            placeholder: '请输入'
          },
          {
            title: '类型',
            type: 'select',
            model: 'voteType',
            enumType: 'VoteType',
            placeholder: '请选择'
          }
        ],
        columns: [
          {
            title: '标题',
            key: 'title',
            showTooltip: true,
            align: 'left'
          },
          {
            title: '类型',
            key: 'voteType',
            enumType: 'VoteType',
            align: 'left',
            width: '200px'
          },
          {
            title: '操作',
            align: 'left',
            width: '200px',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      },
      form: this.$_.cloneDeep(FORM),
      rules: {
        title: {
          required: true,
          message: '请输入标题',
          trigger: 'blur'
        },
        voteType: {
          required: true,
          message: '请选择类型',
          trigger: 'change'
        }
      },
      dialogVisible: false,
      subLoading: false,
      topTitle: '工具里添加后及激活投票功能，可配置默认题目'
    }
  },
  methods: {
    refresh(){
      this.$refs.myTable.refresh();
    },
    addContent() {
      this.form.opts.push({ content: '' })
    },
    doDelContent(props) {
      this.form.opts.splice(props.$index, 1)
    },
    doEdit(prop) {
      this.dialogVisible = true
      prop.opts = prop.options
      this.form = prop
    },
    doDel(id) {
      this.$confirm(`此操作将删除该线索, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$api.murderMysteryToolDeleteToolForVote({
            voteId: id
          })
          this.$message({
            type: 'success',
            message: `删除成功!`
          })
          this.$refs.myTable.refresh()
        })
        .catch(() => {})
    },
    async doSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        if(this.subLoading)return;
        this.subLoading = true
        try {
          if (this.form.id) {
            await this.$api.murderMysteryToolUpdateToolForVote({
              ...this.form,
              dramaId: this.$route.query.id
            })
          } else {
            await this.$api.murderMysteryToolAddToolForVote({
              ...this.form,
              dramaId: this.$route.query.id
            })
          }
          this.dialogVisible = false
          this.clearData()
          this.$message.success('操作成功')
          await this.$refs.myTable.refresh()
          this.subLoading = false
        } catch (e) {
          this.subLoading = false
          console.log(e)
        }
      })
    },
    handleClose() {
      this.clearData()
      this.dialogVisible = false
    },
    clearData() {
      this.form = this.$_.cloneDeep(FORM)
    }
  }
}
</script>

<style></style>
