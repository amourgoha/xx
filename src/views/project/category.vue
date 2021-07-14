<template>
  <div class="app-container">
    <div class="app-inner category">
      <h2>资金类别</h2>
      <div class="tablist">
        <div class="li" :class="{on:index==showIndex}" v-for="(item,index) in formtypeOptions" @click="handlefand(item,index)">{{item.budgetLv1Name}}</div>
      </div>
      <div class="tabcont">
        <h2>项目类别</h2>
        <div class="item" v-for="(item,index) in projecttypeOptions">
          <h3>{{item.budgetLv2Name}}</h3>
          <span v-for="(itemsub,index) in item.children" @click="handlepjLibId(itemsub.pjLibId)" style="cursor:pointer" v-if="itemsub.declareStatus=='2'">{{itemsub.budgetLv3Name}}</span>
          <span v-for="(itemsub,index) in item.children" style="color:#999" v-if="itemsub.declareStatus!='2'">{{itemsub.budgetLv3Name}}</span>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { list,fundType,itemType,columnGroup,column } from "@/api/project/index";
export default {  
  name: "category",
  data() {
    return {
      showIndex:0,
      formtypeOptions:[],
      projecttypeOptions:[],
    };
    
  },
  created() {
    this.getformtype();
    
  },
  methods: {
    getformtype(){
      fundType().then(res => {
        this.formtypeOptions = res.data;
        this.getprojecttype(res.data[0].budgetLv1Id)
      });
    },
    getprojecttype(id){
      itemType(id).then(res => {
        this.projecttypeOptions = res.data;
        
      });
    },
    handlefand(item,index){
      this.showIndex = index
      this.getprojecttype(item.budgetLv1Id)
    },
    handlepjLibId(id){
       this.$router.push({
            path: './apply',
            query:{
              id:id
            }
      })
      
    },
    
  }
};
</script>
<style lang="scss">
.el-tooltip__popper{
    display: none !important
  }
.tablist{
  display: flex;
  .li{
    cursor: pointer;
    height:50px;
    line-height:50px;
    background:rgb(24, 144, 255);
    color:#fff;
    padding:0 20px;
    margin-right:10px;
    &.on{
      background:#035FB4
    }
  }
}
.tabcont{
  .item{
    border:1px solid #ddd;
    margin-bottom:20px;
    
    h3{
      border-bottom:1px solid #ddd;
      margin:0;
      padding:10px 0;
      text-align: center;
    }
    span{
      display:inline-block;
      width:20%;
      border-right:1px solid #ddd;
      border-bottom:1px solid #ddd;
      padding:5px 0;
      margin-bottom:-1px;
      margin-right:-1px;
      text-align: center;

    }
  }
}

</style>