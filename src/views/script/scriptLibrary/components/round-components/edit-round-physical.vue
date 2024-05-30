<template>
  <div>
    <div>
      <div class="titleBox">
        <span style="font-size: 14px; padding-left: 20px"
          >{{roundName}} - 实物搜证 - 手机搜证</span
        >
      </div>
      <div class="tableBox" v-if="appTypeList.length">
        <div class="tableBox-tabBox">
          <yc-tab v-model="activeName" backBtnText="btn-slot">
            <yc-tab-item
              :label="$enums.AppTypeList.getName(item.appType)"
              :value="item.appType"
              v-for="item in appTypeList"
              :key="item.id"
            >
            </yc-tab-item>
          </yc-tab>
          <div
            class="tableBox-tabBox-addBox"
            v-if="$powers('/emailInvestigation/addEmail') || $powers('/murderMysteryRoundAudio/addMurderMysteryRoundAudio')"
            @click="onAdd"
          >
            新增
          </div>
        </div>
        <emailList :assistantId="assistantId" :roundId="roundId" :appId="appId" ref="emailList" v-if="activeName === 'EMAIL' && appTypeList.length"/>
        <audioList :assistantId="assistantId" :roundId="roundId" :appId="appId" ref="audioList" v-if="activeName === 'ROUNDAUDIO' && appTypeList.length"/>
      </div>
    </div>
  </div>
</template>
<script>
import dialogContent from '@global/dialog'
import emailList from './emailList.vue'
import audioList from './audioList.vue'
export default {
  name: 'edit-round-physical',
  components: { dialogContent, emailList, audioList },
  props: {
    assistantId: {
      type: Number,
      default: 0
    },
    roundId: {
      type: Number,
      default: ''
    },
    roundName: {
      type: String,
      default: ''
    },
    appId: {
      type: Number,
      default: null
    }
  },
  data(vm) {
    return {
      activeName: null,
      appTypeList: []
    }
  },
  computed: {
    clueItemName() {
      return function (list) {
        if (!list) return ''
        let name = []
        list.map((it) => {
          if (it.clueId) {
            name.push(`${it.clueName}`)
          }
        })
        return name.join('、')
      }
    }
  },
  watch: {
    activeName() {
      this.queryInfo();
    }
  },
  methods: {
    queryInfo(){
      setTimeout(() => {
        this.$nextTick(_=>{
          if(this.activeName === 'EMAIL'){
            this.$refs.emailList.queryEmailList();
          }else if(this.activeName === 'ROUNDAUDIO'){
            this.$refs.audioList.queryClueAudioList();
          }
        })
      }, 500);
      
    },
    onAdd() {
      if(this.activeName === 'EMAIL'){
        this.$refs.emailList.doAdd();
      }else if(this.activeName === 'ROUNDAUDIO'){
        this.$refs.audioList.doManageAudio();
      }
    },
    async queryAppType() {
      this.appTypeList = []
      this.appTypeList =
        await this.$api.AppInvestigationGetAppTypeInvestigationList({
          id: this.roundId
        })
      this.activeName = this.appTypeList[0].appType;
    }
  }
}
</script>
<style>
.yc-tab__header {
  margin-bottom: 0px !important;
}
</style>
<style lang="sass" scoped>
.titleBox
  background: #fff
  @include ver
  border-radius: 6px
  padding-bottom: 20px

.tableBox
  margin-top: 20px
  background: #fff
  &-tabBox
    @include hor-between-center
    &-addBox
      width: 100px
      height: 44px
      line-height: 44px
      background: $orange
      color: #fff
      font-size: 15px
      border-radius: 8px
      text-align: center
      margin-right: 20px
      cursor: pointer
</style>
