<template>
  <div>
    <div class="base-topBtn">
      <el-button type="primary" @click="goAdd" v-if="$powers('/boxStoreApply/addThreeBoxStoreApply')">新增三方已授权记录</el-button>
    </div>
    <yc-table :table="table" ref="myTable">
      <!-- <template slot="sitesStatus" slot-scope="props">
        <el-switch
          v-model="props.isPutOn"
          active-color="#0052D9"
          inactive-color="#DCDFE6"
          @change="changeIsPutOn(props)"
        >
        </el-switch>
      </template> -->
      <!-- <template slot="boxDramaApplyStatus" slot-scope="props">
        <span>{{
          $enums.BoxDramaApplyStatus.getName(props.boxDramaApplyStatus)
        }}</span>
      </template> -->
      <template slot="actualPayAmount" slot-scope="props">
        <span>{{
          props.actualPayAmount/100
        }}</span>
      </template>
      <template slot="actions" slot-scope="props">
        <el-button
          type="text"
          @click="goEdit(props.id)"
          v-if="props.boxStoreApplyStatus !== 'WAIT_PAY' && $powers('/boxStoreApply/auditBoxStoreApply')"
          >审核打分</el-button
        >
        <el-button
          type="text"
          v-if="props.boxStoreApplyStatus === 'WAIT_AUTHORIZE' && $powers('/boxStoreApply/passBoxStoreApply')"
          @click="onGoAuth(props.id)"
          >授权</el-button
        >
        <el-button
          type="text"
          v-if="
            (props.boxStoreApplyStatus === 'PASS_AUTHORIZE' ||
            props.boxStoreApplyStatus === 'WAIT_AUTHORIZE') && $powers('/boxStoreApply/stopBoxStoreApply')
          "
          @click="onEndAuthorize(props.id)"
          >中止授权</el-button
        >
      </template>
    </yc-table>
    <el-dialog
      :visible.sync="addShowDialog"
      title="新增三方已授权记录"
      center
      width="640px"
      :show-close="false"
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
            <el-form-item label="领本商品名称：" prop="prouductId">
              <el-select
                v-model="form.prouductId"
                filterable
                remote
                reserve-keyword
                placeholder="请选择商品"
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
            <el-form-item label="店铺名称：" prop="storeId">
              <el-select
                v-model="form.storeId"
                filterable
                remote
                reserve-keyword
                placeholder="请选择店铺"
                :remote-method="remoteStoreMethod"
                @change="onChangeStore"
              >
                <el-option
                  ref="option"
                  v-for="item in storeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所在城市：">{{ cityName }}</el-form-item>
            <el-form-item label="企业名称：">{{
              selectStore ? selectStore.businessName : ''
            }}</el-form-item>
            <el-form-item label="授权日期：">
              <el-date-picker
                v-model="form.authorizeTime"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="申领渠道：" prop="boxStoreApplyChannel">
              <el-select
                v-model="form.boxStoreApplyChannel"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in $enums.BoxStoreApplyChannel.list"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="三方平台相关截图：">
              <yc-image-uploader
                ref="image-cover"
                v-model="form.urls"
                uploadMultiple
                :limit="3"
                tips="只能上传jpg/png文件，且不超过500kb"
              ></yc-image-uploader>
            </el-form-item>
            <el-form-item label="实付金额：">
              <el-input
                v-model="form.price"
                placeholder="请输入"
                style="width: 220px"
              />
            </el-form-item>
            <el-form-item label="是否生成发货单：">
              <el-switch v-model="form.isGenerateDeliveryOrder"></el-switch>
            </el-form-item>
            <el-form-item label="收货人姓名：" v-if="form.isGenerateDeliveryOrder" prop="linkmanName">
              <el-input
                v-model="form.linkmanName"
                placeholder="请输入"
                style="width: 220px"
              />
            </el-form-item>
            <el-form-item label="收货人手机号：" v-if="form.isGenerateDeliveryOrder" prop="linkmanPhone">
              <el-input
                v-model="form.linkmanPhone"
                placeholder="请输入"
                style="width: 220px"
              />
            </el-form-item>
            <el-form-item label="收货人地址：" v-if="form.isGenerateDeliveryOrder" prop="linkmanAddress">
              <el-input
                v-model="form.linkmanAddress"
                placeholder="请输入"
                style="width: 320px"
              />
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
  data() {
    const vm = this
    const validateImgs = (rule, value, callback) => {
      if (!this.form.urls || !this.form.urls.length) {
        callback(new Error('请上传截图'))
      } else {
        callback()
      }
    }
    return {
      form: {
        isGenerateDeliveryOrder: false
      },
      table: {
        api: this.$api.boxStoreApplyQueryBoxStoreApplyPage,
        query: {},
        searchData: [
          {
            title: '剧本名称',
            type: 'input',
            model: 'dramaName',
            placeholder: '请输入'
          },
          {
            title: '申领渠道',
            type: 'select',
            model: 'boxStoreApplyChannel',
            enumType: 'BoxStoreApplyChannel',
            placeholder: '请输入'
          },
          {
            title: '店铺名称',
            type: 'input',
            model: 'storeName',
            placeholder: '请输入'
          },
          {
            title: '授权状态',
            type: 'select',
            model: 'boxStoreApplyStatus',
            enumType: 'BoxStoreApplyStatus',
            placeholder: '请输入'
          },
          {
            title: '所在城市',
            type: 'cascader',
            modelName: ['provinceId', 'cityId'],
            option: [],
            props: {
              checkStrictly: true,
              label: 'regionName',
              value: 'id',
              children: 'subRegionList'
            },
            placeholder: '请选择'
          },
        ],
        columns: [
          {
            title: '剧本名称',
            key: 'dramaName',
            align: 'left',
            showTooltip: true
          },
          {
            title: '店铺名称',
            key: 'storeName'
          },
          {
            title: '所在城市',
            key: 'cityName'
          },
          {
            title: '邮寄地址',
            key: 'deliverAddress'
          },
          {
            title: '申领渠道',
            key: 'boxStoreApplyChannel',
            enumType: 'BoxStoreApplyChannel'
          },
          {
            title: '总得分',
            key: 'realyTotalScore'
          },
          {
            title: '实付金额',
            render(h, ctx) {
              return h('div', vm.$refs['myTable'].$scopedSlots.actualPayAmount(ctx.row))
            }
          },
          {
            title: '授权状态',
            key: 'boxStoreApplyStatus',
            enumType: 'BoxStoreApplyStatus'
          },
          {
            title: '创建时间',
            key: 'createdTime'
          },
          {
            title: '操作',
            width: 240,
            render(h, ctx) {
              return h('div', vm.$refs['myTable'].$scopedSlots.actions(ctx.row))
            }
          }
        ]
      },
      addShowDialog: false,
      form: {},
      rules: {
        prouductId: {
          required: true,
          message: '请选择商品',
          trigger: 'change'
        },
        storeId: {
          required: true,
          message: '请选择店铺',
          trigger: 'change'
        },
        boxStoreApplyChannel: {
          required: true,
          message: '请选择申领渠道',
          trigger: 'change'
        },
        linkmanName: {
          required: true,
          message: '收货人姓名',
          trigger: 'blur'
        },
        linkmanPhone: {
          required: true,
          message: '收货人手机号',
          trigger: 'blur'
        },
        linkmanAddress: {
          required: true,
          message: '收货人地址',
          trigger: 'blur'
        }
      },
      options: [],
      storeOptions: [],
      selectStore: null,
      canSubmit: false
    }
  },
  computed: {
    cityName() {
      return this.selectStore
        ? `${this.selectStore.province}${this.selectStore.city}${this.selectStore.district || ""}`
        : ''
    }
  },
  mounted() {
    this.initAreaData()
  },
  methods: {
     //  获取地区集联数据
    async initAreaData() {
      this.table.searchData[4].option =
        await this.$api.regionQueryRegionCascadeList({})
    },
    goAdd() {
      this.selectStore = null;
      this.options = [];
      this.storeOptions = [];
      this.form = {
        isGenerateDeliveryOrder: false
      }
      this.addShowDialog = true
      this.$nextTick((_) => {
        this.$refs.form.clearValidate()
      })
    },
    goEdit(id) {
      this.$router.push({
        name: 'scriptApplyRecordDetail',
        query: {
          id
        }
      })
    },
    handleClose() {
      this.form = {}
      this.addShowDialog = false
      this.$refs.myTable.refresh()
    },
    doSubmit() {
      let that = this;

      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        if(this.canSubmit)return;
        this.canSubmit = true;

        let form = JSON.parse(JSON.stringify(that.form))
        form.authorizeTime = this.$dayjs(that.form.authorizeTime).format(
          'YYYY-MM-DD 00:00:00'
        )
        if(!form.isGenerateDeliveryOrder){
          form.linkmanName = null;
          form.linkmanPhone = null;
          form.linkmanAddress = null;
        }

        try {
          await that.$api.boxStoreApplyAddThreeBoxStoreApply({
            ...form,
            operatorId: JSON.parse(sessionStorage.getItem('user')).loginId
          })
          that.handleClose()
          this.canSubmit = false;
        } catch (e) {
          this.canSubmit = false;
        }
      })
    },
    async remoteMethod(query) {
      try {
        let data = await this.$api.getApplyProductList({
          pageNo: 1,
          pageSize: 20,
          productName: query
        })
        this.options = data.records.map((e) => ({
          label: e.productName,
          value: e.id
        }))
      } catch (e) {}
    },
    async remoteStoreMethod(query) {
      if(!this.form.prouductId){
        return 
      }
      try {
        let data = await this.$api.boxStoreApplyNoApplyStoreList({
          productId: this.form.prouductId,
          storeName: query
        })
        this.storeOptions = data.map((e) => ({
          label: e.storeName,
          value: e.storeId,
          info: e
        }))
      } catch (e) {}
    },
    onChangeStore(event) {
      let data = this.storeOptions.filter((e) => e.value === event)
      this.selectStore = data[0].info
    },
    onGoAuth(id){
      let that = this;
      this.$confirm(
        `是否授权该商品, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        try {
          await that.$api.boxStoreApplyPassBoxStoreApply({ id })
          that.$refs.myTable.refresh()
        } catch (e) {}
      })
    },
    onEndAuthorize(id) {
      let that = this;
      this.$confirm(
        `是否终止授权该商品, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        try {
          await that.$api.boxStoreApplyStopBoxStoreApply({ id })
          that.$refs.myTable.refresh()
        } catch (e) {}
      })
    }
  }
}
</script>
<style lang="sass" scoped>
.base-topBtn
  margin-bottom: 30px
</style>
