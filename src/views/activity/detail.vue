<template>
  <div>
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="展会剧本列表" name="basic">
        <yc-table :table="table" ref="myTable" :isAutoLoad="false">
          <template
            slot="buttons"
            v-if="$powers('/exhibition/saveExhibitionDrama')"
          >
            <div class="base-topBtn">
              <el-button type="primary" @click="onAdd">添加剧本</el-button>
            </div>
          </template>
          <template slot="action" slot-scope="props">
            <el-button
              type="primary"
              @click="doEdit(props)"
              v-if="$powers('/exhibition/updateExhibitionDrama')"
              >编辑</el-button
            >
            <el-button
              type="primary"
              @click="doSort(props)"
              v-if="$powers('/exhibition/sortExhibitionDrama')"
              >排序</el-button
            >
            <el-button
              type="danger"
              @click="doDel(props.id)"
              v-if="$powers('/exhibition/deleteExhibitionDrama')"
              >删除</el-button
            >
          </template>
        </yc-table>
      </el-tab-pane>
      <el-tab-pane label="展会信息" name="detail">
        <div class="detailContent">
          <el-form
            ref="form"
            :model="form"
            :rules="detailRules"
            label-position="left"
          >
            <el-form-item label="展会名称：">
              <el-input v-model="details.exhibitionName" style="width: 300px" />
            </el-form-item>
            <el-form-item label="轮播图：">
              <yc-image-uploader
                ref="swipe-cover"
                v-model="swipCover"
                showTips
                uploadMultiple
              ></yc-image-uploader>
            </el-form-item>
            <div>
              <el-button
                type="primary"
                @click="onSubmitDetail"
                v-loading="subLoading"
                v-if="
                  $powers('/exhibition/updateExhibitionRotationChart') &&
                  $powers('/exhibition/updateExhibition')
                "
                >提交</el-button
              >
            </div>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :visible.sync="addShowDialog"
      :title="isEditStatus ? '编辑' : '新增'"
      center
      width="640px"
      :show-close="false"
      @close="handleClose"
    >
      <dialogContent @on-cancel="handleClose" @on-sure="doSubmit">
        <template slot="content">
          <el-form
            :model="form"
            :rules="rules"
            ref="form"
            label-position="right"
            label-width="150px"
          >
            <el-form-item label="剧本名称：" v-if="isEditStatus">{{
              form.dramaName
            }}</el-form-item>
            <el-form-item label="剧本名称：" prop="dramaId" v-else>
              <el-select
                v-model="form.dramaId"
                filterable
                remote
                reserve-keyword
                placeholder="请选择剧本"
                :remote-method="remoteMethod"
              >
                <el-option
                  ref="option"
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否首发：">
              <el-switch v-model="form.isFirst"></el-switch>
            </el-form-item>
            <el-form-item label="主办方类型：" prop="organizerType">
              <el-select
                v-model="form.organizerType"
                placeholder="请选择主办类型"
                @change="onChangeOrganizerType"
              >
                <el-option
                  v-for="item in $enums.OrganizerType.list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="主办方：" prop="organizerId">
              <el-select v-model="form.organizerId" placeholder="请选择主办方">
                <el-option
                  v-for="item in currentOrganizerList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="领取状态：">
              <el-select
                v-model="form.isClaimed"
                placeholder="请选择领取状态"
              >
                <el-option
                  v-for="item in $enums.Bool.list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </template>
      </dialogContent>
    </el-dialog>
    <el-dialog
      :visible.sync="sortDialog"
      title="剧本排序 "
      center
      width="400px"
      :show-close="false"
      @close="handleClose"
    >
      <dialogContent @on-cancel="handleClose" @on-sure="doSubmitSort">
        <template slot="content">
          <el-form label-position="right" label-width="150px">
            <el-form-item label="剧本名称：">
              <span>{{ currentSort.dramaName }}</span>
            </el-form-item>
            <el-form-item label="排序：">
              <el-input v-model="sortIdx" type="number" style="width: 50px" />
            </el-form-item>
          </el-form>
        </template>
      </dialogContent>
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
      activeName: 'basic',
      table: {
        api: this.$api.exhibitionDramaPage,
        query: {
          exhibitionId: null
        },
        searchData: [],
        columns: [
          {
            title: '序号 ',
            key: 'sort'
          },
          {
            title: '剧本名称',
            key: 'dramaName',
            width: 600
          },
          {
            title: '操作',
            fixed: 'right',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.action(ctx.row))
            }
          }
        ]
      },
      addShowDialog: false,
      sortDialog: false,
      form: {},
      rules: {
        dramaId: {
          required: true,
          message: '请选择剧本',
          trigger: 'change'
        },
        // organizerType: {
        //   required: true,
        //   message: '请选择主办类型',
        //   trigger: 'change'
        // },
        // organizerId: {
        //   required: true,
        //   message: '请选择主办',
        //   trigger: 'change'
        // }
      },
      options: [],
      organizerList: [],
      currentSort: {},
      sortIdx: null,
      swipCover: [],
      detailRules: {
        urls: {
          required: true,
          message: '请上传轮播图',
          trigger: 'change'
        }
      },
      details: {},
      subLoading: false,
      isEditStatus: false
    }
  },
  watch: {
    activeName() {
      if (this.activeName === 'basic') {
        this.$nextTick((_) => {
          this.$refs['myTable'].refresh()
        })
      } else {
        this.$nextTick((_) => {
          this.queryActivityDetail()
          this.queryRotationList()
        })
      }
    }
  },
  activated() {
    this.table.query.exhibitionId = this.$route.query.id
    this.queryOrganizerType();
    this.queryOrganizerList()
    this.loadPage()
  },
  computed: {
    currentOrganizerList() {
      let arr = []
      if (this.form.organizerType) {
        this.organizerList.map((v) => {
          if (v.organizerType === this.form.organizerType) {
            v.organizer.map((it) => {
              arr.push({
                label: it.organizerName,
                value: it.organizerId
              })
            })
          }
        })
      }
      return arr
    }
  },
  methods: {
    onChangeOrganizerType(){
        if(this.isEditStatus){
            this.form.organizerId = null;
        }
      
    },
    onAdd() {
      this.addShowDialog = true
      this.isEditStatus = false
      this.form = {}
      this.$nextTick((_) => {
        this.$refs.form.clearValidate()
      })
    },
    async doDel(id) {
      let that = this
      this.$confirm(`确定是否删除？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await that.$api.deleteExhibitionDrama({ id })
          that.$refs['myTable'].refresh()
        } catch (e) {}
      })
    },
    doSort(v) {
      this.currentSort = v
      this.sortIdx = v.sort;
      this.sortDialog = true
    },
    doEdit(v) {
      this.isEditStatus = true
      this.form = JSON.parse(JSON.stringify(v))
      this.form.isFirst = v.isFirst === 1 ? true : false
      this.form.isClaimed = v.isClaimed === 1 ? true : false
      
      this.addShowDialog = true
      this.$nextTick((_) => {
        this.$refs.form.clearValidate()
      })
    },
    loadPage() {
      this.$nextTick((_) => {
        this.$refs['myTable'].refresh()
      })
    },
    handleClose() {
      this.addShowDialog = false
      this.sortDialog = false
      this.currentSort = {}
      this.form = {}
      if (this.$refs.form) {
        this.$refs.form.clearValidate()
      }
    },
    doSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return

        try {
          if (this.isEditStatus) {
            await this.$api.updateExhibitionDrama({
              ...this.form,
              isFirst: this.form.isFirst ? 1 : 0,
              isClaimed: this.form.isClaimed ? 1 : 0,
            })
          } else {
            await this.$api.saveExhibitionDrama({
              ...this.form,
              isFirst: this.form.isFirst ? 1 : 0,
              isClaimed: this.form.isClaimed ? 1 : 0,
              exhibitionId: this.$route.query.id
            })
          }

          this.$refs['myTable'].refresh()

          this.addShowDialog = false
          this.form = {}
          this.$refs.form.clearValidate()
        } catch (e) {}
      })
    },
    async onSubmitDetail() {
      if (this.subLoading) return
      this.subLoading = true
      try {
        await this.$api.updateExhibitionRotationChart({
          exhibitionId: this.$route.query.id,
          urls: this.swipCover
        })
        await this.$api.updateExhibition({
          id: this.$route.query.id,
          exhibitionName: this.details.exhibitionName
        })
        this.$message.success('更新成功')
        this.subLoading = false
      } catch (e) {
        this.subLoading = false
      }
    },
    async remoteMethod(query) {
      if (query !== '') {
        let data = await this.$api.dramaQueryDramaPage({
          pageNo: 1,
          pageSize: 100,
          dramaNameKeyword: query
        })
        if (data.records) {
          this.options = data.records.map((it) => ({
            value: it.id,
            label: it.dramaName
          }))
        }

        this.loading = false
      } else {
        this.options = []
      }
    },
    async queryOrganizerList() {
      try {
        let data = await this.$api.exhibitionOrganizerMap({
          exhibitionId: this.$route.query.id
        })
        this.organizerList = data.items
      } catch (e) {}
    },
    async doSubmitSort() {
      try {
        await this.$api.sortExhibitionDrama({
          id: this.currentSort.id,
          sort: this.sortIdx
        })
        this.$refs['myTable'].refresh()
        this.handleClose()
      } catch (e) {}
    },
    async queryActivityDetail() {
      try {
        this.details = await this.$api.exhibitionDetail({
          id: this.$route.query.id
        })
      } catch (e) {}
    },
    async queryRotationList() {
      try {
        let data = await this.$api.exhibitionRotationChartList({
          exhibitionId: this.$route.query.id
        })
        this.swipCover = data.records
        this.$nextTick((_) => {
          this.$refs['swipe-cover'].setFileList(data.records.map((v) => v.url))
        })
      } catch (e) {}
    },
    //展会主办方类型
    async queryOrganizerType(){
      try{
        let data = await this.$api.exhibitionTypeList({});
        data.list.map(v=>{
          this.$enums.OrganizerType.list.push({
            value: v.organizerType,
            label: v.organizerTypeName
          })
        })
      }catch(e){}
    }
  }
}
</script>
<style lang="sass" scoped>
.detailContent
</style>
