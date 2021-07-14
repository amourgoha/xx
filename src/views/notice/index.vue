<template>
  <div class="app-container">
    <div class="app-inner">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="公告标题" prop="noticeTitle">
        <el-input
          v-model="queryParams.noticeTitle"
          placeholder="请输入公告标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="发布单位" prop="noticeType">
        <el-select v-model="queryParams.noticeType" placeholder="发布单位" clearable size="small">
          <el-option
            v-for="dict in typeOptions"
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

    <el-table v-loading="loading" :data="noticeList" :border="true">
      <el-table-column label="标题" align="center" prop="logTitle"  />
      <el-table-column label="内容" align="center" prop="logContent" :show-overflow-tooltip='true' />
      <el-table-column label="发布单位" align="center" prop="createDeptName"  />
      <el-table-column label="发布时间" align="center" prop="createTime" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleQuery(scope.row)"
          >详情</el-button>
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

    <el-dialog title="详情" :visible.sync="open" width="780px" append-to-body>
      <div class="detailcontent">
        <div class="el-row br">
          <div class="el-col-24"> <span>标题名称：</span>{{detailData.logTitle}}</div>
          <div class="el-col-12"><span>发布单位：</span>{{detailData.createDeptName}}</div>
          <div class="el-col-12"><span>发布时间：</span>{{detailData.createTime}}</div>
          <div class="el-col-24"> <span>内容：</span>{{detailData.logContent}}</div>
				</div>
       
      </div>
    </el-dialog>


  </div>
</template>

<script>
import { listNotice, getNotice, delNotice, addNotice, updateNotice, exportNotice } from "@/api/system/notice";
export default {
  name: "Notice",
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
      noticeList: [{
        id:'0',
        title:'您申报的项目"对外投资补贴"已获批',
        time:'2021年4月5日 15：30',
        source:'系统通知',
        content:'通知是我们经常可以看到的,在学校、单位、还有公共场所都可以看到。通知的类型也很多，上级对下级的某项工作的要求和安排叫指示性通知。这种通知要注意把要求和措施部分交待清楚，可以分条也可用小标题的形式，这样才能便于下级执行。会议性的通知大家都见过，一般就是目的、会议的名称、内容、参加人员、会议时间、地点等，要注意的是要把这些写正确，通知错时间地点就是你的失职了。通知还有批转性通知、转发性通知，这类的通知就是有话则长，无话则短，也就是要简明扼要，直接陈述事宜即可。有很多通知滥用介词，从而造成文题不通。比如“有关”还有“关于”，通知的事由一般都用关于，而有关就缩小了文题的内容含义，自然也就显得我们的水平太低了，还有要明确上下级的关系等等，写篇好的公文也并不是那么容易的。由于通知的功能多，种类多，写法彼此有较大的区别，我们在分类时已经有意识地对各种不同通知的写法作了一些介绍，这里只能概括介绍一些通知写作的基本方法。通知是我们经常可以看到的,在学校、单位、还有公共场所都可以看到。通知的类型也很多，上级对下级的某项工作的要求和安排叫指示性通知。这种通知要注意把要求和措施部分交待清楚，可以分条也可用小标题的形式，这样才能便于下级执行。会议性的通知大家都见过，一般就是目的、会议的名称、内容、参加人员、会议时间、地点等，要注意的是要把这些写正确，通知错时间地点就是你的失职了。通知还有批转性通知、转发性通知，这类的通知就是有话则长，无话则短，也就是要简明扼要，直接陈述事宜即可。有很多通知滥用介词，从而造成文题不通。比如“有关”还有“关于”，通知的事由一般都用关于，而有关就缩小了文题的内容含义，自然也就显得我们的水平太低了，还有要明确上下级的关系等等，写篇好的公文也并不是那么容易的。由于通知的功能多，种类多，写法彼此有较大的区别，我们在分类时已经有意识地对各种不同通知的写法作了一些介绍，这里只能概括介绍一些通知写作的基本方法。',
      },{
        id:'1',
        title:'请各企业申报项目的通知，请关注XX网',
        time:'2021年4月5日 15：30',
        source:'湖南省商务厅',
        content:'neir您申报的项目"对外投资补贴"已获批',
      }],
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
        /* noticeTitle: undefined,
        createBy: undefined,
        status: undefined */
      },
      detailData:'',


    };
  },
  created() {
    this.getList();
    
  },
  methods: {
    /** 查询公告列表 */
    getList() {
      this.loading = true;
      listNotice(this.queryParams).then(response => {
        this.noticeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 公告状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 公告状态字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.noticeType);
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
    
    handleQuery(row){
      this.detailData = row
      this.open = true
    }
  }
};
</script>
<style lang="scss">
.el-tooltip__popper{
    display: none !important
  }


</style>