<template>
  <div class="email">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-position="left"
      label-width="120px"
      class="user-form"
      style="padding: 0 50px"
      center
    >
      <el-form-item label="发件人类型" prop="senderType">
        <el-radio v-model="form.senderType" label="ROLE">剧本角色</el-radio>
        <el-radio v-model="form.senderType" label="DIY">自定义</el-radio>
      </el-form-item>
      <el-form-item
        label="发件人名称"
        prop="senderName"
        v-if="form.senderType == 'DIY'"
      >
        <el-input
          v-model="form.senderName"
          maxlength="20"
          show-word-limit
          placeholder="请填写发件人名称"
        />
      </el-form-item>
      <el-form-item label="发件人名称" prop="roleId" v-else>
        <el-select v-model="form.roleId" placeholder="请选择发件人" @change="onChangeRole">
          <el-option
            v-for="i in roleList"
            :label="i.roleName"
            :value="i.id"
            :key="i.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="发件人头像"
        prop="senderAvatar"
        tips="只能上传jpg/png/jpeg文件, 图片最大尺寸宽：1080 且不超过2M"
      >
        <yc-image-uploader
          ref="senderAvatar"
          v-model="form.senderAvatar"
          :maxSize="1"
          :disabled="form.senderType == 'ROLE'"
          list-type="picture"
        ></yc-image-uploader>
      </el-form-item>
      <el-form-item label="发件内容" prop="emailContent">
        <el-input type="textarea" :rows="5" v-model="form.emailContent" />
      </el-form-item>

      <div class="content">
        <span class="base-title"
          >配置此邮件接收人，以及不同邮件人点击此邮件能获得的线索</span
        >
        <yc-table
          :table="table"
          ref="myTable"
          :isShowPagination="false"
          :hideTableTitle="true"
        >
          <template slot="role" slot-scope="props">
            <el-select v-model="props.emailPrivateItems[0].roleId">
              <el-option
                v-for="i in filterRoleList"
                :label="i.roleName"
                :value="i.id"
                :key="i.id"
                :disabled="!i.isCanUsed"
              />
            </el-select>
          </template>
          <template slot="clue" slot-scope="props">
            <el-select
              v-model="props.emailPrivateItems[0].clueIds"
              multiple
              @change="onSelectClue" 
              @remove-tag="onRemoveTag"
            >
              <el-option
                v-for="i in clueList"
                :label="i.clueName"
                :value="i.id"
                :key="i.id"
                :disabled="!i.isCanUsed"
              />
            </el-select>
          </template>
          <template slot="action" slot-scope="props">
            <el-button type="text" class="reject" @click="doDelete(props.index)"
              >删除</el-button
            >
          </template>
        </yc-table>
        <el-button type="primary" @click="addRole">添加</el-button>
      </div>
      <div class="content">
        <div class="base-title">
          配置关联的公开线索
        </div>
        <yc-table
          :table="table2"
          ref="myTable2"
          :isShowPagination="false"
          class="table2"
          :hideTableTitle="true"
        >
          <template slot="clue" slot-scope="props">
            <el-select v-model="props.publicCludIds" multiple @change="onSelectClue">
              <el-option
                v-for="i in clueList"
                :label="i.clueName"
                :value="i.id"
                :key="i.id"
                :disabled="!i.isCanUsed"
              />
            </el-select>
          </template>
        </yc-table>
      </div>
    </el-form>
  </div>
</template>

