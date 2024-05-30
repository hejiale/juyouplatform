<template>
  <div>
    <yc-table :table="table" ref="myTable" :isAutoLoad="false" :isShowPagination="false">
      <template slot="player" slot-scope="props">
        {{ playerStatus(props) }}
      </template>
      <template slot="dm" slot-scope="props">
        {{ dmStatus(props) }}
      </template>
    </yc-table>
  </div>
</template>
<script>
export default {
  props: {
    subRound:{
      type: Object,
      default(){
        return null
      }
    }
  },
  data() {
    const vm = this
    return {
        table: {
        hidePagination: true,
        columns: [
          {
            title: '线索名称',
            key: 'clueName'
          },
          {
            title: '图标',
            key: 'clueIcon',
            isImage: true
          },
          {
            title: '玩家可执行操作',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.player(ctx.row))
            }
          },
          {
            title: '主持人可执行操作',
            render(h, ctx) {
              return h('div', vm.$refs.myTable.$scopedSlots.dm(ctx.row))
            }
          }
        ]
      },
    };
  },
  computed:{
    playerStatus(){
      return function(props){
        let arr = [];
        if(props.isPlayerPublic){
          arr.push('公开')
        }
        if(props.isPlayerTransfer){
          arr.push('转让')
        }
        if(arr.length){
          return arr.join('、')
        }else{
          return '———';
        }
      }
    },
    dmStatus(){
      return function(props){
        let arr = [];
        if(props.isDmPublic){
          arr.push('公开')
        }
        if(props.isDmDistribute){
          arr.push('分发')
        }
        if(props.isDmRecall){
          arr.push('收回')
        }
        if(arr.length){
          return arr.join('、')
        }else{
          return '———';
        }
      }
    }
  },
  methods: {
    refresh(data){
      this.table.data = data;

      //手动刷新
      this.$nextTick(_=>{
        this.$refs.myTable.update();
      })
    },
    doCancel() {
      this.$emit("on-close");
    },
  },
};
</script>
<style lang="sass" scoped>
.dialog-footer
  @include hor-center-center
</style>