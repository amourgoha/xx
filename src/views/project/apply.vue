<template>
  <div class="app-container">
    <div class="app-inner">
      <el-row :gutter="20">      		
	     <el-col :span="4" :xs="24">
         <div class="li" :class="{'on':Index==index}" v-for="(item,index) in columnGroupList" :key="item.groupId" @click="handleform(item.groupId,index)"><span>{{item.groupName}}</span></div>
	     </el-col>
       <el-col :span="20" :xs="24" class="right">
        <form-create v-model="fApi" :rule="formlist" :option="options"></form-create>
        <div style="margin:0 0 0 185px;">
          <el-button type="primary"  @click="submit(1)">提 交</el-button>
          <el-button aligen="center"  @click="submit(2)">保 存</el-button>
        </div>    
	     </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import { column,columnGroup,areaCodeTree,projectsub,projectedit,projectDetail,remove } from "@/api/project/index";
import uploading from '@/components/uploadfileT'
import { mymixin }from '@/utils/mymixin'
export default {  
  mixins:[mymixin],
		components:{
      uploading,
		},
  name: "apply",
  data() {
    return {
      pjLibId:'',
      fApi:{},
      Index:0,
      qiyemingcheng:'',
      columnGroupList:[],
      form:{},
      formlist:[],
      formlist1:[],
      options:{
        submitBtn:false,
        resetBtn:false,
        form:{labelWidth: '185px'},
      },
      areacodeOptions:[],
      recordId:null,
      defaultProps: null,
      selectOrg: {
        orgsid: []
      },
      checked: [], // 存储选中节点的id
    };
  },
  created() {
    let id = this.$route.query.id
    let recordId = this.$route.query.recordId
    this.recordId = this.$route.query.recordId
    this.pjLibId = id
    this.getColumnGroup(id);
    this.gettree(id)
  },
  methods: {    
    removeArr(arr) {
      const res = new Map();
      return arr.filter((arr) => !res.has(arr.Id) && res.set(arr.Id, 1))
    },
    gettree(id){
      areaCodeTree(id).then(res=>{
        //console.log(res)
        this.areacodeOptions = res.data
         //this.areacodeOptions = res.data.children
       })
    },
    getInput(a){
        let that = this
        this.formlist1.forEach(item=>{
          item.hidden = true
        })
        a.forEach(item=>{
          let props = {}
          if(item.fieldCn=="项目属地"){
            item.formComponent="tree"
            item.data = this.areacodeOptions
            props = {
              data:this.areacodeOptions,
              checkStrictly:true,
              nodeKey:'id',
              showCheckbox:true,
              ref:'tree',
              props: {
                type:item.proptype,
                "label": "name"
              },
              showCheckbox:true,
            }
            item.on = {
              'check-change': function(data, checked, indeterminate){
                  const indexs = that.selectOrg.orgsid.indexOf(data.id)
                  // 如果不存在数组中，并且数组中已经有一个id并且checked为true的时候，代表不能再次选择。
                  if (indexs < 0 && that.selectOrg.orgsid.length === 1 && checked) {
                    that.$message({
                      message: '请只选择一个区域，选择多个会获取第一个提交',
                      type: 'error',
                      showClose: true
                    })
                    // 设置已选择的节点为false 很重要
                    //const vm = that.fApi.el('xiangmushudi')
                    //that.fApi.el('xiangmushudi').setChecked(data, false)
                  } else if (that.selectOrg.orgsid.length === 0 && checked) {
                    // 发现数组为空 并且是已选择
                    // 防止数组有值，首先清空，再push
                    that.selectOrg.orgsid = []
                    that.selectOrg.orgsid.push(data.id)
                  } else if (
                    indexs >= 0 &&
                    that.selectOrg.orgsid.length === 1 &&
                    !checked
                  ) {
                    // 再次直接进行赋值为空操作
                    that.selectOrg.orgsid = []
                  }
                }
              }
            
            
          }   
          if(item.formComponent=='datetime'||item.formComponent=='date'){
            let type=''
            if(item.formComponent=='datetime'){
              type='datetime'
            }else{
              type='date'
            }
            item.formComponent='DatePicker'
            props= {
              type:type,
              placeholder:item.fieldInputTips,
            }
          }     
          if(item.formComponent=='file'||item.formComponent=='image'){
            let type=''
            let accept=''
            if(item.formComponent=='file'){
              type='file'
            }else{
              type='image'
              accept = 'image\/*'
            }
            item.formComponent='upload'
            props= {
                uploadType:type,
                action: process.env.VUE_APP_BASE_API + "/ent/file/upload",
                headers: {
                    Authorization: 'Bearer ' + getToken()
                },
                data:{
                  fileType:5,
                },
                multiple: true,
                accept:accept,
                onSuccess:function (res, file) {
                  file.url = res.data.filePath;
                }
            }
          } 
          if(item.formComponent=='editor'||item.formComponent=='textarea'){
            item.formComponent='input'
            props= {
              type: "textarea",
              rows:'10'
            }
          }
          if(item.requiredFlag=="1"){
            item.requiredFlag = true
          }else{
            item.requiredFlag = false
          }          
          this.formlist1.push({
            type:item.formComponent,
            field:item.fieldEn,
            title:item.fieldCn,
            info : item.fieldInputTips,
            Id:item.pjLibFieldId,
            hidden:false,
            validate:[{ required: item.requiredFlag, message: '请输入'+item.fieldCn, trigger: 'blur' },],
            props:props,
            value:item.fieldValue,
            on: item.on
          })         
        })        
        this.formlist = this.removeArr(this.formlist1)
        this.formlist.forEach(item=>{
          a.forEach(itema=>{
            if(item.Id==itema.pjLibFieldId){
              item.hidden = false
            }
          })
        })
        //console.log(this.formlist)
        this.formlist
        this.loading = false;
    },
    /** 查询公告列表 */
    getColumn(id) {
      this.loading = true;
      if(this.recordId){
        projectDetail(id,this.recordId).then(res => {
          let a = res.data
          this.getInput(a)

        })
      }else{      
        column(id).then(res => {
          let a = res.data  
          this.getInput(a)
        });
      }
    },
    getColumnGroup(id) {
      columnGroup(id).then(res => {
        this.columnGroupList = res.data
        let groupId = res.data[0].groupId
        this.getColumn(groupId)
      });
    },
    handleform(id,index){
      this.Index = index
      this.getColumn(id)
      //this.formlist1.push(this.formlist)
    },

    submit(id){
      this.fApi.submit((formData, fApi)=>{
          let a = JSON.parse(JSON.stringify(formData))
          //console.log(a)
          let list = []
          let formlist = this.formlist
          for(var i in a){
              list.push({
                fieldValue:a[i],
              })
          }
          list.forEach((item,index)=>{
            item.pjLibFieldId = formlist[index].Id
            if(Array.isArray(item.fieldValue)){
              item.fieldValue = item.fieldValue[0]
            }
          })
          //console.log(queryParams)
          if(this.recordId){
            let queryParams = {
              areaCode: a.xiangmushudi[0],
              declareAmount: a.shenqingzhichijinewanyuan,
              fields: list,
              recordId: this.$route.query.recordId,
              projectName: a.xiangmumingcheng
            }
            projectedit(queryParams).then(res=>{
              if(res.code==200){
                
                this.$message({
                  message: '项目编辑成功',
                  type: 'success'
                })
                this.$router.push({
                  path: '/project/list',
                })
              }
            })

          }else{
            let queryParams = {
              areaCode: a.xiangmushudi[0],
              declareAmount: a.shenqingzhichijinewanyuan,
              fields: list,
              insertType: id,
              pjLibId: this.$route.query.id,
              projectName: a.xiangmumingcheng
            }
            projectsub(queryParams).then(res=>{
              if(res.code==200){
                this.$message({
                  message: '项目申报成功',
                  type: 'success'
                })
                this.$router.push({
                  path: '/project/list',
                })
              }
            })
          }
      })
    },    
  }
};
</script>
<style lang="scss" scoped>
.app-inner{
  .li{
    margin:10px 0;
    padding-left:15px;
    span{
      display:inline-block;
      padding:10px 30px;
      cursor: pointer;
    }

    &.on{
      span{
        background:rgb(24, 144, 255);
        color:#fff;
      }
      
    }
  }
  .right{
    border-left:1px solid #eee;
    padding-left:50px !important;
  }
}
</style>