<script>
import tinymce from 'tinymce'
export default {
  props: {
    appId: {
      type: Number,
      default: 0
    },
    assistantId: {
      type: Number,
      default: 0
    },
    roundId: {
      type: Number,
      default: 0
    }
  },
  data(vm) {
    return {
      form: {
        senderType: 'DIY',
        senderName: null,
        roleId: null,
        senderAvatar: null,
        emailContent: null
      },
      rules: {
        senderType: {
          required: true,
          message: '请选择发件人类型',
          trigger: 'change'
        },
        senderName: {
          required: true,
          message: '请填写发件人',
          trigger: 'blur'
        },
        roleId: {
          required: true,
          message: '请选择发件人',
          trigger: 'change'
        },
        senderAvatar: {
          required: true,
          message: '请上传发件人头像',
          trigger: 'change'
        },
        emailContent: {
          required: true,
          message: '请发件内容',
          trigger: 'blur'
        }
      },
      table: {
        data: [],
        columns: [
          {
            title: '选择邮件接收人',
            align: 'left',
            render(h, ctx) {
              console.log(ctx)
              return h('div', vm.$refs.myTable.$scopedSlots.role(ctx.row))
            }
          },
          {
            title: '选择连带私有线索',
            align: 'left',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.clue(ctx.row))
            }
          },
          {
            title: '操作',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx))
            }
          }
        ]
      },
      table2: {
        data: [{ publicCludIds: [] }],
        columns: [
          {
            title: '添加线索',
            align: 'left',
            render(h, ctx) {
              return h('div', vm.$refs.myTable2.$scopedSlots.clue(ctx.row))
            }
          }
        ]
      },
      emailId: null,
      roleList: [],
      clueList: [],
      publicCludIds: [],
      canSubmit: false
    }
  },
  computed:{
    filterRoleList(){
      let roleList = JSON.parse(JSON.stringify(this.roleList))
      //过滤角色
      roleList.map(v=>{
        this.table.data.map(d=>{
          let idx = d.emailPrivateItems.findIndex(e=>e.roleId === v.id)
          if(idx !== -1){
            v.isCanUsed = false;
          }
        })
      })
      return roleList;
    }
  },
  methods: {
    onChangeRole(){
      let idx = this.roleList.findIndex(it=>it.id === this.form.roleId)
      this.form.senderAvatar = this.roleList[idx].roleAvatar;
      this.$refs.senderAvatar.setFileList(this.form.senderAvatar)

    },
    loadTableData(emailPrivateItems){
      //过滤线索
      this.clueList.map(v=>{
        emailPrivateItems.map(e=>{
          let idx = e.clueIds.findIndex(i=>i === v.id);
          if(idx !== -1){
            v.isCanUsed = false;
          }
        })
      })
      emailPrivateItems.map((v) => {
        this.table.data.push({
          emailPrivateItems: [v]
        })
      })
    },
    async querySelectList() {
      //查询选择角色列表
      this.roleList = await this.$api.murderMysteryRoleQueryMurderMysteryRole({
        id: this.$route.query.id
      })
      this.roleList.map(it=>{
        it.isCanUsed = true;
      })

      //查询选择线索列表
      let res = await this.$api.queryUnusedClue({
        id: this.$route.query.id
      })
      this.clueList = res
    },

    addRole() {
      this.table.data.push({
        emailPrivateItems: [{ clueIds: [], roleId: null }]
      })
    },
    async doSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        if(this.canSubmit)return;
        this.canSubmit = true;
        
        try {
          let senderName = null
          if (this.form.senderType === 'ROLE') {
            this.roleList.map((v) => {
              if (this.form.roleId == v.id) senderName = v.roleName
            })
          } else {
            senderName = this.form.senderName
          }
          let errMag = false
          let emailPrivateItems = []
          let emailPrivateIds = []
          let publicCludIds = this.table2.data[0].publicCludIds
          this.table.data.map((v) => {
            emailPrivateItems.push(v.emailPrivateItems[0])
            emailPrivateIds.push(...v.emailPrivateItems[0].clueIds)
          })
        
          emailPrivateIds.map((v) => {
            publicCludIds.map((val) => {
              if (v == val) errMag = true
            })
          })
          if (errMag) {
            this.$message.warning('私有线索与公开线索不能相同')
            this.$emit('on-complete', false)
            return
          }
          if (this.emailId) {
            await this.$api.emailInvestigationUpdateEmail({
              ...this.form,
              dramaId: this.$route.query.id,
              roundId: this.roundId,
              appId: this.appId,
              id: this.emailId,
              senderName,
              emailPrivateItems,
              publicCludIds
            })
            this.$emit('on-complete', true)
            this.canSubmit = false;
          } else {
            await this.$api.emailInvestigationAddEmail({
              ...this.form,
              dramaId: this.$route.query.id,
              roundId: this.roundId,
              appId: this.appId,
              senderName,
              emailPrivateItems,
              publicCludIds
            })
            this.$emit('on-complete', true)
            this.canSubmit = false;
          }
        } catch (e) {
          this.canSubmit = false;
        }
      })
    },
    doDelete(i) {
      this.table.data.splice(i, 1)
    },
    onSelectClue(val){
      val.map(v=>{
        let idx = this.clueList.findIndex(i=>i.id === v);
        if(idx !== -1){
          this.clueList[idx].isCanUsed = false;
        }
      })
    },
    onRemoveTag(tag){
      this.clueList.map(v=>{
        if(v.id === tag){
          v.isCanUsed = true;
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.table2
  /deep/.el-select
  width: 70%
.content
  border-top: 1px solid #e5e5e5
  padding: 20px 0
.base-title
  font-weight: 600
</style>
