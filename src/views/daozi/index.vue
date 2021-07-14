<template>
  <div class="app-container">
    <div class="app-inner">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="项目法企业名称" prop="projectEntName">
        <el-input
          v-model="queryParams.projectEntName"
          placeholder="项目法企业名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="统一社会信用代码" prop="entUsid">
        <el-input
          v-model="queryParams.entUsid"
          placeholder="统一社会信用代码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="企业类型" prop="entType">
        <el-select v-model="queryParams.entType" placeholder="企业类型" clearable size="small">
          <el-option
            v-for="dict in enttypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    </div>

    <div class="app-inner mt20">

    <el-table v-loading="loading" :data="listData" :border="true">
      <el-table-column label="项目名称" align="center" prop="projectName"  />
      <el-table-column label="申报资金（元）" align="center" prop="declareAmount" />
      <el-table-column label="批复资金（元）" align="center" prop="approveAmount"  />
      <el-table-column label="申报时间" align="center" prop="createTime" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="recordStatus"  />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
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
            @click="handleFeedback(scope.row)"
          >反馈</el-button>
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
    <el-dialog title="到资反馈" :visible.sync="backopen" width="780px" append-to-body>
      <div class="top" style="display: flex;justify-content: space-between;align-items: center;margin: -10px 0 10px;">
        <div class="name"><span>项目：{{projectName}}</span></div>
        <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="handleAdd"
          >添加反馈</el-button>
      </div>
      <el-table :data="listsubdata" :border="true">
        <el-table-column label="到资金额（元）" align="center" prop="receiveAmount"  />
        <el-table-column label="是否到位" align="center" prop="receiveFlag" />
        <el-table-column label="反馈时间" align="center" prop="updateTime"  />
        <el-table-column label="回复情况" align="center" prop="feedbackContent"  />
        <el-table-column label="资金使用方案" align="center" prop="fileName"  />
        <el-table-column label="资金使用方案" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handledown(scope.row)"
          >下载</el-button>
        </template>
      </el-table-column>
        
      </el-table>
    </el-dialog>
    <el-dialog title="添加反馈" :visible.sync="addopen" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="到位金额（元）：" prop="receiveAmount">
              <el-input v-model="form.receiveAmount" placeholder="请输入到位金额" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="">
            剩余到账金额 <span>{{balancedoler}}</span> 元
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="是否到位" prop="receiveFlag">
              <el-radio-group v-model="form.receiveFlag" size="medium" >
                <el-radio v-for="(item, index) in receiveFlagOptions" :key="index" :label="item.dictValue"
                :disabled="item.disabled">{{item.dictLabel}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="资金使用方案" prop="fileId">		         
              <uploading  v-model="fileId" :proofListdata='basicAccount'/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="回复" prop="feedbackContent">
              <el-input type="textarea" v-model="form.feedbackContent" placeholder="回复" size="small"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" style="padding-top:20px">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog title="详情" :visible.sync="open" width="780px" append-to-body>
      <div class="detailcontent">
        <div class="el-row br">
          <div class="el-col-24"> <span>项目名称：</span>{{detailData.projectName}}</div>
          <div class="el-col-12"><span>批复资金：</span>{{detailData.areaCode}}</div>
          <div class="el-col-12"><span>是否拨付：</span>{{detailData.payFlag}}</div>
          <div class="el-col-12"><span>拨付员：</span>{{detailData.payBy}}</div>
          <div class="el-col-12"> <span>拨付意见：</span>{{detailData.payMsg}}</div>
          
				</div>
       
      </div>
    </el-dialog>


  </div>
</template>

<script>
import { list, listsub, balance, entFeedback, feedbackDetail } from "@/api/daozi/index";
import uploading from '@/components/uploadfile'
export default {
  name: "Notice",
  components:{
			uploading,
		},
  data() {
    return {
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
      listData: [],
      // 是否显示弹出层
      open: false,
      // 类型数据字典
      statusOptions: [],
      // 状态数据字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      detailData:{},
      enttypeOptions:[],
      backopen:false,
      projectName:'',
      recordId:'',
      listsubdata:[],
      addopen:false,
      receiveFlagOptions:[{
        dictValue:'0',
        dictLabel:'否',
      },{
        dictValue:'1',
        dictLabel:'是',
      }],
      balancedoler:0,
      form:{},
      basicAccount:[],
      fileId:'',
      rules:{
        receiveAmount: [{required: true,message: '到资金额不能为空',trigger: 'change'}],
      },


    };
  },
  created() {
    this.getDicts('rs_ent_type').then(res =>{
      this.enttypeOptions =res.data
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
        this.listData = a;
        this.total = res.total;
        this.loading = false;
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    
    handleDetail(row){
      feedbackDetail(row.recordId).then(res=>{
        console.log(res)
        this.detailData = res.data
      })
      this.open = true
    },
    handleFeedback(row){
      this.projectName = row.projectName
      this.recordId = row.recordId
      listsub(row.recordId).then(res => {
        let a = res.rows              
        this.listsubdata = a;
      });
      this.backopen = true
    },
    handleAdd(){
      balance(this.recordId).then(res => {            
        this.balancedoler = res.data.balance;
      });
      this.addopen = true
    },
    handledown(){},
    submitForm(){
      this.$refs.form.validate(valid => {
        this.form.recordId = this.recordId
        if(this.fileId){
          this.form.fileId = this.fileId[0].response.data.fileId
        }
        entFeedback(this.form).then(res=>{
          if(res.code==200){
            this.$message({
              message: '到资反馈添加成功',
              type: 'success'
            })
          }
        })
      })
    },
    cancel(){
      this.addopen=false
    },
  }
};
</script>
<style lang="scss">
.el-tooltip__popper{
    display: none !important
  }


</style>