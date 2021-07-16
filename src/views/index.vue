<template>
  <div class="app-container">
    <div class="app-inner">
      <div v-if="!isshow">
        <div class="hello mb20">{{ user.userName }},您好,欢迎使用湖南省商务发展资金管理系统</div>
        <div v-if="!verifyStatus" class="hello mb20" @click="handleCheck">您的账号还未授权，请<span style="color:rgb(24, 144, 255)
        ">点击这里</span>填写企业工商信息进行授权</div>
        <div v-else-if="verifyStatus=='0'" class="hello mb20">
        资质填报成功，正在审核，请耐心等待
      </div>
        <div v-else-if="verifyStatus=='2'" class="hello mb20">您的资质授权失败，请<span style="color:rgb(24, 144, 255)
        ">点击这里</span>填写企业工商信息重新授权</div>
      </div>
      <div v-if="isshow">
      <div class="section mt20">
        <div class="hd"><h3>通知消息</h3><div class="more" @click="handleRouter">更多</div></div>
        <div class="bd">
          <div class="item" v-for="(item,index) in noticeList" :key="item.index" @click="handlequery(item,'notice')">
            <div class="title">{{item.logTitle}}</div>
            <div class="source">{{item.createDeptName}}</div>
            <div class="time">{{item.createTime}}</div>
          </div>
        </div>
      </div>
      <div class="section mt20">
        <div class="hd"><h3>待办事项</h3></div>
        <div class="bd">
          <div class="item">
            <div class="title">共<span>{{Count}}</span>个项目到位资金需要反馈<span class="query">查看</span></div>
          </div>
        </div>
      </div>
      <div class="section mt20">
        <div class="hd"><h3>站内信</h3></div>
        <div class="bd">
          <div class="item" v-for="(item,index) in MessageList" :key="item.index" @click="handlequery(item,'message')">
            <div class="title">{{item.msgTitle}}</div>
            <div class="source">{{item.createBy}}</div>
            <div class="time">{{item.updateTime}}</div>
          </div>
        </div>
      </div>
    </div>
    </div>

    <el-dialog :title="title" :visible.sync="open" width="780px" append-to-body @close='closedialog'>
      <div class="detailcontent">
        <div class="el-row br" v-if="notice">
          <div class="el-col-24"> <span>标题名称：</span>{{detailData.logTitle}}</div>
          <div class="el-col-24"><span>发布单位：</span>{{detailData.createDeptName}}</div>
          <div class="el-col-24"><span>发布时间：</span>{{detailData.createTime}}</div>
          <div class="el-col-24"> <span>内容：</span>{{detailData.logContent}}</div>
				</div>
        <div class="el-row br" v-if="Message">
          <div class="el-col-24"> <span>信件标题：</span>{{detailData.title}}</div>
          <div class="el-col-24"><span>发件人：</span>{{detailData.source}}</div>
          <div class="el-col-24"><span>发布时间：</span>{{detailData.time}}</div>
          <div class="el-col-24"> <span>内容：</span>{{detailData.content}}</div>
				</div>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { listNotice, getNotice} from "@/api/system/notice";
import { getUserProfile,getUserInfo } from "@/api/system/user";
import { budgettree,areacodetree,update,listMessage,getWaitCount} from "@/api/index";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Treeselect from "@riophae/vue-treeselect";
import uploading from '@/components/uploadfile'
import { mymixin }from '@/utils/mymixin'
export default {  
  mixins:[mymixin],
		components:{
			uploading,
			Treeselect,
		},
  data(){
    const myDate = new Date();
	  const Year = myDate.getFullYear();
    return{
      year:Year,
      value: [1],
      value4: [1],
      user:'',
      isshow:false,
      title:'',
      open:false,
      detailData:'',
      notice:false,
      Message:false,
      backlog:false,
      noticeList:[],
      listBacklog:[],
      MessageList:[],
      form:{},
      formopen:false,
      enterpriseOptions:[],
      industryOptions:[],
      verifyStatus:'',
      Count:''
    }
  },
  created(){ 
    this.getUser()
  },
   methods:{

     handleChange(value, direction, movedKeys) {
        //console.log(value, direction, movedKeys);
      },
    getUser() {
      getUserProfile().then(response => {
        this.user = response.data.user;
        let a= {
          year:this.year
        }
        getUserInfo(a).then(res=>{
          this.verifyStatus = res.data.verifyStatus
          if(res.data.verifyStatus != 1){
            this.isshow = false           
          }else{
            this.isshow = true  
            this.getList()
          }
        })
      });
    },
    getList() {
      listNotice(this.queryParams).then(response => {
        this.noticeList = response.rows;
      });
      listMessage(this.queryParams).then(response => {
        this.MessageList = response.rows;
      });
      getWaitCount().then(response => {
        this.Count = response.data.count;
      });

    },
    handleRouter(){
      this.$router.push({
            path: '/system/notice',
			})
    },
    handlequery(item,type){
      if(type == 'notice'){
        this.title = '通知消息'
        this.notice = true
      }else if(type == 'message'){
        this.title = '站内信'
        this.Message = true
      }else{
        this.title = '待办事项'
        this.backlog = true
      }
      this.detailData = item
      
      this.open = true

    },
    closedialog(){
      this.notice = false
      this.Message = false
      this.backlog = false
    },
    handleCheck(){
      /* this.getDictsList()
      this.formopen = true */
      this.$router.push('/info')
    },
    changeArea(){},


  }
}
</script>
<style lang="scss" scoped>
.section{
  width: 60%;
  .hd{
    display: flex;
    align-items: center;
    justify-content: space-between;
    h3{font-size: 18px;}
    .more{
      cursor: pointer;
      color:#999;
      &:hover{
          color:#1890FF;
        }

    }
  }
  .bd{
    .item{
      display: flex;     
      justify-content: space-between;
      line-height:30px;
      color:#666;
      .title{
        cursor: pointer;
        &:hover{
          color:#1890FF;
        }

      }
      .query{color:#1890FF;margin-left:20px;}
      

  }

  }
  
}

</style>

