<template>
  <div class="app-container">
    <div class="app-inner">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="审核状态" prop="recordStatus">
        <el-select v-model="queryParams.recordStatus" placeholder="审核状态" clearable size="small">
          <el-option
            v-for="dict in auditstatusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="年份" prop="year">
        <el-date-picker v-model="queryParams.year" type="year" placeholder="填报年份" value-format='yyyy'style="width:100%" :picker-options="expireTimeOption"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    </div>

    <div class="app-inner mt20">
      <el-row :gutter="10" class="mb20">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleApply"
        >项目申报</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleAudit"
        >提交审核</el-button>
      </el-col> -->
    </el-row>

    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange" :border="true">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="项目名称" align="center" prop="projectName"  />
      <el-table-column label="申报资金（元）" align="center" prop="declareAmount" />
      <el-table-column label="批复资金（元）" align="center" prop="approveAmount"  />
      <el-table-column label="申报时间" align="center" prop="createTime" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.declarationtime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="recordStatus"  />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handlesubmit(scope.row)"
            v-if="scope.row.recordStatus=='暂存'"
          >提交审核</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDetail(scope.row)"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    </div>

    <el-dialog title="项目详情" :visible.sync="open" width="1000px" append-to-body>
      <el-row :gutter="20">      		
	     <el-col :span="6" :xs="24">
         <div class="litableft" :class="{'on':Index==index}" v-for="(item,index) in columnGroupList" :key="item.groupId" @click="handleform(item.groupId,index)"><span>{{item.groupName}}</span></div>
	     </el-col>
       <el-col :span="18" :xs="24" class="right">
        <form-create v-model="fApi" :rule="formlist" :option="options"></form-create>       
	     </el-col>
      </el-row>
    </el-dialog>


  </div>
</template>

<script>
import { list,fundType,itemType,columnGroup,column,areaCodeTree,projectsub,projectedit,projectDetail,remove,projectCheck } from "@/api/project/index";
import uploading from '@/components/uploadfileT'
import { mymixin }from '@/utils/mymixin'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {  
  mixins:[mymixin],
		components:{
      uploading,
      Treeselect
		},
  name: "Notice",
  data() {
    return {
      expireTimeOption: {
        disabledDate (date) {
          //console.log(date.getTime())
          // disabledDate 文档上：设置禁用状态，参数为当前日期，要求返回 Boolean
          let b = new Date('2020').getTime()
          return date.getTime() >= Date.now() || date.getTime()<=b
        }
      },
      formtype:{},
      open1:true,
      showIndex:0,
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 公告表格数据
      list: [{
        id:'0',
        name:'对外投资补贴',
        declarationCapital:'300000',
        replyCapital:'200000',
        declarationtime:'2021年4月5日 15：30',
        auditstatus:'暂存',
      },{
        id:'1',
        name:'对外投资补贴',
        declarationCapital:'500000',
        replyCapital:'300000',
        declarationtime:'2021年6月5日 15：30',
        auditstatus:'驳回',
      }],
      // 是否显示弹出层
      open: false,
      add:{
        open:false
      },
      // 类型数据字典
      statusOptions: [],
      // 状态数据字典
      auditstatusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      detailData:'',
      form:{},
      typerules:{
        budgetLv1Id: [{ required: true, message: "请选择资金类型", trigger: "blur" }]
      },
      rules:{
        /* logoUrl: [
					{ required: true, message: "不能为空", trigger: "blur" }
        ], */
        /*contactNumber:[
						{ required: true, message: "联系电话不能为空", trigger: "blur" },
						{
              pattern: /^1[1-9]\d{9}$/,             
							message: "请输入正确的手机号码",
						}
				],
        email: [
          { required: true, message: "电子邮箱不能为空", trigger: "blur" },
          {
							pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
							message: "请输入正确的邮箱账号",
						}
        ],*/
      },
      formtypeOptions:[],
      projecttypeOptions:[],
      typeopen:false,
      recordId:'',
      pjLibId:'',
      fApi:{},
      Index:0,
      columnGroupList:[],
      form:{},
      formlist:[],
      formlist1:[],
      options:{
        submitBtn:false,
        resetBtn:false,
        form:{labelWidth: '185px',disabled:true},
      },

    };
  },
  created() {
    this.getDicts('rs_project_library_record_status').then(res =>{
      this.auditstatusOptions =res.data
    })
    this.getList();
    
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true;
      list(this.queryParams).then(res => {
        let a = res.rows       
        this.getDicts('rs_project_library_record_status').then(res =>{
          let list =res.data
          list.forEach(item=>{
            a.forEach(itema=>{
              if(item.dictValue == itema.recordStatus){
                itema.recordStatus = item.dictLabel
              }
            })
          })         
        })
        this.list = a;
        this.total = res.total;
        this.loading = false;
      });
    },
    getformtype(){
      fundType().then(res => {
        this.formtypeOptions = res.data;
      });
    },
    getprojecttype(id){
      itemType(id).then(res => {
        this.projecttypeOptions = res.data;
        
      });
    },
    normalizer(node) {
		      if (node.children && !node.children.length) {
		        delete node.children;
		      }
		      return {
		        id: node.budgetLv2Id,
		        label: node.budgetLv2Name,
		        children: node.children
		      }
		},
    change(e){
      console.log(e)
      this.getprojecttype(e)
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    
    handleDetail(row){
      this.recordId = row.recordId
      this.getColumnGroup(row.pjLibId,row.recordId)
      this.open = true
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.$router.push({
        path: './apply',
        query:{
          id:row.pjLibId,
          recordId:row.recordId
        }
      })
    },
    handleApply(){
      this.$router.push({
        path: '/project/category',
      })
    },
    handleAudit(){},
    removeArr(arr) {
      const res = new Map();
      return arr.filter((arr) => !res.has(arr.Id) && res.set(arr.Id, 1))
    },
    getInput(a){
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
              ref:'tree',
              props: {
                type:item.proptype,
                "label": "name"
              },
              showCheckbox:true,
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
          value:item.fieldValue
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
    },
    
    getColumn(groupId,recordId) {
      projectDetail(groupId,recordId).then(res => {
        let a = res.data
        this.getInput(a)
      })
    },
    getColumnGroup(id,id1) {
      columnGroup(id).then(res => {
        this.columnGroupList = res.data
        let groupId = res.data[0].groupId
        this.getColumn(groupId,id1)
      });
    },
    handlesubmit(row){
      this.recordId = row.recordId
      projectCheck(row.recordId).then(res=>{
        if(res.code==200){
          this.$message({
            message: '项目提交审核成功',
            type: 'success'
          })
          this.getList()
        }else{
          this.$message(res.msg)
        }
      })
    },
    handleform(id,index){
      this.Index = index
      this.getColumn(id,this.recordId)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const recordId = row.recordId
      this.$confirm('是否确认删除该项目', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return remove(recordId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
  
    }
};
</script>

<style lang="scss" scoped>
  .litableft{
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

</style>